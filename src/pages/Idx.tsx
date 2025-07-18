
import React, { useEffect } from 'react';
import SimplePropertyToolbar from '../components/SimplePropertyToolbar';
import { useAutomaticPropertySaver } from '../hooks/useAutomaticPropertySaver';

const Idx = () => {
  // Enable automatic property saving when users visit IDX pages
  useAutomaticPropertySaver();

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      const container = document.getElementById('idx-container');
      if (container) {
        // Clear any existing content
        container.innerHTML = '';
        // Create and execute the embed script
        const renderedElement = window.ihfKestrel.render();
        container.appendChild(renderedElement);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SimplePropertyToolbar />
      <div 
        id="idx-container"
        className="w-full h-full"
      >
        {/* IDX content will be rendered here */}
      </div>
    </div>
  );
};

export default Idx;
