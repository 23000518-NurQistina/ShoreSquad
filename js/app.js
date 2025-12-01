/**
 * ShoreSquad - Interactive Application
 * Handles navigation, map interactions, weather, and user engagement
 * Performance optimized with lazy loading and event delegation
 */

// ==========================================
// State Management
// ==========================================

const appState = {
    userLocation: null,
    weatherData: null,
    cleanups: [],
    userPreferences: {
        units: 'metric', // imperial or metric
        notifications: true,
        darkMode: false
    }
};

// ==========================================
// DOM Caching & Performance
// ==========================================

const DOM = {
    navbar: document.querySelector('.navbar'),
    navbarMenu: document.getElementById('navbar-menu'),
    mobileToggle: document.getElementById('mobile-toggle'),
    mapPlaceholder: document.getElementById('map-placeholder'),
    mapLocate: document.getElementById('map-locate'),
    mapWeather: document.getElementById('map-weather'),
    weatherDisplay: document.getElementById('weather-display'),
    signupForm: document.getElementById('signup-form'),
    ctaPrimary: document.getElementById('cta-primary'),
    ctaSecondary: document.getElementById('cta-secondary'),
    mapMarkers: document.getElementById('map-markers'),
};

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupMobileNavigation();
    setupEventListeners();
    loadUserPreferences();
    initializeMap();
    loadWeatherData();
    loadCleanupEvents();
    setupPerformanceOptimizations();
    logAppMetrics();
}

// ==========================================
// Mobile Navigation
// ==========================================

function setupMobileNavigation() {
    DOM.mobileToggle?.addEventListener('click', toggleMobileMenu);
    
    // Close menu when link clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            DOM.navbarMenu?.classList.remove('active');
            DOM.mobileToggle?.classList.remove('active');
        });
    });
}

function toggleMobileMenu() {
    DOM.navbarMenu?.classList.toggle('active');
    DOM.mobileToggle?.classList.toggle('active');
}

// ==========================================
// Event Listeners Setup
// ==========================================

function setupEventListeners() {
    // Map controls
    DOM.mapLocate?.addEventListener('click', handleLocateUser);
    DOM.mapWeather?.addEventListener('click', toggleWeatherOverlay);
    
    // CTA buttons
    DOM.ctaPrimary?.addEventListener('click', () => handleCtaClick('start'));
    DOM.ctaSecondary?.addEventListener('click', () => handleCtaClick('explore'));
    
    // Form submission
    DOM.signupForm?.addEventListener('submit', handleSignupSubmit);
    
    // Smooth scroll with performance monitoring
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Scroll animations
    window.addEventListener('scroll', handleScrollAnimations, { passive: true });
}

// ==========================================
// Location & Weather Functions
// ==========================================

function handleLocateUser() {
    if (!navigator.geolocation) {
        showNotification('Geolocation not supported', 'error');
        return;
    }

    showNotification('📍 Finding your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            appState.userLocation = { latitude, longitude };
            handleLocationSuccess(latitude, longitude);
        },
        (error) => {
            handleLocationError(error);
        }
    );
}

function handleLocationSuccess(lat, lon) {
    showNotification(`📍 Found you at ${lat.toFixed(2)}, ${lon.toFixed(2)}`, 'success');
    updateMapMarkers(lat, lon);
    
    // Fetch weather for this location
    fetchWeatherForLocation(lat, lon);
    
    // Animate to map section
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
}

function handleLocationError(error) {
    const errorMessages = {
        1: 'Permission denied. Please enable location access.',
        2: 'Location unavailable. Try again.',
        3: 'Location request timed out.'
    };
    showNotification(errorMessages[error.code] || 'Location error', 'error');
}

async function loadWeatherData() {
    // Simulate weather data loading
    // In production, integrate with real API (OpenWeather, WeatherAPI, etc.)
    
    const mockWeatherData = {
        temperature: 22,
        condition: 'Sunny',
        waves: '1-1.5m',
        windSpeed: 13,
        humidity: 65,
        uvIndex: 7
    };
    
    appState.weatherData = mockWeatherData;
    updateWeatherDisplay(mockWeatherData);
}

async function fetchWeatherForLocation(lat, lon) {
    // This would integrate with a real weather API
    console.log(`Fetching weather for ${lat}, ${lon}`);
    
    // Simulated data (metric: Celsius, km/h, meters)
    const weatherData = {
        temperature: 18 + Math.random() * 12,
        condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
        waves: `${(0.6 + Math.random() * 1.2).toFixed(1)}-${(1.2 + Math.random() * 1.2).toFixed(1)}m`,
        windSpeed: Math.floor(8 + Math.random() * 16),
        humidity: Math.floor(50 + Math.random() * 40),
        uvIndex: Math.floor(Math.random() * 11)
    };
    
    updateWeatherDisplay(weatherData);
}

function updateWeatherDisplay(weatherData) {
    const tempUnit = appState.userPreferences.units === 'metric' ? '°C' : '°F';
    const speedUnit = appState.userPreferences.units === 'metric' ? 'km/h' : 'mph';
    
    if (DOM.weatherDisplay) {
        DOM.weatherDisplay.innerHTML = `
            <div class="weather-card">
                <span class="weather-icon">☀️</span>
                <span class="weather-temp">${Math.round(weatherData.temperature)}${tempUnit}</span>
                <span class="weather-desc">${weatherData.condition}, waves ${weatherData.waves}</span>
                <div style="margin-top: 12px; font-size: 0.875rem; opacity: 0.9;">
                    💨 Wind: ${weatherData.windSpeed}${speedUnit} | 💧 Humidity: ${weatherData.humidity}%
                </div>
            </div>
        `;
    }
}

function toggleWeatherOverlay() {
    showNotification('🌤️ Weather overlay toggled', 'info');
}

// ==========================================
// Map Functions
// ==========================================

function initializeMap() {
    // Mock cleanup events - featuring Pasir Ris as next cleanup
    appState.cleanups = generateMockCleanups();
    updateMapMarkers();
    highlightNextCleanup();
}

function generateMockCleanups() {
    return [
        { id: 0, name: 'Pasir Ris Beach', lat: 1.381497, lon: 103.955574, volunteers: 52, date: '2025-12-02', isNext: true },
        { id: 1, name: 'Malibu Beach Cleanup', lat: 34.0195, lon: -118.6814, volunteers: 42, date: '2025-12-05' },
        { id: 2, name: 'Santa Monica Pier Cleanup', lat: 34.0195, lon: -118.4965, volunteers: 28, date: '2025-12-06' },
        { id: 3, name: 'Huntington Beach Drive', lat: 33.8815, lon: -118.0023, volunteers: 35, date: '2025-12-07' },
        { id: 4, name: 'Laguna Beach Rally', lat: 33.5427, lon: -117.7827, volunteers: 18, date: '2025-12-08' }
    ];
}

function highlightNextCleanup() {
    // Highlight the next cleanup event (Pasir Ris)
    const nextCleanup = appState.cleanups.find(cleanup => cleanup.isNext);
    if (nextCleanup) {
        console.log(`📍 Next Cleanup: ${nextCleanup.name} (${nextCleanup.volunteers} volunteers)`);
        trackEvent('next_cleanup_displayed', { location: nextCleanup.name, lat: nextCleanup.lat, lon: nextCleanup.lon });
    }
}

function updateMapMarkers(centerLat = null, centerLon = null) {
    if (!DOM.mapMarkers) return;
    
    // Clear existing markers
    DOM.mapMarkers.innerHTML = '';
    
    // Add cleanup markers
    appState.cleanups.forEach(cleanup => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.innerHTML = `
            <div style="background: linear-gradient(135deg, #00B4D8, #0096C7); padding: 8px 12px; border-radius: 8px; color: white; font-size: 0.875rem; cursor: pointer; transition: all 0.3s;">
                <strong>${cleanup.name}</strong>
                <p style="margin: 4px 0 0; font-size: 0.75rem; opacity: 0.9;">${cleanup.volunteers} volunteers • ${cleanup.date}</p>
            </div>
        `;
        marker.addEventListener('click', () => showCleanupDetails(cleanup));
        DOM.mapMarkers.appendChild(marker);
    });
}

function showCleanupDetails(cleanup) {
    showNotification(`🏄 ${cleanup.name} - ${cleanup.volunteers} volunteers joining!`, 'success');
    // In production: open modal or detail view
}

// ==========================================
// Form Handlers
// ==========================================

function handleSignupSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = e.target.querySelector('input[type="email"]').value;
    const location = e.target.querySelector('input[type="text"]').value;
    
    if (!email || !location) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    // Simulate signup
    console.log('Signup:', { email, location });
    showNotification(`✅ Welcome to ShoreSquad! Check your email at ${email}`, 'success');
    e.target.reset();
    
    // Track signup event
    trackEvent('signup', { location });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleCtaClick(action) {
    const actions = {
        start: () => {
            showNotification('🚀 Starting a cleanup... coming soon!', 'info');
            trackEvent('cta_click', { action: 'start_cleanup' });
        },
        explore: () => {
            document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
            trackEvent('cta_click', { action: 'explore_map' });
        }
    };
    
    actions[action]?.();
}

// ==========================================
// Utility Functions
// ==========================================

function handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            trackEvent('navigation', { target: href });
        }
    }
}

function handleScrollAnimations() {
    // Lazy load animations for elements as they come into view
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('animated');
        }
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#06d6a0' : '#00B4D8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function loadUserPreferences() {
    const saved = localStorage.getItem('appPreferences');
    if (saved) {
        appState.userPreferences = { ...appState.userPreferences, ...JSON.parse(saved) };
    }
}

function saveUserPreferences() {
    localStorage.setItem('appPreferences', JSON.stringify(appState.userPreferences));
}

// ==========================================
// Analytics & Performance
// ==========================================

function trackEvent(eventName, eventData = {}) {
    // Track user interactions for analytics
    console.log(`📊 Event: ${eventName}`, eventData);
    
    // In production: send to analytics service (Google Analytics, Mixpanel, etc.)
    // Example: gtag('event', eventName, eventData);
}

function logAppMetrics() {
    // Performance monitoring
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
        
        // Track if page load exceeds threshold
        if (pageLoadTime > 3000) {
            console.warn('⚠️ Slow page load detected');
        }
    }
}

function setupPerformanceOptimizations() {
    // Lazy load images if not already loaded
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==========================================
// Animations (CSS-in-JS fallback)
// ==========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ==========================================
// Export for module support
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { appState, initializeApp, trackEvent };
}
