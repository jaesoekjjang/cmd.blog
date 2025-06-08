'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ResizableState {
  width: number;
  height: number;
  isDragging: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
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
    toggleMaximize: () => void;
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

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 2560,
    height: typeof window !== 'undefined' ? window.innerHeight : 1440,
  });

  const [state, setState] = useState<ResizableState>({
    width: initialWidth,
    height: initialHeight,
    isDragging: false,
    isMaximized: false,
    isMinimized: false,
  });

  const previousSizeRef = useRef<{ width: number; height: number }>({
    width: initialWidth,
    height: initialHeight,
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
      if (state.isMaximized) return;
      
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
    [state.width, state.height, state.isMaximized],
  );

  const onMouseDownCorner = useCallback(
    (direction: 'ne' | 'nw' | 'se' | 'sw') => (e: React.MouseEvent) => {
      if (state.isMaximized) return;
      
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
    [state.width, state.height, state.isMaximized],
  );

  const setSize = useCallback(
    (width: number, height: number, updatePreviousSize = true) => {
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));

      if (updatePreviousSize && !state.isMaximized && !state.isMinimized) {
        previousSizeRef.current = { width: state.width, height: state.height };
      }

      setState(prev => ({
        ...prev,
        width: constrainedWidth,
        height: constrainedHeight,
        isMaximized: false,
        isMinimized: false,
      }));

      onResize?.(constrainedWidth, constrainedHeight);
    },
    [
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      onResize,
      state.width,
      state.height,
      state.isMaximized,
      state.isMinimized,
    ],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragDataRef.current) return;

      const { startX, startY, startWidth, startHeight, direction } = dragDataRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const { width, height } = calculateNewSize(deltaX, deltaY, direction, startWidth, startHeight);

      setSize(width, height, false);
    },
    [calculateNewSize, setSize],
  );

  const maximize = useCallback(() => {
    if (!state.isMaximized) {
      previousSizeRef.current = { width: state.width, height: state.height };
    }
    const currentMaxWidth = windowSize.width;
    const currentMaxHeight = windowSize.height;
    setState(prev => ({
      ...prev,
      width: currentMaxWidth,
      height: currentMaxHeight,
      isMaximized: true,
      isMinimized: false,
    }));
    onResize?.(currentMaxWidth, currentMaxHeight);
  }, [windowSize.width, windowSize.height, state.width, state.height, state.isMaximized, onResize]);

  const minimize = useCallback(() => {
    if (!state.isMinimized) {
      previousSizeRef.current = { width: state.width, height: state.height };
    }
    setState(prev => ({
      ...prev,
      width: minWidth,
      height: minHeight,
      isMaximized: false,
      isMinimized: true,
    }));
    onResize?.(minWidth, minHeight);
  }, [minWidth, minHeight, state.width, state.height, state.isMinimized, onResize]);

  const toggleMaximize = useCallback(() => {
    if (state.isMaximized) {
      const { width, height } = previousSizeRef.current;
      setState(prev => ({
        ...prev,
        width,
        height,
        isMaximized: false,
        isMinimized: false,
      }));
      onResize?.(width, height);
    } else {
      maximize();
    }
  }, [state.isMaximized, maximize, onResize]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
    }));
    dragDataRef.current = null;
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      const newWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setWindowSize(newWindowSize);

      if (state.isMaximized) {
        setState(prev => ({
          ...prev,
          width: newWindowSize.width,
          height: newWindowSize.height,
        }));
        onResize?.(newWindowSize.width, newWindowSize.height);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, state.isMaximized, onResize]);

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
      toggleMaximize,
      setSize,
    },
    style,
  };
};
