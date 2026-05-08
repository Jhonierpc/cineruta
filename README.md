# CineRuta

Guía interactiva para descubrir el orden cronológico correcto de sagas,
franquicias y universos cinematográficos.

## Stack
- Next.js 15 (App Router) + React 19
- TypeScript estricto
- Tailwind CSS v4
- TMDB API

## Setup
```bash
npm install
cp .env.local.example .env.local   # rellenar TMDB_API_KEY
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — correr el build
- `npm run lint` — ESLint
- `npm run type-check` — verificar tipos TS

## Documentación
Ver [`CLAUDE.md`](./CLAUDE.md) para el contexto completo del proyecto, convenciones, agentes y flujo de ramas.

Creado: 2026-05-08
