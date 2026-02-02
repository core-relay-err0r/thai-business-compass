"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
  size?: number;
}

export function Globe({ className, size = 600 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const updatePointerInteraction = useCallback((value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  }, []);

  const updateMovement = useCallback((clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  }, []);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [255, 255, 255],
      markerColor: [0.34, 0.56, 0.88],
      glowColor: [0.85, 0.9, 1],
      markers: [
        // Bangkok, Thailand - highlighted
        { location: [13.7563, 100.5018], size: 0.08 },
        // Major business hubs
        { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
        { location: [22.3193, 114.1694], size: 0.04 }, // Hong Kong
        { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
        { location: [31.2304, 121.4737], size: 0.03 }, // Shanghai
      ],
      onRender: (state) => {
        // Slow auto-rotation
        if (pointerInteracting.current === null) {
          phi += 0.002;
        }
        state.phi = phi + pointerInteractionMovement.current / 200;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => updatePointerInteraction(e.clientX)}
      onPointerUp={() => updatePointerInteraction(null)}
      onPointerOut={() => updatePointerInteraction(null)}
      onMouseMove={(e) => updateMovement(e.clientX)}
      onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      className={cn("aspect-square", className)}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        contain: "layout paint size",
      }}
    />
  );
}

export default Globe;
