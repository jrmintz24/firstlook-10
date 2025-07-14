
import React from 'react';

const Idx = () => {
  return (
    <div className="min-h-screen bg-white">
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{
          __html: `<script>document.currentScript.replaceWith(ihfKestrel.render());</script>`
        }}
      />
    </div>
  );
};

export default Idx;
