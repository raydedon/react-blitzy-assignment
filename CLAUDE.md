# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then `vite build`
- `npm run lint` — Oxlint (not ESLint); config in `.oxlintrc.json` (react, typescript, oxc plugins; `react/rules-of-hooks` is an error)
- `npm run preview` — serve the production build

There is no test runner configured.

## Architecture

Fresh Vite + React 19 + TypeScript template (ESM, `"type": "module"`); currently just `src/main.tsx` (entry, mounts into `index.html`) and `src/App.tsx`, with styles in `src/index.css` / `src/App.css`.

- **React Compiler is enabled** via `babel-plugin-react-compiler` through `@rolldown/plugin-babel` in `vite.config.ts`. Components should follow the Rules of React; avoid manual `useMemo`/`useCallback` unless needed. It slows dev/build somewhat.
- TypeScript is split into project references: `tsconfig.app.json` (src) and `tsconfig.node.json` (vite config), which is why build uses `tsc -b`.
- `react/only-export-components` is a warning: keep component files exporting only components (constants allowed).
