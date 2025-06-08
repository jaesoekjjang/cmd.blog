import { PagerState } from './types';

export interface Pager {
  get state(): PagerState;
  nextPage(): boolean;
  previousPage(): boolean;
  goToTop(): boolean;
  goToBottom(): boolean;
  updateViewport(height: number): void;
}
