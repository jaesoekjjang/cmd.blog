/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useResizable } from './useResizable';

describe('useResizable', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  it('초기 사이즈를 전달된 값으로 설정', () => {
    const { result } = renderHook(() =>
      useResizable({
        initialWidth: 500,
        initialHeight: 400,
        minWidth: 200,
        minHeight: 150,
      }),
    );

    expect(result.current.state).toMatchObject({
      width: 500,
      height: 400,
    });

    expect(result.current.style).toEqual({
      width: 500,
      height: 400,
      position: 'relative',
    });
  });

  it('maximize() 호출 시 전체 화면 크기로 확장', () => {
    const { result } = renderHook(() => useResizable());

    act(() => {
      result.current.controls.maximize();
    });

    expect(result.current.state).toMatchObject({
      isDragging: false,
      width: 1200,
      height: 800,
    });
  });

  it('minimize() 호출 시 최소 크기로 축소', () => {
    const { result } = renderHook(() => useResizable({ minWidth: 100, minHeight: 100 }));

    act(() => {
      result.current.controls.minimize();
    });

    expect(result.current.state.width).toBe(100);
    expect(result.current.state.height).toBe(100);
  });

  it('setSize() 호출 시 전달된 크기로 정상적으로 설정', () => {
    const { result } = renderHook(() => useResizable());

    act(() => {
      result.current.controls.setSize(600, 500);
    });

    expect(result.current.state).toMatchObject({
      width: 600,
      height: 500,
    });
  });

  it('최소/최대 크기 제한 범위를 벗어나지 않도록 크기를 제한', () => {
    const { result } = renderHook(() => useResizable({ minWidth: 200, minHeight: 150, maxWidth: 800, maxHeight: 600 }));

    act(() => {
      result.current.controls.setSize(50, 50);
    });

    expect(result.current.state.width).toBe(200);
    expect(result.current.state.height).toBe(150);

    act(() => {
      result.current.controls.setSize(1000, 1000);
    });

    expect(result.current.state.width).toBe(800);
    expect(result.current.state.height).toBe(600);
  });
});
