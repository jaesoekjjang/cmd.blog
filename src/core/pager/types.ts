export interface Dimension {
  width: number;
  height: number;
}

export enum ContentType {
  PLAIN_TEXT = 'plainText',
  MARKDOWN = 'markdown',
}

export interface PagerState {
  currentPosition: number;
  maxPosition: number;
  viewportHeight: number;
  progress: number;
  content: string;
  contentType: ContentType;
  currentPage: number;
  totalPages: number;
}

export interface PagerOptions {
  content: string;
  viewportHeight: number;
  contentType: ContentType;
  scrollRatio?: number;
}
