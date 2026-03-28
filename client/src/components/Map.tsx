/**
 * Google Maps integration component.
 * Loads the Maps API via a proxy and initializes a map.
 *
 * USAGE:
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => { mapRef.current = map; }}
 * />
 *
 * @see https://developers.google.com/maps/documentation/javascript/overview
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Global type augmentation for window.google
declare global {
  interface Window {
    google?: typeof google;
  }
}

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

// ----------------------------------------------------------------------
// Script Loading
// ----------------------------------------------------------------------

let scriptPromise: Promise<void> | null = null;

/**
 * Loads the Google Maps API script once.
 * Returns a Promise that resolves when the script is loaded.
 */
function loadGoogleMapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    // Guard against missing API key
    if (!API_KEY) {
      reject(new Error("Missing VITE_FRONTEND_FORGE_API_KEY environment variable."));
      return;
    }

    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      script.remove(); // Clean up DOM element
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script. Check network or API key."));
      script.remove();
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

// ----------------------------------------------------------------------
// Component Props
// ----------------------------------------------------------------------

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  mapOptions?: Omit<google.maps.MapOptions, "center" | "zoom">;
  onMapReady?: (map: google.maps.Map) => void;
  onError?: (error: Error) => void;
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  mapOptions = {},
  onMapReady,
  onError,
}: MapViewProps): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();

        if (!isMounted) return;
        if (!mapContainer.current) {
          throw new Error("Map container not found.");
        }

        // Wait for Google Maps to be fully loaded
        if (!window.google?.maps) {
          throw new Error("Google Maps API not available after script load.");
        }

        const map = new window.google.maps.Map(mapContainer.current, {
          zoom: initialZoom,
          center: initialCenter,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
          mapId: "DEMO_MAP_ID",
          ...mapOptions,
        });

        mapInstance.current = map;
        onMapReady?.(map);
      } catch (error) {
        console.error("Map initialization error:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      // Optional: clean up map instance if needed
      if (mapInstance.current) {
        // No explicit dispose method; just remove references
        mapInstance.current = null;
      }
    };
  }, [initialCenter, initialZoom, mapOptions, onMapReady, onError]);

  return <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />;
}