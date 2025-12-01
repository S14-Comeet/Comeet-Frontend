/** @type {import('tailwindcss').Config} */
/**
 * Comeet Frontend - Tailwind Configuration
 *
 * ⚠️ COLOR SYSTEM LOCATION:
 * All color definitions are in src/assets/main.css using @theme directive.
 * This follows Tailwind v4 best practices for CSS-native theming.
 *
 * This config file handles:
 * - Content paths (what files to scan)
 * - Non-color extensions (spacing, shadows, etc.)
 * - Plugins
 */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Typography
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            fontFamily: {
                sans: ['Pretendard', 'system-ui', 'sans-serif'],
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Spacing (custom values beyond default scale)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            spacing: {
                '18': '4.5rem',   // 72px - Custom gap size
                '88': '22rem',    // 352px - Large container width
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Border Radius
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            borderRadius: {
                'DEFAULT': '8px',   // Standard rounded corners
                'lg': '16px',       // Large rounded (cards, modals)
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Box Shadows - Comeet Design System
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            boxShadow: {
                'sm': '0 2px 4px rgba(0, 0, 0, 0.08)',          // Subtle elevation
                'DEFAULT': '0 4px 12px rgba(0, 0, 0, 0.08)',    // Standard cards
                'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',         // Modals, overlays
                'button-hover': '0 4px 12px rgba(0, 0, 0, 0.15)', // Interactive feedback
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Transitions
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            transitionDuration: {
                'DEFAULT': '200ms',  // Standard UI transitions
            },
        },
    },
    plugins: [],
}
