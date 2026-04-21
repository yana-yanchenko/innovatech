'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Canvas, type CanvasProps, type RootState } from '@react-three/fiber';

export default function ResilientCanvas(props: CanvasProps) {
  const { onCreated, ...canvasProps } = props;
  const [canvasVersion, setCanvasVersion] = useState(0);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setCanvasVersion((prev) => prev + 1);
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const handleCreated = useCallback((state: RootState) => {
    onCreated?.(state);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setCanvasVersion((prev) => prev + 1);
    };

    state.gl.domElement.addEventListener('webglcontextlost', handleContextLost, { passive: false });
  }, [onCreated]);

  return <Canvas key={canvasVersion} {...canvasProps} onCreated={handleCreated} />;
}
