
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:border focus:border-black focus:rounded"
    >
      {children}
    </a>
  );
};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly = ({ children, className }: ScreenReaderOnlyProps) => {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
};

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

export const FocusTrap = ({ children, isActive, onEscape }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, onEscape]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export const LiveRegion = ({ children, politeness = 'polite', atomic = true }: LiveRegionProps) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};
