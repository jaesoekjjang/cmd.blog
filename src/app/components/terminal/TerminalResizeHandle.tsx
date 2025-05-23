import { BorderDirection, CornerDirection, Direction } from '@/core/hooks/useResizable';
import { JSX } from 'react';

interface ResizeHandlerProps<D extends Direction> {
  direction: D;
  onMouseDown: (direction: D) => (e: React.MouseEvent) => void;
}

const BORDER_DIRECTIONS: BorderDirection[] = ['n', 's', 'e', 'w'];
const CORNER_DIRECTIONS: CornerDirection[] = ['ne', 'nw', 'se', 'sw'];

function isBorderDirection(direction: Direction): direction is BorderDirection {
  return (BORDER_DIRECTIONS as readonly string[]).includes(direction);
}

function isCornerDirection(direction: Direction): direction is CornerDirection {
  return (CORNER_DIRECTIONS as readonly string[]).includes(direction);
}

const getResizeClasses = (dir: Direction): string => {
  const baseClasses = 'absolute z-10';

  if (isBorderDirection(dir)) {
    const borderClassMap: Record<BorderDirection, string> = {
      n: `${baseClasses} top-0 left-2 right-2 h-1 cursor-n-resize`,
      s: `${baseClasses} bottom-0 left-2 right-2 h-1 cursor-s-resize`,
      e: `${baseClasses} right-0 top-2 bottom-2 w-1 cursor-e-resize`,
      w: `${baseClasses} left-0 top-2 bottom-2 w-1 cursor-w-resize`,
    };
    return borderClassMap[dir];
  }

  if (isCornerDirection(dir)) {
    const cornerClassMap: Record<CornerDirection, string> = {
      ne: `${baseClasses} top-0 right-0 w-2 h-2 cursor-ne-resize`,
      nw: `${baseClasses} top-0 left-0 w-2 h-2 cursor-nw-resize`,
      se: `${baseClasses} bottom-0 right-0 w-2 h-2 cursor-se-resize`,
      sw: `${baseClasses} bottom-0 left-0 w-2 h-2 cursor-sw-resize`,
    };
    return cornerClassMap[dir];
  }

  return baseClasses;
};

export function TerminalResizeHandle<D extends BorderDirection>(props: ResizeHandlerProps<D>): JSX.Element;
export function TerminalResizeHandle<D extends CornerDirection>(props: ResizeHandlerProps<D>): JSX.Element;
export function TerminalResizeHandle<D extends Direction>({
  direction,
  onMouseDown,
}: ResizeHandlerProps<D>): JSX.Element {
  return <div className={getResizeClasses(direction)} onMouseDown={onMouseDown(direction)} />;
}
