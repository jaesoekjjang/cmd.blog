import { useCallback, useEffect, useRef, useState } from 'react';
import { DomPager } from '../pager/DomPager';
import { ContentType, PagerState } from '../pager/types';

export interface UsePagerReturn<T extends HTMLElement> {
  isActive: boolean;
  progress: number;
  initializePaging: (content: string, contentType?: ContentType) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToTop: () => void;
  goToBottom: () => void;
  updateViewport: (height: number) => void;
  exitPaging: () => void;
  enable: (content: string, contentType?: string) => void;

  contentRef: React.RefObject<T | null>;
  handleKeyDown: (event: KeyboardEvent) => boolean;
  setContentElement: (element: T) => void;
}

interface ExtendedPagerState extends PagerState {
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function usePager<T extends HTMLElement>(): UsePagerReturn<T> {
  const [state, setState] = useState<PagerState | null>(null);
  const lastViewportHeightRef = useRef<number>(0);

  const pagerRef = useRef<DomPager | null>(null);
  const contentRef = useRef<T>(null);

  useEffect(() => {
    return () => {
      if (pagerRef.current) {
        pagerRef.current.dispose();
        pagerRef.current = null;
      }
    };
  }, []);

  const createPagerState = useCallback((pager: DomPager): ExtendedPagerState => {
    const { currentPosition, maxPosition } = pager.state;

    return {
      isAtTop: currentPosition === 0,
      isAtBottom: currentPosition === maxPosition,
      ...pager.state,
    };
  }, []);

  const updatePagerState = useCallback(() => {
    if (!pagerRef.current) return;

    const newState = createPagerState(pagerRef.current);
    setState(newState);
  }, [createPagerState]);

  const disposePager = useCallback(() => {
    if (pagerRef.current) {
      pagerRef.current.dispose();
      pagerRef.current = null;
    }
    setState(null);
    lastViewportHeightRef.current = 0;
  }, []);

  const nextPage = useCallback(() => {
    if (!pagerRef.current) return;
    if (pagerRef.current.nextPage()) {
      updatePagerState();
    }
  }, [updatePagerState]);

  const previousPage = useCallback(() => {
    if (!pagerRef.current) return;
    if (pagerRef.current.previousPage()) {
      updatePagerState();
    }
  }, [updatePagerState]);

  const goToTop = useCallback(() => {
    if (!pagerRef.current) return;
    if (pagerRef.current.goToTop()) {
      updatePagerState();
    }
  }, [updatePagerState]);

  const goToBottom = useCallback(() => {
    if (!pagerRef.current) return;
    if (pagerRef.current.goToBottom()) {
      updatePagerState();
    }
  }, [updatePagerState]);

  const updateViewport = useCallback(
    (height: number) => {
      if (!pagerRef.current || lastViewportHeightRef.current === height) return;
      lastViewportHeightRef.current = height;
      pagerRef.current.updateViewport(height);
      updatePagerState();
    },
    [updatePagerState],
  );

  const exitPaging = useCallback(() => {
    disposePager();
  }, [disposePager]);

  const initializePaging = useCallback(
    (content: string, contentType: ContentType = ContentType.PLAIN_TEXT) => {
      const container = contentRef.current;
      if (!container) {
        console.error('initializePaging: container is null');
        return;
      }

      if (pagerRef.current) {
        pagerRef.current.dispose();
      }

      const rect = container.getBoundingClientRect();
      const currentViewport = {
        width: rect.width,
        height: rect.height,
      };

      const pager = new DomPager({
        content,
        viewportHeight: currentViewport.height,
        contentType,
      });

      pagerRef.current = pager;
      lastViewportHeightRef.current = currentViewport.height;

      if (container) {
        pager.setContentElement(container);
      }

      updatePagerState();
    },
    [updatePagerState],
  );

  const enable = useCallback(
    (content: string, contentType: string = 'text') => {
      const mappedContentType = contentType === 'markdown' ? ContentType.MARKDOWN : ContentType.PLAIN_TEXT;
      initializePaging(content, mappedContentType);
    },
    [initializePaging],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): boolean => {
      if (!state) return false;

      switch (event.key) {
        case 'ArrowDown':
        case 'j':
          event.preventDefault();
          nextPage();
          return true;

        case 'ArrowUp':
        case 'k':
          event.preventDefault();
          previousPage();
          return true;

        case 'Home':
        case 'g':
          event.preventDefault();
          goToTop();
          return true;

        case 'End':
        case 'G':
          event.preventDefault();
          goToBottom();
          return true;

        case 'q':
          event.preventDefault();
          exitPaging();
          return true;

        default:
          return false;
      }
    },
    [state, nextPage, previousPage, goToTop, goToBottom, exitPaging],
  );

  const setContentElement = useCallback(
    (element: HTMLElement) => {
      if (!pagerRef.current) return;
      pagerRef.current.setContentElement(element);
      updatePagerState();
    },
    [updatePagerState],
  );

  return {
    progress: state?.progress || 0,
    isActive: state !== null,
    contentRef,
    initializePaging,
    nextPage,
    previousPage,
    goToTop,
    goToBottom,
    updateViewport,
    exitPaging,
    enable,
    handleKeyDown,
    setContentElement,
  };
}
