import type { LessonContent } from '@/types/content';

export const geolocationLesson: LessonContent = {
  id: 'geolocation',
  title: 'Geolocation',
  description: 'Get the user\'s location from their browser using GPS, WiFi, or cell towers.',
  slug: 'learn/browser/geolocation',
  pillar: 'learn',
  category: 'browser',
  tags: ['geolocation', 'location', 'GPS', 'browser'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'The Geolocation API gets the user\'s position — just ask for permission first, and use HTTPS.',
  relatedTopics: ['fetch'],
  order: 6,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['geolocation', 'GPS', 'latitude', 'longitude', 'getCurrentPosition', 'watchPosition', 'reverse geocoding'],
  prerequisites: ['Callbacks', 'Promises'],
  learningGoals: [
    'Get the user\'s current position',
    'Watch for position changes in real time',
    'Handle permission errors gracefully',
    'Convert coordinates to addresses (reverse geocoding)',
    'Calculate distances between coordinates',
    'Build location-aware React components',
  ],
  exercises: [
    'Build a "Find my location" button that displays coordinates on a map.',
    'Create a distance calculator between two geographic points.',
    'Implement a "nearby stores" feature using the Geolocation API.',
    'Build a running tracker that watches position changes.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Overview', id: 'overview' },
    { type: 'paragraph', text: 'The Geolocation API (`navigator.geolocation`) provides access to the device\'s geographic position. It uses various sources including GPS, Wi-Fi, cell tower triangulation, and IP-based location. The API requires explicit user permission and only works over HTTPS.' },
    { type: 'paragraph', text: 'Two main methods: `getCurrentPosition()` for one-time location, and `watchPosition()` for continuous tracking. Both use callbacks (not Promises natively), but are easy to wrap.' },

    { type: 'heading', level: 2, text: 'Get Current Position', id: 'current-position' },
    {
      type: 'code', language: 'javascript', filename: 'geolocation.js',
      code: `navigator.geolocation.getCurrentPosition(
  // Success callback
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
    console.log('Accuracy:', position.coords.accuracy, 'meters');
    console.log('Altitude:', position.coords.altitude); // null if unavailable
    console.log('Speed:', position.coords.speed);        // null if unavailable
    console.log('Heading:', position.coords.heading);    // null if unavailable
    console.log('Timestamp:', position.timestamp);
  },
  // Error callback
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied geolocation permission');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Position unavailable');
        break;
      case error.TIMEOUT:
        console.error('Request timed out');
        break;
    }
  },
  // Options
  {
    enableHighAccuracy: true,  // Use GPS if available (slower, battery drain)
    timeout: 10000,            // Max wait time in ms
    maximumAge: 0,             // Don’t use cached position
  }
);`,
    },

    { type: 'heading', level: 2, text: 'Position Options', id: 'options' },
    {
      type: 'table',
      headers: ['Option', 'Type', 'Default', 'Description'],
      rows: [
        ['enableHighAccuracy', 'boolean', 'false', 'Use GPS for precise location (slower, uses more battery)'],
        ['timeout', 'number', 'Infinity', 'Max time to wait for a position (milliseconds)'],
        ['maximumAge', 'number', '0', 'Accept cached position if younger than this (milliseconds)'],
      ],
    },
    { type: 'callout', variant: 'tip', title: 'Battery vs Precision', text: '`enableHighAccuracy: true` activates GPS, giving ~10m accuracy but draining battery. Set to `false` for Wi-Fi/cell-based location (~100m accuracy) when exact position isn\'t critical.' },

    { type: 'heading', level: 2, text: 'Promise Wrapper', id: 'promise-wrapper' },
    { type: 'paragraph', text: 'The native API uses callbacks. Wrap it in a Promise for modern async/await usage:' },
    {
      type: 'code', language: 'typescript', filename: 'geo-promise.ts',
      code: `interface GeoOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

function getCurrentPosition(options?: GeoOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Usage
try {
  const position = await getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
  });
  const { latitude, longitude } = position.coords;
  console.log(\`Location: \${latitude}, \${longitude}\`);
} catch (err) {
  console.error('Failed to get location:', err.message);
}`,
    },

    { type: 'heading', level: 2, text: 'Watching Position', id: 'watch' },
    { type: 'paragraph', text: '`watchPosition()` continuously tracks the user\'s location, calling your callback whenever the position changes. Returns an ID to stop watching:' },
    {
      type: 'code', language: 'javascript', filename: 'watch.js',
      code: `// Start watching
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude, accuracy, speed } = position.coords;
    console.log(\`Position: \${latitude}, \${longitude}\`);
    console.log(\`Accuracy: \${accuracy}m, Speed: \${speed || 0} m/s\`);

    // Update map marker, track route, etc.
    updateMapMarker(latitude, longitude);
    trackRoute(latitude, longitude);
  },
  (error) => {
    console.error('Watch error:', error.message);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 5000,    // Accept 5-second-old positions
    timeout: 15000,
  }
);

// Stop watching (important for battery life!)
navigator.geolocation.clearWatch(watchId);

// Always clear on cleanup
window.addEventListener('beforeunload', () => {
  navigator.geolocation.clearWatch(watchId);
});`,
    },

    { type: 'heading', level: 2, text: 'Calculate Distance (Haversine)', id: 'distance' },
    {
      type: 'code', language: 'typescript', filename: 'distance.ts',
      code: `function getDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth’s radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Usage
const distance = getDistanceKm(
  40.7128, -74.0060,  // New York
  51.5074, -0.1278    // London
);
console.log(\`Distance: \${distance.toFixed(1)} km\`); // ~5570.2 km

// Find nearby locations
function findNearby(userLat, userLon, locations, maxKm) {
  return locations
    .map(loc => ({
      ...loc,
      distance: getDistanceKm(userLat, userLon, loc.lat, loc.lon),
    }))
    .filter(loc => loc.distance <= maxKm)
    .sort((a, b) => a.distance - b.distance);
}`,
    },

    { type: 'heading', level: 2, text: 'Reverse Geocoding', id: 'reverse-geocoding' },
    { type: 'paragraph', text: 'Convert coordinates to a human-readable address using a geocoding API:' },
    {
      type: 'code', language: 'javascript', filename: 'reverse-geocode.js',
      code: `// Using OpenStreetMap Nominatim (free, no API key)
async function reverseGeocode(lat, lon) {
  const res = await fetch(
    \`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lon}&format=json\`,
    { headers: { 'User-Agent': 'MyApp/1.0' } } // Required by Nominatim
  );
  const data = await res.json();
  return {
    address: data.display_name,
    city: data.address.city || data.address.town,
    country: data.address.country,
  };
}

// Usage
const pos = await getCurrentPosition();
const location = await reverseGeocode(
  pos.coords.latitude,
  pos.coords.longitude
);
console.log('You are in:', location.city, location.country);`,
    },

    { type: 'heading', level: 2, text: 'React Hook', id: 'react-hook' },
    {
      type: 'code', language: 'tsx', filename: 'useGeolocation.tsx',
      code: `import { useState, useEffect, useCallback } from 'react';

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

function useGeolocation(watch = false) {
  const [state, setState] = useState<GeoState>({
    latitude: null, longitude: null, accuracy: null,
    error: null, loading: true,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    const onSuccess = (pos: GeolocationPosition) => {
      setState({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      setState(s => ({ ...s, error: err.message, loading: false }));
    };

    const options = { enableHighAccuracy: true, timeout: 10000 };

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
      return () => navigator.geolocation.clearWatch(id);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [watch]);

  useEffect(() => {
    const cleanup = getLocation();
    return cleanup;
  }, [getLocation]);

  return { ...state, refresh: getLocation };
}

// Usage
function LocationDisplay() {
  const { latitude, longitude, accuracy, error, loading, refresh } = useGeolocation();

  if (loading) return <p>Getting your location...</p>;
  if (error) return <p>Error: {error} <button onClick={refresh}>Retry</button></p>;

  return (
    <div>
      <p>Lat: {latitude?.toFixed(6)}</p>
      <p>Lng: {longitude?.toFixed(6)}</p>
      <p>Accuracy: {accuracy?.toFixed(0)}m</p>
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Error Handling', id: 'error-handling' },
    {
      type: 'table',
      headers: ['Error Code', 'Constant', 'Meaning', 'User Action'],
      rows: [
        ['1', 'PERMISSION_DENIED', 'User denied the permission request', 'Show instructions to enable in settings'],
        ['2', 'POSITION_UNAVAILABLE', 'Location info unavailable', 'Try again later or use IP-based fallback'],
        ['3', 'TIMEOUT', 'Request timed out', 'Retry with longer timeout or lower accuracy'],
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'error-handling.js',
      code: `async function getLocationWithFallback() {
  try {
    return await getCurrentPosition({ timeout: 5000 });
  } catch (err) {
    if (err.code === 1) {
      // Permission denied — use IP-based geolocation as fallback
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        coords: { latitude: data.latitude, longitude: data.longitude, accuracy: 50000 },
        fallback: true,
      };
    }
    throw err;
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Permission Best Practices', id: 'permission-ux' },
    {
      type: 'list',
      items: [
        'Never request location on page load — wait for a user action',
        'Explain WHY you need location before requesting it',
        'Provide a fallback experience if permission is denied',
        'Show a loading indicator while waiting for the GPS fix',
        'Let users manually enter their location as an alternative',
        'Use the Permissions API to check status before requesting',
      ],
    },
    {
      type: 'code', language: 'javascript', filename: 'permission-check.js',
      code: `// Check permission before requesting
async function checkGeoPermission() {
  if (!navigator.permissions) return 'unknown';

  const result = await navigator.permissions.query({ name: 'geolocation' });
  // 'granted' | 'denied' | 'prompt'

  if (result.state === 'denied') {
    showInstructions('Enable location in browser settings');
  }

  return result.state;
}`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Requesting on page load
window.onload = () => {
  navigator.geolocation.getCurrentPosition(handler);
  // Bad UX â user doesn’t know why you want their location
};

// ✅ Fix: Request only after user interaction
findMeButton.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(handler);
});

// ❌ Mistake 2: Not clearing watchPosition
const id = navigator.geolocation.watchPosition(handler);
// Memory leak + battery drain if never cleared!

// ✅ Fix: Always clear on cleanup
return () => navigator.geolocation.clearWatch(id);

// ❌ Mistake 3: Ignoring the error callback
navigator.geolocation.getCurrentPosition(onSuccess);
// If permission is denied, nothing happens — no feedback!

// ✅ Fix: Always provide error callback
navigator.geolocation.getCurrentPosition(onSuccess, onError);

// ❌ Mistake 4: Using over HTTP
// Geolocation silently fails on HTTP (non-HTTPS) pages
// ✅ Fix: Always use HTTPS`,
    },
    { type: 'callout', variant: 'warning', title: 'HTTPS Required', text: 'Geolocation only works on secure contexts (HTTPS and localhost). It will silently fail on HTTP pages — no error, no prompt, just nothing happens.' },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What sources does the Geolocation API use to determine position?',
        'What\'s the difference between getCurrentPosition and watchPosition?',
        'How do you calculate distance between two coordinates?',
        'What happens when the user denies geolocation permission?',
        'Why does geolocation require HTTPS?',
        'How would you implement a "nearby stores" feature?',
        'What is the Haversine formula?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Only request location in response to user action, never on page load',
        'Always provide both success and error callbacks',
        'Clear watchPosition when the component unmounts or tracking stops',
        'Use enableHighAccuracy only when precision is needed (maps, navigation)',
        'Set a reasonable timeout (5-15 seconds)',
        'Provide manual location entry as a fallback',
        'Cache the last known position in localStorage for faster startup',
        'Consider IP-based geolocation as a privacy-friendly alternative',
      ],
    },
  ],
};
