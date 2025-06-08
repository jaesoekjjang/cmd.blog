'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ResizableState {
  width: number;
  height: number;
  isDragging: boolean;
}

export interface UseResizableOptions {
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (width: number, height: number) => void;
}

export type Direction = BorderDirection | CornerDirection;

export type BorderDirection = 'n' | 's' | 'e' | 'w';

export type CornerDirection = 'ne' | 'nw' | 'se' | 'sw';

export interface UseResizableReturn {
  state: ResizableState;
  handlers: {
    onMouseDownBorder: (direction: 'n' | 's' | 'e' | 'w') => (e: React.MouseEvent) => void;
    onMouseDownCorner: (direction: 'ne' | 'nw' | 'se' | 'sw') => (e: React.MouseEvent) => void;
  };
  controls: {
    maximize: () => void;
    minimize: () => void;
    setSize: (width: number, height: number) => void;
  };
  style: React.CSSProperties;
}

export const useResizable = (options: UseResizableOptions = {}): UseResizableReturn => {
  const {
    initialWidth = 400,
    initialHeight = 300,
    minWidth = 100,
    minHeight = 100,
    maxHeight = typeof window !== 'undefined' ? window.innerHeight : 1440,
    maxWidth = typeof window !== 'undefined' ? window.innerWidth : 2560,
    onResize,
  } = options;

  const [state, setState] = useState<ResizableState>({
    width: initialWidth,
    height: initialHeight,
    isDragging: false,
  });

  const dragDataRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  } | null>(null);

  const calculateNewSize = useCallback(
    (deltaX: number, deltaY: number, direction: string, startWidth: number, startHeight: number) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (direction) {
        case 'e':
          newWidth = startWidth + deltaX * 2;
          break;
        case 'w':
          newWidth = startWidth - deltaX * 2;
          break;
        case 's':
          newHeight = startHeight + deltaY * 2;
          break;
        case 'n':
          newHeight = startHeight - deltaY * 2;
          break;
        case 'se':
          newWidth = startWidth + deltaX * 2;
          newHeight = startHeight + deltaY * 2;
          break;
        case 'sw':
          newWidth = startWidth - deltaX * 2;
          newHeight = startHeight + deltaY * 2;
          break;
        case 'ne':
          newWidth = startWidth + deltaX * 2;
          newHeight = startHeight - deltaY * 2;
          break;
        case 'nw':
          newWidth = startWidth - deltaX * 2;
          newHeight = startHeight - deltaY * 2;
          break;
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      return { width: newWidth, height: newHeight };
    },
    [minWidth, minHeight, maxWidth, maxHeight],
  );

  const onMouseDownBorder = useCallback(
    (direction: 'n' | 's' | 'e' | 'w') => (e: React.MouseEvent) => {
      setState(prev => ({
        ...prev,
        isDragging: true,
      }));
      dragDataRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: state.width,
        startHeight: state.height,
        direction,
      };
    },
    [state.width, state.height],
  );

  const onMouseDownCorner = useCallback(
    (direction: 'ne' | 'nw' | 'se' | 'sw') => (e: React.MouseEvent) => {
      setState(prev => ({
        ...prev,
        isDragging: true,
      }));

      dragDataRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: state.width,
        startHeight: state.height,
        direction,
      };
    },
    [state.width, state.height],
  );

  const setSize = useCallback(
    (width: number, height: number) => {
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));

      setState(prev => ({
        ...prev,
        width: constrainedWidth,
        height: constrainedHeight,
        isMaximized: false,
        isMinimized: false,
      }));

      onResize?.(constrainedWidth, constrainedHeight);
    },
    [minWidth, maxWidth, minHeight, maxHeight, onResize],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragDataRef.current) return;

      const { startX, startY, startWidth, startHeight, direction } = dragDataRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const { width, height } = calculateNewSize(deltaX, deltaY, direction, startWidth, startHeight);

      setSize(width, height);
    },
    [calculateNewSize, setSize],
  );

  const maximize = useCallback(() => {
    setSize(maxWidth, maxHeight);
  }, [setSize, maxWidth, maxHeight]);

  const minimize = useCallback(() => {
    setSize(minWidth, minHeight);
  }, [setSize, minWidth, minHeight]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
    }));
    dragDataRef.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const style: React.CSSProperties = {
    width: state.width,
    height: state.height,
    position: 'relative',
  };

  return {
    state,
    handlers: {
      onMouseDownBorder,
      onMouseDownCorner,
    },
    controls: {
      maximize,
      minimize,
      setSize,
    },
    style,
  };
};
