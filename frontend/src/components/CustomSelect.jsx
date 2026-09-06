import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { EASINGS } from '../motionVariants';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  icon: Icon,
  className = '',
  menuWidth = 'w-full',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value)) || options[0];

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border rounded-input text-xs sm:text-sm text-text-primary transition-all duration-150 text-left ${
          isOpen ? 'border-accent shadow-sm ring-2 ring-accent/10' : 'border-border hover:border-text-secondary/40'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-accent shrink-0" />}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASINGS.gentleDeceleration }}
          className="shrink-0 text-text-secondary"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASINGS.materialEntrance }}
            className={`absolute z-50 mt-1.5 left-0 ${menuWidth} min-w-full max-h-64 overflow-y-auto bg-white border border-border rounded-btn shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.06)] p-1`}
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <motion.div
                  key={opt.value}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[5px] text-xs sm:text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-text-primary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <opt.icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-accent' : 'text-text-secondary'}`} />}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
