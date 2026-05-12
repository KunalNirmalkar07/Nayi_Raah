import { useState, useEffect } from "react";

/**
 * Preloads an image and returns whether it's ready.
 * Injects a <link rel="preload"> for browser-level priority
 * and uses an Image() object to track load completion.
 */
export function useImagePreload(src: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject preload link for maximum browser priority
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.fetchPriority = "high";
    document.head.appendChild(link);

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // fallback so UI isn't stuck
    img.src = src;

    return () => {
      document.head.removeChild(link);
    };
  }, [src]);

  return loaded;
}
