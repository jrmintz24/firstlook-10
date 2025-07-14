
import React, { useEffect, useRef } from 'react';

const Idx = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the IDX script is loaded before rendering
    if (window.ihfKestrel && containerRef.current) {
      // Create a script element with the embed code
      const script = document.createElement('script');
      script.textContent = 'document.currentScript.replaceWith(ihfKestrel.render());';
      
      // Append the script to the container
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={containerRef} className="w-full h-full">
        {/* IDX content will be rendered here */}
      </div>
    </div>
  );
};

export default Idx;
