import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reqIdRef = useRef<number>();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // Balanced — not too sluggish on scroll-up
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.0, 
      // Hardware-accelerated native mobile scroll
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      reqIdRef.current = requestAnimationFrame(raf);
    }

    reqIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
