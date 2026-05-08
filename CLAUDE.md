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
- **TMDB API** para datos e imágenes
- **Despliegue**: Vercel

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
├── app/                  # rutas y layouts (App Router)
│   ├── api/              # endpoints (proxy TMDB, datos curados)
│   └── ...
├── components/           # componentes React (PascalCase)
├── lib/
│   ├── tmdb/             # cliente y tipos de TMDB
│   └── chronologies/     # tipos y lógica de cronologías
├── data/
│   └── sagas/            # JSON curados de cronologías
├── public/               # estáticos
├── .claude/
│   └── agents/           # definiciones de los 7 agentes especializados
├── docs/                 # documentación técnica y ADRs
└── e2e/                  # tests end-to-end (cuando se agreguen)
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
Estructura base lista (Next.js + TS + Tailwind + agentes). Próximos pasos: definir rutas, conectar TMDB, primeras cronologías curadas.
