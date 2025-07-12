
import React from 'react';
import { Property } from '@/types/simplyrets';
import IHomefinderWidget from './IHomefinderWidget';

interface IDXSearchWidgetProps {
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

const IDXSearchWidget = ({ onPropertySelect, className = '' }: IDXSearchWidgetProps) => {
  return (
    <div className={`idx-search-widget ${className}`}>
      <IHomefinderWidget 
        onPropertySelect={onPropertySelect}
        className="w-full"
      />
    </div>
  );
};

export default IDXSearchWidget;
