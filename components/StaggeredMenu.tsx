import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './StaggeredMenu.css';

interface MenuItem {
  label: string;
  id: string;
  ariaLabel?: string;
}

interface StaggeredMenuProps {
  items: MenuItem[];
  activeId: string;
  onSelectItem: (id: string) => void;
  socialItems?: { label: string; link: string }[];
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  items = [],
  activeId,
  onSelectItem,
  socialItems = [],
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  
  // Refs for DOM elements
  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  
  // Refs for Animations
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  
  // State for button text animation
  const [textLines, setTextLines] = useState(['Menu', 'Fechar']);

  // --- INITIAL SETUP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      
      if (!panel || !preContainer) return;

      const preLayers = gsap.utils.toArray('.sm-prelayer') as HTMLElement[];
      const offscreen = 100; // Right side

      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusHRef.current, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusVRef.current, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(textInnerRef.current, { yPercent: 0 });
    });
    return () => ctx.revert();
  }, []);

  // --- BUILD TIMELINE ---
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;

    // Cleanup previous animations
    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    
    // Select dynamic elements
    const layers = gsap.utils.toArray('.sm-prelayer') as HTMLElement[];
    const itemEls = gsap.utils.toArray('.sm-panel-itemLabel') as HTMLElement[];
    const numberEls = gsap.utils.toArray('.sm-panel-item') as HTMLElement[]; // Using item wrapper for numbers
    const socialLinks = gsap.utils.toArray('.sm-socials-link') as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title');

    // Reset properties for entry
    gsap.set(itemEls, { yPercent: 140, rotate: 5 });
    gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    gsap.set(socialLinks, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    // 1. Wipe Layers (FASTER)
    layers.forEach((el, i) => {
      tl.to(el, { xPercent: 0, duration: 0.4, ease: 'power4.inOut' }, i * 0.04);
    });

    // 2. Panel Entry (FASTER)
    const panelStart = layers.length * 0.04;
    tl.to(panel, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, panelStart);

    // 3. Items Stagger (FASTER)
    const contentStart = panelStart + 0.2;
    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 0,
        rotate: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.03
      }, contentStart);

      tl.to(numberEls, {
        '--sm-num-opacity': 1,
        duration: 0.4,
        stagger: 0.03
      }, contentStart + 0.05);
    }

    // 4. Socials (FASTER)
    if (socialLinks.length) {
       tl.to([socialTitle, ...socialLinks], {
         y: 0,
         opacity: 1,
         duration: 0.5,
         stagger: 0.03
       }, contentStart + 0.2);
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  // --- ACTIONS ---
  const toggleMenu = useCallback(() => {
    const willOpen = !openRef.current;
    openRef.current = willOpen;
    setOpen(willOpen);

    // Animate Button Text
    const inner = textInnerRef.current;
    if (inner) {
        // Cycle logic: Menu -> Close -> Menu
        const targetLabel = willOpen ? 'Fechar' : 'Menu';
        const newSeq = [willOpen ? 'Menu' : 'Fechar', '...', targetLabel];
        setTextLines(newSeq);
        
        gsap.killTweensOf(inner);
        gsap.set(inner, { yPercent: 0 });
        gsap.to(inner, {
            yPercent: -66.6, // Move up 2 lines
            duration: 0.6, // Faster text swap
            ease: 'expo.inOut'
        });
    }

    // Animate Icon
    if (iconRef.current) {
        gsap.to(iconRef.current, {
            rotate: willOpen ? 135 : 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    }

    // Play Main Animation
    if (willOpen) {
        const tl = buildOpenTimeline();
        tl?.play();
    } else {
        // Close Sequence (FASTER)
        openTlRef.current?.kill();
        const panel = panelRef.current;
        const layers = gsap.utils.toArray('.sm-prelayer') as HTMLElement[];
        
        if (panel) {
            closeTweenRef.current = gsap.to([panel, ...layers], {
                xPercent: 100,
                duration: 0.4,
                ease: 'power3.inOut',
                stagger: { amount: 0.1, from: "end" } // Reverse order
            });
        }
    }
  }, [buildOpenTimeline]);

  const handleItemClick = (id: string) => {
    onSelectItem(id);
    toggleMenu(); // Close after selection
  };

  return (
    <div className="staggered-menu-wrapper" data-open={open}>
      {/* Wipe Layers - Using Editorial Colors */}
      <div ref={preLayersRef} className="sm-prelayers">
         <div className="sm-prelayer" style={{ background: '#e5e5e5' }} />
         <div className="sm-prelayer" style={{ background: '#d4d4d4' }} />
         <div className="sm-prelayer" style={{ background: '#111111' }} /> 
      </div>

      <header className="staggered-menu-header">
        {/* Placeholder for alignment */}
        <div /> 
        
        <button
          ref={toggleBtnRef}
          className="sm-toggle text-black bg-white/50"
          onClick={toggleMenu}
        >
          <span className="sm-toggle-textWrap">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span key={i} className="leading-none block h-full flex items-center justify-end">{l}</span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon text-black">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line" />
          </span>
        </button>
      </header>

      <aside ref={panelRef} className="staggered-menu-panel">
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering="true">
             <li className="sm-panel-itemWrap">
                <button 
                    className={`sm-panel-item ${activeId === 'all' ? 'text-black opacity-100' : 'text-gray-500'}`}
                    onClick={() => handleItemClick('all')}
                    data-index="00"
                >
                    <span className="sm-panel-itemLabel">Visão Geral</span>
                </button>
             </li>
             {items.map((item, idx) => (
                <li className="sm-panel-itemWrap" key={item.id}>
                  <button 
                    className={`sm-panel-item ${activeId === item.id ? 'text-black opacity-100' : 'text-gray-500'}`}
                    onClick={() => handleItemClick(item.id)}
                    data-index={`0${idx + 1}`}
                  >
                    <span className="sm-panel-itemLabel">{item.label}</span>
                  </button>
                </li>
             ))}
          </ul>

          {socialItems.length > 0 && (
            <div className="sm-socials">
              <h3 className="sm-socials-title">Atalhos</h3>
              <ul className="sm-socials-list">
                {socialItems.map((s, i) => (
                  <li key={i}>
                    <a href={s.link} className="sm-socials-link hover:underline underline-offset-4">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;