import debounce from 'debounce';
import { Pager } from './Pager';
import { ContentType, PagerOptions, PagerState } from './types';

export class DomPager implements Pager {
  private _currentPosition: number = 0;
  private _maxPosition: number = 0;
  private _content: string;
  private contentType: ContentType;
  private viewportHeight: number;
  private scrollRatio: number;
  private contentElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private debouncedCalculateMaxPosition: () => void;

  constructor(options: PagerOptions) {
    this._content = options.content;
    this.contentType = options.contentType;
    this.viewportHeight = options.viewportHeight;
    this.scrollRatio = options.scrollRatio ?? 0.8;
    this.calculateMaxPosition();

    this.debouncedCalculateMaxPosition = debounce(this.calculateMaxPosition.bind(this), 16);
  }

  get state(): PagerState {
    const totalPages = this.getTotalPages();
    const currentPage = this.getCurrentPage(totalPages);

    return {
      currentPosition: this._currentPosition,
      maxPosition: this._maxPosition,
      viewportHeight: this.viewportHeight,
      progress: this.getProgress(),
      content: this._content,
      contentType: this.contentType,
      currentPage,
      totalPages,
    };
  }

  setContentElement(element: HTMLElement) {
    this.cleanupResizeObserver();

    this.contentElement = element;
    this.calculateMaxPosition();

    this.setupResizeObserver();

    return this;
  }

  nextPage() {
    if (this._currentPosition >= this._maxPosition) return false;

    const scrollAmount = this.getScrollAmount();
    this._currentPosition = Math.min(this._maxPosition, this._currentPosition + scrollAmount);
    this.applyScrollPosition();
    return true;
  }

  previousPage() {
    if (this._currentPosition <= 0) return false;

    const scrollAmount = this.getScrollAmount();
    this._currentPosition = Math.max(0, this._currentPosition - scrollAmount);
    this.applyScrollPosition();
    return true;
  }

  goToTop() {
    if (this._currentPosition === 0) return false;
    this._currentPosition = 0;
    this.applyScrollPosition();
    return true;
  }

  goToBottom() {
    if (this._currentPosition >= this._maxPosition) return false;
    this._currentPosition = this._maxPosition;
    this.applyScrollPosition();
    return true;
  }

  goToPage(pageNumber: number): boolean {
    const totalPages = this.getTotalPages();
    if (pageNumber < 1 || pageNumber > totalPages) return false;

    const newPosition = ((pageNumber - 1) / totalPages) * this._maxPosition;
    if (newPosition === this._currentPosition) return false;

    this._currentPosition = Math.round(newPosition);
    this.applyScrollPosition();
    return true;
  }

  private getScrollAmount() {
    return Math.min(this.viewportHeight * this.scrollRatio, this._maxPosition * 0.2);
  }

  private getProgress() {
    if (this._maxPosition === 0) return 100;
    return Math.round((this._currentPosition / this._maxPosition) * 100);
  }

  private getTotalPages() {
    if (this._maxPosition === 0) return 1;
    const scrollAmount = this.getScrollAmount();
    return Math.max(1, Math.ceil(this._maxPosition / scrollAmount));
  }

  private getCurrentPage(totalPages: number) {
    if (this._maxPosition === 0) return 1;
    const progress = this._currentPosition / this._maxPosition;
    return Math.min(totalPages, Math.floor(progress * totalPages) + 1);
  }

  private applyScrollPosition() {
    if (this.contentElement) {
      this.contentElement.scrollTop = this._currentPosition;
      scrollToWithSpeed(this.contentElement, this._currentPosition, 180);
    }
  }

  private calculateMaxPosition() {
    if (this.contentElement) {
      const actualContentHeight = this.contentElement.scrollHeight;
      this._maxPosition = Math.max(0, actualContentHeight - this.viewportHeight);
      this._currentPosition = Math.min(this._currentPosition, this._maxPosition);
    } else {
      this._maxPosition = 0;
      this._currentPosition = 0;
    }
  }

  updateViewport(height: number) {
    this.viewportHeight = height;
    this.calculateMaxPosition();
  }

  private setupResizeObserver() {
    if (!this.contentElement) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.debouncedCalculateMaxPosition();
    });

    this.resizeObserver.observe(this.contentElement);
  }

  private cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  dispose() {
    this.contentElement = null;
    this._currentPosition = 0;
    this._maxPosition = 0;
    this._content = '';
    this.contentType = ContentType.PLAIN_TEXT;
    this.cleanupResizeObserver();
  }
}

function scrollToWithSpeed(element: HTMLElement, targetTop: number, speed = 500) {
  const startTop = element.scrollTop;
  const distance = targetTop - startTop;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / speed, 1); // 0 ~ 1 사이 비율
    const newTop = startTop + distance * progress;

    element.scrollTop = newTop;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
