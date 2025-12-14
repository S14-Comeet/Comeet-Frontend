# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Comeet Frontend is a Vue 3 + Vite mobile-first web application for a cafe discovery and social platform. The app features OAuth authentication, map-based cafe search using Naver Maps, saved cafes organization, and real-time notifications.

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
├── api/            # API clients (axios.js, auth.js, cafe.js, flavor.js, menu.js, review.js, visit.js)
├── assets/         # Global styles (main.css with Tailwind @theme), icons
├── components/     # Reusable UI components
│   ├── common/     # Base components (BaseButton, BaseHeader, BaseChip, StarRating, etc.)
│   ├── map/        # Map-specific components (MapControls, MapPlaceInfo, MapPlaceDetail, etc.)
│   ├── saved/      # Saved cafes feature components
│   └── review/     # Review feature components
├── composables/    # Vue composables (useGeolocation, useNaverMap)
├── constants/      # App-wide constants (STORAGE_KEYS, etc.)
├── router/         # Vue Router configuration with auth guards
├── store/          # Pinia stores (auth, saved, notification, flavor, etc.)
├── utils/          # Utility functions (storage, logger, toast, geolocation)
├── views/          # Page components (MapView, LoginView, ProfileView, MenuView, ReviewWriteView, etc.)
├── App.vue         # Root component with responsive layout shell
├── config.js       # App configuration (reads from .env)
└── main.js         # Application entry point
```

### Key Architectural Patterns

**Application Entry**: `src/main.js` initializes Vue app with Pinia (with persist plugin), Vue Router, and Vue Toastification. On app startup, it attempts to restore user session from localStorage if an access token exists.

**Authentication Flow**:
- OAuth-based authentication supporting Naver, Kakao, and Google providers (configured in `src/config.js`)
- JWT tokens stored in localStorage
- `src/api/axios.js` has request/response interceptors that:
  - Automatically inject access token into request headers
  - Handle 401 errors with automatic token refresh via `/api/auth/reissue` endpoint
  - Implement request queue during token refresh to prevent race conditions
  - Non-401 errors (4xx, 5xx) automatically trigger toast notifications
- `src/router/index.js` has navigation guards with two-phase logic:
  - **Public pages** (`PUBLIC_PAGES` Set + `PUBLIC_PATH_PATTERNS` regex array):
    - Static paths: `/map`, `/saved`, `/login`, `/oauth/callback`, `/test-components`
    - Dynamic patterns: `/store/:storeId` (matched via regex)
    - Unauthenticated users: Access granted
    - Authenticated users with role `GUEST`: Redirect to `/nickname`
    - Authenticated users trying to access `/login`: Redirect to `/`
  - **Private pages** (all others):
    - Unauthenticated users: Attempt token-based re-authentication, else redirect to `/login`
    - Authenticated users with role `GUEST`: Redirect to `/nickname`
    - Authenticated users: Access granted
- `src/store/auth.js` manages user state and authentication status with localStorage persistence
- `src/utils/storage.js` provides safe localStorage access with memory fallback for restricted environments (iframe, private browsing)
- **Session Restoration**: On app startup (`main.js`), if an access token exists in storage, `authStore.fetchUser()` is called to restore the user session. Failures clear the token and user state.

**Routing**: Routes are in `src/router/index.js`. To add a new page:
1. Create component in `src/views/`
2. Add route definition to `router/index.js`
3. Update `PUBLIC_PAGES` Set if route should be accessible without authentication
4. Update `pagesWithoutHeader` or `pagesWithoutNavigation` in `App.vue` if needed

**State Management**:
- Pinia stores in `src/store/` with automatic localStorage persistence
- Main stores: `useAuthStore` (auth.js), `useSavedStore` (saved.js), `useNotificationStore` (notification.js), `useFlavorStore` (flavor.js), `useAppStore` (index.js)
- All stores use `persist: { storage: safeStorage }` for safe cross-environment persistence

**API Layer**:
- Centralized axios instance in `src/api/axios.js` with `baseURL` from config
- Credentials included (`withCredentials: true`) for cookie-based refresh tokens
- Domain-specific API clients in `src/api/` (e.g., `auth.js`, `cafe.js`)
- Error handling: Non-401 errors trigger toast notifications via `showApiError()`

**Toast Notifications**:
- Vue Toastification configured in `main.js` (top-right, 3s timeout, max 3 toasts)
- Utility functions in `src/utils/toast.js`: `showSuccess()`, `showError()`, `showWarning()`, `showApiError()`
- API errors automatically show toast notifications via axios interceptor

**Logging**:
- Structured logging utility in `src/utils/logger.js` with `createLogger(component)` pattern
- Logs include component name prefix for better debugging
- Log levels: `error` (always), `warn` (production+), `info` (development), `debug` (VITE_ENABLE_DEBUG=true only)
- Example: `const logger = createLogger('MapView')` then `logger.info('Map initialized')`

**Component Pattern**:
- Vue 3 Composition API with `<script setup>` syntax
- Base components in `src/components/common/` follow `Base*` naming convention
- Feature-specific components organized in subdirectories (e.g., `map/`, `saved/`)

**Layout Structure**:
- `App.vue` provides responsive mobile-first shell (max-width 448px on desktop, centered with shadow)
- Conditional rendering: `BaseHeader` (hidden for login/nickname/map), `BaseNavigationBar` (hidden for login/nickname)
- Full-screen pages (e.g., map) use `.full-screen` class to override padding/constraints
- Navigation bar adds bottom padding to prevent content overlap

**Design System**:
- Tailwind CSS v4 with custom theme in `src/assets/main.css` using `@theme` directive
- Warm brown color palette (primary-50 through primary-950)
- Primary: `#846148` (brown), Accent/Cafe: `#ff9800` (orange), Success: `#66bb6a`, Error: `#d32f2f`
- Font: Pretendard (loaded from CDN)
- Additional config in `tailwind.config.js` (spacing, shadows, border radius)
- IMPORTANT: Colors 400 and 950 also defined in `:root` as workaround for Tailwind v4 bug

**Naver Maps Integration**:
- `src/composables/useNaverMap.js` provides map initialization and marker management
- Global Naver Maps script loaded via `index.html` with client ID from env
- `waitForNaverMaps()` helper polls for `window.naver.maps` availability before initialization

## Configuration Notes

- Dev server: Port `5173`, auto-opens browser (vite.config.js)
- Path aliasing: `@/` → `src/` (vite.config.js, jsconfig.json)
- Module type: ESM (package.json)
- Vite plugins: `@vitejs/plugin-vue`, `vite-svg-loader`, `@tailwindcss/vite`
- Environment variables (`.env`, access via `import.meta.env.VITE_*`):
  - `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:8080)
  - `VITE_NAVER_MAP_CLIENT_ID`: Naver Maps API client ID
  - `VITE_APP_TITLE`, `VITE_APP_VERSION`: App metadata
  - `VITE_ENABLE_DEBUG`: Enable debug logging

## Important Implementation Details

**Safe Storage Pattern**: Always use `src/utils/storage.js` helpers instead of direct `localStorage` access to handle restricted environments (iframe, private browsing):
```javascript
import { getItem, setItem, removeItem } from '@/utils/storage'
// For stores: import { safeStorage } from '@/utils/storage'
```

**Adding New Routes**: Remember to update multiple locations:
1. Route definition in `router/index.js`
2. `PUBLIC_PAGES` Set or `PUBLIC_PATH_PATTERNS` array in `router/index.js` (if unauthenticated access needed - NOTE: public pages still enforce GUEST checks for authenticated users)
3. `pagesWithoutHeader` Set in `App.vue:33` (if header should be hidden)
4. `pagesWithoutNavigation` Set in `App.vue:36` (if bottom nav should be hidden)
5. `isFullScreenPage` computed in `App.vue:47` (if page needs full viewport without padding)

**Token Refresh Mechanism**: The axios interceptor handles token refresh automatically. Avoid manually implementing refresh logic in components. If you get a 401 error that bypasses the interceptor, check if `originalRequest._retry` flag is being set.

**Mobile-First Responsive Design**: The app uses a mobile-first approach with a 448px max-width container on desktop. Full-screen pages (like map) should use `isFullScreenPage` computed property in `App.vue`.

**Component Naming**: Base reusable components use `Base*` prefix (BaseButton, BaseHeader). Feature-specific components don't use prefix (MapControls, SavedCafeList).
