
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Menu } from 'lucide-react';

interface MenuItem {
  label: string;
  id: string;
}

interface StaggeredMenuProps {
  items: MenuItem[];
  activeId: string;
  onSelectItem: (id: string) => void;
  socialItems?: { label: string; link: string }[];
}

const menuVariants: Variants = {
  closed: {
    clipPath: "circle(0% at calc(100% - 3rem) 3rem)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerDirection: -1
    }
  },
  open: {
    clipPath: "circle(150% at calc(100% - 3rem) 3rem)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const socialVariants: Variants = {
  closed: { opacity: 0, y: 10 },
  open: { opacity: 1, y: 0 }
};

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  items,
  activeId,
  onSelectItem,
  socialItems = []
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button - Always Visible & Top Level Z-Index */}
      <button 
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-[9999] p-3 bg-white/80 backdrop-blur-md border border-black/5 rounded-full shadow-sm active:scale-95 transition-transform"
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
      >
        <div className="relative w-6 h-6 flex items-center justify-center text-black">
          <AnimatePresence mode="popLayout">
            {isOpen ? (
              <motion.div 
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div 
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>

      {/* Full Screen Menu Overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed inset-0 z-[9990] bg-[#f5f5f7] flex flex-col justify-center px-8"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="max-w-md w-full mx-auto flex flex-col h-full justify-center">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-6">
            <motion.button
              variants={itemVariants}
              onClick={() => {
                onSelectItem('all');
                setIsOpen(false);
              }}
              className="text-left group"
            >
               <span className="block text-xs font-sans font-medium text-gray-400 tracking-widest uppercase mb-1">00</span>
               <span className={`text-4xl md:text-5xl font-serif italic ${activeId === 'all' ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'} transition-colors duration-300`}>
                 Visão Geral
               </span>
            </motion.button>

            {items.map((item, idx) => (
              <motion.button
                key={item.id}
                variants={itemVariants}
                onClick={() => {
                  onSelectItem(item.id);
                  setIsOpen(false);
                }}
                className="text-left group"
              >
                 <span className="block text-xs font-sans font-medium text-gray-400 tracking-widest uppercase mb-1">
                   {String(idx + 1).padStart(2, '0')}
                 </span>
                 <span className={`text-4xl md:text-5xl font-serif italic ${activeId === item.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'} transition-colors duration-300`}>
                   {item.label}
                 </span>
              </motion.button>
            ))}
          </nav>

          {/* Footer Socials */}
          {socialItems.length > 0 && (
            <motion.div 
              variants={socialVariants}
              className="mt-12 pt-8 border-t border-black/5"
            >
              <h3 className="text-xs font-sans uppercase tracking-widest text-gray-400 mb-4">Atalhos</h3>
              <div className="flex gap-6">
                {socialItems.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-sans text-black hover:opacity-60 transition-opacity"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default StaggeredMenu;
