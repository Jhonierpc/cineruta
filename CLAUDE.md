# CineRuta – Contexto del proyecto

## ¿Qué es?
Guía interactiva para descubrir el orden cronológico correcto de sagas,
franquicias y universos cinematográficos. NO es una plataforma de streaming.
Es una herramienta de consulta y orientación para el usuario.

## Funcionalidades principales
1. Catálogo completo de películas, series y animes (vía TMDB API)
2. Guía cronológica de sagas — orden de estreno y cronología narrativa
3. Reparto y elenco con imágenes
4. Filmografía cronológica de actores reales

## Lo que NO es
- No reproduce contenido
- No requiere login en una primera versión
- No es un agregador de streaming

## API principal
TMDB (The Movie Database) — https://www.themoviedb.org/documentation/api

## Stack confirmado
- **Next.js 15** (App Router) — frontend + backend en un solo proyecto
- **React 19**
- **TypeScript 5** (estricto)
- **Tailwind CSS v4**
- **TMDB API** para datos e imágenes (con `language=es-ES` para títulos localizados automáticos)
- **Despliegue**: Vercel

## Repositorio y trazabilidad
- **GitHub**: https://github.com/Jhonierpc/cineruta (público)
- **Notion (Proyecto)**: https://www.notion.so/35b268921f9281d19ffeee12df970c1a
- **Notion (Area)**: Desarrollo de Software → https://www.notion.so/35a268921f9281509942d8b203ff7532
- **Notion (Objetivo v1)**: https://www.notion.so/35b268921f92817f9166ff2cc982c5c7

## Estrategia de datos (v1)
- **TMDB**: catálogo, imágenes, reparto, filmografía → fuente externa, sin DB local
- **Cronologías curadas**: archivos JSON estáticos en `data/sagas/`
- **Sin base de datos** en v1. Se incorporará cuando aparezca la necesidad (auth, listas de usuario, etc.) — el `database-agent` se encargará entonces de la migración.

## Convenciones de código
- Carpetas en kebab-case
- Componentes en PascalCase (`SagaTimeline.tsx`)
- Variables y funciones en camelCase
- TypeScript estricto, props tipados explícitamente
- Server Components por defecto; `"use client"` solo cuando sea necesario
- Imports absolutos con alias `@/*`

## Estructura de carpetas
```
cineruta/
├── app/                       # App Router
│   ├── api/tmdb/health/       # GET diagnóstico TMDB con errores sanitizados
│   ├── sagas/                 # listado de sagas curadas
│   ├── sagas/[slug]/          # detalle con timeline + toggle Cronológico/Estreno
│   ├── peliculas/[id]/        # detalle de película (backdrop, sinopsis, reparto)
│   ├── actores/[id]/          # detalle de actor con filmografía cronológica
│   ├── layout.tsx             # SiteHeader + main + SiteFooter
│   ├── page.tsx               # home cinematográfica
│   └── globals.css            # design tokens (dark + amber accent)
├── components/                # PascalCase
│   ├── SiteHeader.tsx, SiteFooter.tsx
│   ├── SagaCard.tsx, ChronologyTimeline.tsx, OrderTabs.tsx
│   ├── MoviePoster.tsx, MovieHero.tsx, CastList.tsx
│   └── PersonHero.tsx, FilmographyList.tsx
├── lib/
│   ├── tmdb/                  # client.ts (Bearer auth, caching 24h), types.ts, movies.ts, tv.ts, persons.ts
│   └── chronologies/          # types.ts (Saga, ChronologyEntry, EnrichedEntry), loader.ts (fs/promises)
├── data/sagas/                # mcu.json (34), star-wars.json (11), star-wars-machete.json (5)
├── public/
├── .claude/agents/            # 7 agentes especializados
├── .github/workflows/ci.yml   # type-check + lint + build + tests
└── docs/devops-setup.md       # paso a paso GitHub + Vercel + branch protection
```

## Agentes especializados

Cada área del proyecto tiene un agente dedicado en `.claude/agents/`. Invocar el agente correcto cuando la tarea caiga en su dominio.

| Agente | Responsabilidad | Prefijo de rama |
|---|---|---|
| `frontend-agent` | UI, componentes, páginas, Tailwind, accesibilidad | `JRZ/cineruta/frontend/...` |
| `backend-agent` | API routes, integración TMDB, server actions | `JRZ/cineruta/backend/...` |
| `database-agent` | Modelo de datos, esquema, futuras migraciones | `JRZ/cineruta/database/...` |
| `docs-agent` | README, CLAUDE.md, ADRs, guías técnicas | `JRZ/cineruta/docs/...` |
| `devops-agent` | Vercel, env vars, CI/CD | `JRZ/cineruta/devops/...` |
| `qa-agent` | Tests unit / integración / e2e | `JRZ/cineruta/qa/...` |
| `data-curation-agent` | Curaduría manual de cronologías | `JRZ/cineruta/data/...` |

## Convención de ramas (obligatoria)

Formato: `JRZ/cineruta/<area>/<tipo>-<descripcion-corta-kebab>`

- **JRZ** — iniciales del autor (Jhonier Rias Zapata)
- **cineruta** — nombre del proyecto
- **area** — frontend, backend, database, docs, devops, qa, data
- **tipo** — `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`
- **descripcion** — kebab-case, breve

**Ejemplos**:
- `JRZ/cineruta/frontend/feat-saga-timeline`
- `JRZ/cineruta/backend/feat-tmdb-movie-details`
- `JRZ/cineruta/database/refactor-chronology-types`
- `JRZ/cineruta/data/feat-mcu-infinity-saga`
- `JRZ/cineruta/devops/chore-vercel-setup`
- `JRZ/cineruta/qa/feat-tmdb-client-tests`
- `JRZ/cineruta/docs/feat-tmdb-setup-guide`

**Reglas**:
- Cada agente abre su propia rama por tarea (no una rama persistente compartida)
- Cada rama → un PR contra `main`
- PRs pequeños y revisables (1 saga, 1 endpoint, 1 componente)
- `main` siempre en estado deployable

## Aprendizajes operativos (del v1)

Lecciones de la primera tanda de 12 PRs mergeados a `main`. Aplicar a futuros PRs.

### Workflow de ramas con dependencias cruzadas
Cuando una rama de **frontend** necesita código que aún vive en otra rama (típicamente **backend** sin mergear), evitar el "test merge" (mergear la rama dependiente DENTRO de la rama de feature solo para testear localmente). Crea merge commits que ensucian el PR final. **Mejor flujo:**
1. Mergear primero la rama base (backend / data) a `main`
2. Rebasar la rama dependiente onto el nuevo `main`
3. Si por velocidad necesitas el "test merge", al momento de PR haz `git reset --hard origin/main && git cherry-pick <feature-sha>` y force-push para limpiar la historia

### Fechas ISO de TMDB y zona horaria
TMDB devuelve fechas como `"1965-04-04"`. `new Date("1965-04-04")` parsea como UTC midnight; al formatear en TZ negativo (Bogotá -5, etc.) se renderiza un día antes. **Solución obligatoria** para fechas tipo "fecha pura" (cumpleaños, estrenos): usar `timeZone: "UTC"` en `Intl.DateTimeFormat`. Ver `components/PersonHero.tsx`.

### Filtrado de créditos TMDB
`/person/{id}/combined_credits` incluye proyectos sin `release_date`/`first_air_date` (cancelados, sin estrenar). Filtrar por `date && date.length >= 4` antes de ordenar cronológicamente.

### Server Components y secretos
`process.env.TMDB_API_KEY` (sin prefijo `NEXT_PUBLIC_`) solo existe server-side. Esto da defensa en profundidad sin necesidad del paquete `server-only`. Si una future client component lo importa por error, falla en runtime con error claro.

### Pre-render estático con searchParams
`generateStaticParams` + `searchParams` funciona: la URL canónica se pre-renderiza, las variantes con `?order=release` se renderizan en request. No hace falta JS para el toggle.

## Skills disponibles (usar cuando aplique)
- `react-best-practices`, `composition-patterns`, `web-design-guidelines`, `react-view-transitions` — frontend
- `deploy-to-vercel`, `vercel-cli-with-tokens` — devops
- `simplify` — limpieza periódica
- `review`, `security-review` — antes de mergear PRs

## Setup local
```bash
npm install
cp .env.local.example .env.local   # rellenar TMDB_API_KEY
npm run dev
```

## Estado

**v1 funcional end-to-end** desde 2026-05-08. Los 4 pilares del proyecto están implementados:

| Pilar | Implementación |
|---|---|
| Catálogo TMDB | `/peliculas/[id]` con backdrop, sinopsis, géneros, runtime, top 12 del reparto |
| Guía cronológica de sagas | `/sagas/[slug]` con timeline + toggle Cronológico/Estreno |
| Reparto con imágenes | Cards en `/peliculas/[id]` linkeadas a `/actores/[id]` |
| Filmografía cronológica | `/actores/[id]` con bio, foto y filmografía oldest-first |

**Datos curados disponibles**: MCU completo (34), Star Wars Skywalker (11), Star Wars Machete (5). Todos los TMDB IDs verificados.

**Repo en GitHub** con 12 commits lineales en `main`, uno por PR.

### Pendientes conocidos (a tomar en futuros PRs)

| Pendiente | Agente | Prioridad |
|---|---|---|
| Conectar Vercel desde dashboard + `TMDB_API_KEY` env var | `devops-agent` (manual) | Alta |
| Branch protection en `main` | `devops-agent` (manual) | Media |
| Mobile menu en `SiteHeader` (hidden bajo `sm:` actualmente) | `frontend-agent` | Media |
| `next lint` deprecado → migrar a ESLint CLI con `next-lint-to-eslint-cli` | `devops-agent` | Baja |
| `npm audit fix` para 2 vulnerabilidades moderate | `devops-agent` | Baja |
| Tests con Vitest para `loader`, `tmdb/client`, componentes clave | `qa-agent` | Media |
| `/peliculas` catálogo (no solo detalle) | `frontend-agent` | Media |
| `/series/[id]` para entradas con `kind: tv` | `frontend-agent` + `backend-agent` | Media |
| Más sagas curadas (Harry Potter, LOTR, Disney+ del MCU) | `data-curation-agent` | Media |
