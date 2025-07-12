
import { useRef, useState, useCallback, useEffect } from 'react';
import { Property } from '@/types/simplyrets';
import { IHomefinderWidgetState, UseIHomefinderWidgetReturn } from '../types/ihomefinder';
import { transformIHomefinderProperty } from '../utils/ihomefinderPropertyTransformer';

export const useIHomefinderWidget = (onPropertySelect?: (property: Property) => void): UseIHomefinderWidgetReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<IHomefinderWidgetState>({
    isLoaded: false,
    error: null,
    debugInfo: [],
    scriptLoadAttempts: 0,
    isInitializing: false
  });

  const addDebugInfo = useCallback((message: string) => {
    console.log(`[iHomeFinder Debug]: ${message}`);
    setState(prev => ({
      ...prev,
      debugInfo: [...prev.debugInfo, `${new Date().toLocaleTimeString()}: ${message}`]
    }));
  }, []);

  const initializeWidget = useCallback(() => {
    if (state.isInitializing) {
      addDebugInfo('Already initializing, skipping...');
      return;
    }

    setState(prev => ({ ...prev, isInitializing: true }));
    addDebugInfo('Starting widget initialization...');
    
    try {
      if (!containerRef.current) {
        throw new Error('Container ref is not available - DOM element not yet rendered');
      }
      
      if (!window.ihfKestrel) {
        throw new Error('window.ihfKestrel is not available - script may not have loaded');
      }
      
      if (typeof window.ihfKestrel.render !== 'function') {
        throw new Error('ihfKestrel.render is not a function - API may have changed');
      }

      addDebugInfo('All prerequisites met, rendering widget...');
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Set up property selection callback
      window.ihfKestrel.onPropertySelect = (propertyData: any) => {
        addDebugInfo(`Property selected: ${JSON.stringify(propertyData)}`);
        if (onPropertySelect) {
          const transformedProperty = transformIHomefinderProperty(propertyData);
          onPropertySelect(transformedProperty);
        }
      };
      
      // Render the widget
      const widget = window.ihfKestrel.render();
      addDebugInfo(`Widget element created: ${!!widget}`);
      
      if (!widget) {
        throw new Error('ihfKestrel.render() returned null or undefined');
      }
      
      containerRef.current.appendChild(widget);
      setState(prev => ({
        ...prev,
        isLoaded: true,
        error: null,
        isInitializing: false
      }));
      addDebugInfo('Widget successfully initialized and rendered');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      addDebugInfo(`Widget initialization failed: ${errorMessage}`);
      console.error('Failed to initialize iHomeFinder widget:', err);
      setState(prev => ({
        ...prev,
        error: `Widget initialization failed: ${errorMessage}`,
        isInitializing: false
      }));
    }
  }, [onPropertySelect, addDebugInfo, state.isInitializing]);

  const retryInitialization = useCallback(() => {
    addDebugInfo('Manual retry initiated...');
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
      scriptLoadAttempts: prev.scriptLoadAttempts + 1
    }));
    
    setTimeout(() => {
      if (window.ihfKestrel && containerRef.current) {
        initializeWidget();
      } else {
        addDebugInfo(`Retry failed - Kestrel: ${!!window.ihfKestrel}, Container: ${!!containerRef.current}`);
        setState(prev => ({
          ...prev,
          error: 'iHomeFinder Kestrel still not available after retry. Please check your internet connection or contact support.'
        }));
      }
    }, 1000);
  }, [initializeWidget, addDebugInfo]);

  // Effect to initialize when both container and Kestrel are ready
  useEffect(() => {
    addDebugInfo('Effect: Checking initialization readiness...');
    
    if (window.ihfKestrel && 
        typeof window.ihfKestrel.render === 'function' && 
        containerRef.current && 
        !state.isLoaded && 
        !state.isInitializing) {
      
      addDebugInfo('Effect: Both Kestrel and container ready, initializing...');
      initializeWidget();
    } else {
      addDebugInfo(`Effect: Not ready - Kestrel: ${!!window.ihfKestrel}, Container: ${!!containerRef.current}, Loaded: ${state.isLoaded}, Initializing: ${state.isInitializing}`);
    }
  }, [initializeWidget, state.isLoaded, state.isInitializing]);

  // Fallback polling for Kestrel availability
  useEffect(() => {
    if (state.isLoaded || state.isInitializing) return;

    addDebugInfo('Starting fallback polling for Kestrel availability...');
    
    const pollInterval = setInterval(() => {
      if (window.ihfKestrel && 
          typeof window.ihfKestrel.render === 'function' && 
          containerRef.current && 
          !state.isLoaded && 
          !state.isInitializing) {
        
        addDebugInfo('Polling: Kestrel became available, initializing...');
        clearInterval(pollInterval);
        initializeWidget();
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (!state.isLoaded && !state.isInitializing) {
        addDebugInfo('Polling timeout reached, widget failed to load');
        
        let errorMsg = 'iHomeFinder widget failed to load within 15 seconds. ';
        
        if (!window.ihfKestrel) {
          errorMsg += 'The iHomeFinder script did not load properly. This could be due to network issues, domain restrictions, or the activation token not being authorized for this domain.';
        } else if (!containerRef.current) {
          errorMsg += 'Container element is not available.';
        } else if (typeof window.ihfKestrel.render !== 'function') {
          errorMsg += 'The iHomeFinder script loaded but the render function is not available.';
        }
        
        setState(prev => ({ ...prev, error: errorMsg }));
      }
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [initializeWidget, state.isLoaded, state.isInitializing]);

  return {
    containerRef,
    state,
    retryInitialization,
    addDebugInfo
  };
};
