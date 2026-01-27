import React, { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin outside component to avoid re-registration
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothWrapperProps {
  children: React.ReactNode;
  className?: string;
  wrapperRef?: React.RefObject<HTMLElement>;
  contentRef?: React.RefObject<HTMLElement>;
  resetDependency?: any;
}

export const SmoothWrapper: React.FC<SmoothWrapperProps> = ({ 
  children, 
  className, 
  wrapperRef, 
  // contentRef is purposely ignored for Lenis config to allow natural scroll layout
  resetDependency 
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    // 1. Resolve the wrapper element
    const targetWrapper = wrapperRef?.current || window;
    
    // Safety check: If we are in a scoped mode (wrapperRef provided) but ref is null, abort.
    if (wrapperRef && !wrapperRef.current) return;

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.0, // Reduced from 1.2 for faster feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disabled on touch to prevent gesture conflicts
      touchMultiplier: 2,
      // @ts-ignore
      wrapper: targetWrapper,
      // We do NOT set 'content' here. When 'wrapper' has overflow:auto (native scroll), 
      // Lenis just animates the scrollTop. Setting content explicitly can break if DOM nesting is complex.
    });

    lenisRef.current = lenis;

    // 3. Sync with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 4. Add to GSAP Ticker
    const update = (time: number, deltaTime: number, frame: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(update);
    
    // Optional: Disable lag smoothing to prevent jumpiness during heavy loads
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef]); // Dependencies reduced to wrapperRef

  // 5. Handle scroll reset triggers (e.g., searching/filtering)
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [resetDependency]);

  return (
    <div className={className} style={{ width: '100%' }}>
      {children}
    </div>
  );
};