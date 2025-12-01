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

# Lint and auto-fix code
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 4.x with custom design tokens
- **State Management**: Pinia (with persistedstate plugin)
- **Routing**: Vue Router 4 (uses `createWebHistory`)
- **HTTP Client**: Axios
- **Notifications**: Vue Toastification
- **Maps**: Naver Maps API

### Project Structure

```
src/
├── components/     # Reusable components (e.g., BaseHeader.vue, map components)
├── views/          # Page components connected to routes
├── router/         # Route definitions (index.js)
├── store/          # Pinia stores (index.js exports useAppStore)
├── composables/    # Composition API composables (e.g., useGeolocation, useNaverMap)
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

**State Management**: Pinia stores are organized in `src/store/`. The main store is `useAppStore` which can be imported and used in components. Create new stores following the same pattern using `defineStore`. Pinia is configured with the persistedstate plugin for automatic state persistence.

**Toast Notifications**: Vue Toastification is globally configured in `main.js` with position `top-right`, 3-second timeout, and a maximum of 3 toasts. Use `useToast()` in components to trigger notifications.

**Path Aliasing**: `@/` is aliased to `src/` in both Vite config (`vite.config.js`) and jsconfig.json for consistent imports.

**Component Pattern**: The codebase uses Vue 3 Composition API with `<script setup>` syntax. Components should follow this pattern.

**Layout Structure**: `App.vue` provides the shell with `BaseHeader` at the top and `RouterView` in a centered, max-width main content area. The header visibility is controlled based on route name (hidden for 'login' and 'nickname' pages).

**Design System**: Tailwind CSS is configured with custom Comeet brand colors:
- Primary color: `#667eea` (with shades from 50-900)
- Error color: `#ff9800`
- Background: `#f6f8fb`
- Font: Pretendard (fallback to system-ui)
- Custom shadows, spacing, and border radius tokens are defined in `tailwind.config.js`

## Configuration Notes

- Dev server port: `5173` (configured in vite.config.js)
- Base URL for router: Uses `import.meta.env.BASE_URL`
- Module type: ESM (specified in package.json)
- Environment variables are defined in `.env` and accessed via `import.meta.env.VITE_*`
- API base URL: `VITE_API_BASE_URL` (default: http://localhost:8080)
- Naver Maps API client ID: `VITE_NAVER_MAP_CLIENT_ID`
