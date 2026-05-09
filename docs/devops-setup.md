# Devops · Setup de GitHub + Vercel + CI

Esta guía cubre los pasos manuales que viven fuera del repo. El workflow de CI ya está en `.github/workflows/ci.yml` y se activará automáticamente apenas el repo esté en GitHub.

---

## 1. Subir el repo a GitHub

### 1.1. Crear el repo
1. Ir a https://github.com/new
2. **Repository name**: `cineruta`
3. Visibilidad: privado o público (a tu criterio)
4. **NO** marcar "Initialize this repository with a README/.gitignore/license" — ya los tenemos
5. Click **Create repository**

### 1.2. Conectar el repo local
GitHub te muestra los comandos. Para nuestro caso:

```bash
git remote add origin https://github.com/<TU-USUARIO>/cineruta.git
git branch -M main
git push -u origin main
```

### 1.3. Subir las ramas de feature
Cuando trabajes en una rama de un agente (ej: `JRZ/cineruta/devops/chore-ci-and-vercel-setup`):

```bash
git push -u origin <nombre-de-la-rama>
```

Y abre el PR desde la UI de GitHub.

---

## 2. Conectar Vercel (Dashboard)

### 2.1. Importar el proyecto
1. Ir a https://vercel.com/new
2. Si es la primera vez, autorizar acceso de Vercel a tu cuenta de GitHub
3. **Import Git Repository** → seleccionar `cineruta`
4. **Framework Preset**: Next.js (autodetectado)
5. **Root Directory**: `./` (dejar default)
6. **Build & Output Settings**: dejar defaults
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2.2. Configurar variables de entorno
En la misma pantalla de import, sección **Environment Variables**:

| Nombre | Valor | Entornos |
|---|---|---|
| `TMDB_API_KEY` | tu API key de TMDB (v4 Read Access Token) | Production, Preview, Development |
| `TMDB_API_BASE_URL` | `https://api.themoviedb.org/3` | (opcional, ya tiene default) |
| `TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` | (opcional, ya tiene default) |
| `TMDB_DEFAULT_LANG` | `es-ES` | (opcional) |

> **Solicitar API key**: https://www.themoviedb.org/settings/api → solicitar acceso (es gratis).

### 2.3. Deploy
Click **Deploy**. El primer deploy toma ~1–2 min. Vercel asigna un dominio `cineruta-<hash>.vercel.app`.

### 2.4. Comportamiento automático
A partir de aquí, Vercel:
- Despliega **Production** automáticamente en cada push a `main`
- Despliega **Preview** automáticamente en cada PR (con URL única por PR)

> **Pre-requisito para auto-deploys**: tu cuenta de Vercel necesita una **GitHub Login Connection** activa (https://vercel.com/account/login-connections). Sin ella, `vercel link --repo` falla con `400: You need to add a Login Connection to your GitHub account first` y los pushes no disparan deploys.

---

## 2bis. Alternativa: Vercel CLI con token (no-dashboard)

Cuando hace falta provisionar el proyecto sin abrir el dashboard (CI, agentes, scripting), se puede usar la CLI con un Personal Access Token. Usa la skill `vercel-cli-with-tokens`.

### 2bis.1. Token y CLI
1. Crear token en https://vercel.com/account/tokens (scope: tu cuenta).
2. Exportarlo (nunca pasar como `--token` en línea de comandos):
   ```bash
   export VERCEL_TOKEN="<token>"
   npm install -g vercel
   vercel whoami    # debe imprimir tu username
   ```

### 2bis.2. Linkear el proyecto
La cuenta personal **no se acepta como `--scope`**; usa el team auto-creado (`<user>s-projects`):
```bash
SCOPE="$(vercel teams ls 2>&1 | awk 'NR>3 && $1!=""{print $1; exit}')"
vercel link --yes --project cineruta --scope "$SCOPE"
```

Si la GitHub Login Connection ya está activa, esto crea el proyecto en Vercel **y** conecta el repo de GitHub en una sola pasada. Si no, el link local funciona pero la conexión remota a GitHub hay que hacerla luego desde el dashboard (Project → Settings → Git → Connect Git Repository).

### 2bis.3. Cargar variables de entorno
Production y Development aceptan stdin sin más:
```bash
extract() { grep "^$1=" .env.local | head -1 | cut -d= -f2-; }

for name in TMDB_API_KEY TMDB_API_BASE_URL TMDB_IMAGE_BASE_URL TMDB_DEFAULT_LANG; do
  val=$(extract "$name")
  for env in production development; do
    printf '%s' "$val" | vercel env add "$name" "$env" --scope "$SCOPE"
  done
done
```

**Preview con `vercel env add` requiere `<gitbranch>`** aun pasando `--yes --value`; el modo "all preview branches" sin branch concreta falla en non-interactive con `git_branch_required`. Workaround vía API REST (preserva la semántica de "todos los branches"):
```bash
TEAM_ID=$(jq -r .orgId .vercel/project.json)
PROJECT_ID=$(jq -r .projectId .vercel/project.json)

for name in TMDB_API_KEY TMDB_API_BASE_URL TMDB_IMAGE_BASE_URL TMDB_DEFAULT_LANG; do
  val=$(extract "$name")
  body=$(jq -nc --arg k "$name" --arg v "$val" \
    '{key:$k, value:$v, type:"encrypted", target:["preview"]}')
  curl -sS -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$TEAM_ID" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$body" >/dev/null
done

vercel env ls --scope "$SCOPE"   # verificar 4 vars × 3 envs = 12 entradas
```

### 2bis.4. Primer deploy preview desde CLI
```bash
vercel deploy --yes --scope "$SCOPE"
```
Sube los archivos locales y hace un build. Útil para validar antes de mergear.

### 2bis.5. Higiene
- Rotar el token al terminar: https://vercel.com/account/tokens.
- `.vercel/` ya está en `.gitignore` — no commitearlo.

---

## 3. CI en GitHub Actions

El workflow `.github/workflows/ci.yml` corre automáticamente en:
- Cada PR contra `main`
- Cada push a `main`

Verifica:
1. **Type-check** — `tsc --noEmit`
2. **Lint** — `next lint`
3. **Build** — `next build`
4. **Test** — `npm test --if-present` (no-op si no hay tests todavía)

### 3.1. Cuando empieces a usar TMDB en build-time
Algunas páginas estáticas pueden consumir TMDB en `next build`. Cuando eso pase:
1. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Crear `TMDB_API_KEY` con el mismo valor que en Vercel
3. En `.github/workflows/ci.yml`, descomentar la línea `TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}` en el step de Build

---

## 4. Branch protection (recomendado, no obligatorio)

Una vez el repo esté en GitHub:
1. **Settings → Branches → Branch protection rules → Add rule**
2. Branch name pattern: `main`
3. Activar:
   - ✓ Require a pull request before merging
   - ✓ Require status checks to pass before merging
     - Buscar y agregar: `type-check · lint · build · test`
   - ✓ Require branches to be up to date before merging
   - (opcional) Require approvals: 1

Esto garantiza que `main` siempre quede en estado deployable.

---

## 5. Convención de ramas (recordatorio)

Formato: `JRZ/cineruta/<area>/<tipo>-<descripcion-kebab>`

Cada agente del proyecto trabaja en su propia rama y abre PR contra `main`. Detalle completo en `CLAUDE.md`.
