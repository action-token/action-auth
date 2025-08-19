import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

interface ShadowWrapperProps {
  children: React.ReactNode;
  css?: string;
  className?: string;
}

export function ShadowWrapper({ children, css, className }: ShadowWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const reactRootRef = useRef<any>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    // Create shadow root
    shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' });
    
    // Add styles
    if (css) {
      const styleElement = document.createElement('style');
      styleElement.textContent = css;
      shadowRootRef.current.appendChild(styleElement);
    }

    // Create container for React
    const container = document.createElement('div');
    shadowRootRef.current.appendChild(container);

    // Render React content
    reactRootRef.current = createRoot(container);
    reactRootRef.current.render(children);

    return () => {
      if (reactRootRef.current) {
        reactRootRef.current.unmount();
      }
    };
  }, [children, css]);

  return <div ref={hostRef} className={className} />;
}
