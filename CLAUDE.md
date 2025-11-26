# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Comeet Frontend is a Vue 3 + Vite application for the Comeet project. The codebase is in initial setup stage with a minimal scaffolding structure in place.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173, auto-opens browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 5.x
- **State Management**: Pinia
- **Routing**: Vue Router 4 (uses `createWebHistory`)
- **HTTP Client**: Axios

### Project Structure

```
src/
├── components/     # Reusable components (e.g., BaseHeader.vue)
├── views/          # Page components connected to routes
├── router/         # Route definitions (index.js)
├── store/          # Pinia stores (index.js exports useAppStore)
├── composables/    # Composition API composables
├── utils/          # Utility functions
├── assets/         # Global styles and static resources (main.css)
├── App.vue         # Root component with BaseHeader + RouterView
└── main.js         # Application entry point
```

### Key Architectural Patterns

**Application Entry**: `src/main.js` initializes the Vue app, registers Pinia and Vue Router, and mounts to `#app`.

**Routing**: Routes are defined in `src/router/index.js`. To add a new page:
1. Create a component in `src/views/`
2. Add a route definition in `router/index.js`

**State Management**: Pinia stores are organized in `src/store/`. The main store is `useAppStore` which can be imported and used in components. Create new stores following the same pattern using `defineStore`.

**Path Aliasing**: `@/` is aliased to `src/` in both Vite config (`vite.config.js`) and jsconfig.json for consistent imports.

**Component Pattern**: The codebase uses Vue 3 Composition API with `<script setup>` syntax. Components should follow this pattern.

**Layout Structure**: `App.vue` provides the shell with `BaseHeader` at the top and `RouterView` in a centered, max-width main content area.

## Configuration Notes

- Dev server port: `5173` (configured in vite.config.js)
- Base URL for router: Uses `import.meta.env.BASE_URL`
- Module type: ESM (specified in package.json)
