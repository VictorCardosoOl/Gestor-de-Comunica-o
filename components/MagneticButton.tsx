
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number; // How strong the attraction is (default 0.3)
  title?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  strength = 0.3,
  title
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    // GSAP QuickTo for high-performance mouse following
    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    
    // Text moves slightly less for parallax effect inside button
    const xToText = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yToText = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * strength);
      yTo(y * strength);
      
      xToText(x * (strength * 0.5));
      yToText(y * (strength * 0.5));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xToText(0);
      yToText(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <button 
      ref={buttonRef}
      onClick={onClick}
      className={className}
      title={title}
    >
      <div ref={textRef} className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};
