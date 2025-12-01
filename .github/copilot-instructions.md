# ShoreSquad - AI Coding Instructions

## Project Overview

**ShoreSquad** is a social web app that mobilizes young people to organize and participate in beach cleanups. The platform combines interactive mapping, real-time weather tracking, and gamification to make ocean conservation fun and accessible. Built with vanilla HTML5, CSS3, and JavaScript—no frameworks, maximum performance.

**One-Line Pitch**: Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## Architecture & Key Components

### Frontend Application (`index.html`, `css/styles.css`, `js/app.js`)
- **Location**: Root directory
- **Purpose**: Single-page web app with responsive UI, interactive features, and real-time state management
- **Pattern**: Vanilla JS with centralized state (`appState` object), DOM caching (`DOM` object), and event delegation
- **Key APIs**: Geolocation, LocalStorage, Intersection Observer, CSS Grid/Flexbox

### State Management System (`js/app.js`)
- Centralized `appState` object tracks: user location, weather, cleanup events, user preferences
- Persists user preferences to localStorage
- No external state library—vanilla JS for performance

### Design System (`css/styles.css`)
- **Color Palette**: Ocean Blue (#00B4D8), Dark Navy (#0A3D62), Fresh Green (#06D6A0), Sandy Amber (#FFB703)
- **CSS Custom Properties**: 40+ variables for theming, spacing, typography, shadows
- **Responsive**: Mobile-first with breakpoints at 768px and 480px
- **Accessibility**: WCAG 2.1 AA compliance, reduced-motion support, focus indicators

## Critical Developer Workflows

### Local Development
```bash
# Install dependencies
npm install

# Start Live Server with auto-reload
npm start           # Port 5500 (default)
npm run dev         # Port 8080 with explicit watch

# Open browser to http://localhost:5500
```

### Testing & Debugging
```bash
# Console debugging
# app.js logs: appState, trackEvent(), performance metrics
console.log(appState)           # View current app state
trackEvent('event_name', {...}) # Track user interactions

# Browser DevTools
F12 → Console → Type appState to inspect state
F12 → Elements → .container class to inspect layout
```

### Building for Production
```bash
npm run build       # (Placeholder—currently just static files)
# Deploy entire project folder to static hosting (Vercel, Netlify, GitHub Pages)
```

## Project Conventions & Patterns

### Code Style
- **JavaScript**: Vanilla ES6+, no transpilation required
- **Function naming**: Camel case, descriptive (e.g., `handleLocateUser`, `updateMapMarkers`)
- **DOM queries**: Cached in `DOM` object at init; use `DOM.element` pattern
- **Comments**: JSDoc-style for functions, inline for complex logic
- **Error handling**: try-catch for async operations, user-facing `showNotification()` for feedback

### Common Patterns

**1. Event Listener Setup** (`setupEventListeners()`)
- All listeners attached in one function during `DOMContentLoaded`
- Use event delegation when handling multiple similar elements
- Passive listeners for scroll performance: `{ passive: true }`

**2. Async Operations** (Geolocation, Weather, Form Submit)
```javascript
// Pattern: navigator API → validation → state update → UI render
navigator.geolocation.getCurrentPosition(
    (position) => { appState.userLocation = {...}; updateUI(); },
    (error) => showNotification(errorMessage, 'error')
);
```

**3. State Updates & Rerendering**
```javascript
// Update state object, then call render function
appState.weatherData = newWeatherData;
updateWeatherDisplay(appState.weatherData);
```

**4. User Feedback** (`showNotification()`)
- Toast-style notifications (top-right, auto-dismiss)
- Types: 'info', 'success', 'error'
- Auto-removes after 3 seconds

### Configuration

**Environment Variables** (Future)
- `.env` file (add to .gitignore)
- API keys: OpenWeather, Mapbox, Analytics
- Feature flags: `ENABLE_SOCIAL_FEATURES`, etc.

**User Preferences** (LocalStorage)
```javascript
// Stored in localStorage as JSON
appState.userPreferences = { units: 'metric', notifications: true, darkMode: false }
saveUserPreferences()  // Persists to localStorage
```

**Live Server Config** (`.vscode/settings.json`)
```json
{
  "liveServer.settings.port": 5500,
  "liveServer.settings.ignoreFiles": [".vscode/**", ".git/**", "node_modules/**"]
}
```

## Integration Points & Dependencies

### External APIs (Currently Mocked)

**Weather Forecast** (Mock → Real)
- **Current**: Simulated data in `loadWeatherData()`, `fetchWeatherForLocation()`
- **Recommendation**: OpenWeather One Call API (waves/tides) or Weatherbit
- **Implementation**: Replace mock with `fetch()` call, same data structure

**Maps & Geolocation** (Mock → Real)
- **Current**: Placeholder UI with mock cleanup markers
- **Recommendation**: Leaflet.js (lightweight) or Mapbox GL (styled)
- **Implementation**: Initialize map in `initializeMap()`, add markers from `appState.cleanups`

**Analytics & Tracking** (Stub → Real)
- **Current**: `trackEvent()` logs to console only
- **Recommendation**: Google Analytics 4, Mixpanel, or Plausible
- **Implementation**: Uncomment `gtag('event', ...)` calls in `trackEvent()`

### Key Dependencies
- **live-server** (dev): Local development server with hot reload
- **No production dependencies**: Vanilla JS, pure CSS (no SASS/PostCSS currently)

## Important Files Reference

| File | Purpose | Lines | Key Exports/Functions |
|---|---|---|---|
| `index.html` | Semantic structure, sections, form markup | 280 | Hero, Map, Features, Community, CTA sections |
| `css/styles.css` | Complete design system with custom properties | 800 | `.hero`, `.features-grid`, `.community-card`, mobile breakpoints |
| `js/app.js` | Application state, event handlers, integrations | 500 | `appState`, `setupEventListeners()`, `handleLocateUser()`, `trackEvent()` |
| `package.json` | Dependencies, scripts, project metadata | 30 | `npm start`, `npm run dev` |
| `.gitignore` | Git exclusions | 15 | node_modules, .env, dist/ |
| `README.md` | Complete project documentation | 400 | Design principles, roadmap, troubleshooting |

## Performance Considerations

- **No CSS framework** (no Bootstrap/Tailwind): Write custom CSS for smaller bundle
- **Vanilla JS only**: No jQuery, React, Vue—faster load and execution
- **Lazy loading**: Intersection Observer for images (when added)
- **Event delegation**: Single listener on containers vs. multiple listeners
- **CSS custom properties**: Enables theme switching without JS

---

**Status**: Production-ready MVP. Ready for API integrations and mobile app ports.
