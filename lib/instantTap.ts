"use client";

import { useMemo, useRef } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";

/**
 * Instant tap handlers for iOS Safari: fire on touch end (no 300ms wait),
 * skip if the finger moved (scroll), and ignore the synthetic click that follows.
 */
export function useInstantTap(action: () => void, moveThreshold = 12) {
  const actionRef = useRef(action);
  actionRef.current = action;

  const stateRef = useRef({
    startX: 0,
    startY: 0,
    moved: false,
    handledByTouch: false,
  });

  return useMemo(
    () => ({
      onTouchStart: (event: ReactTouchEvent) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const state = stateRef.current;
        state.startX = touch.clientX;
        state.startY = touch.clientY;
        state.moved = false;
        state.handledByTouch = false;
      },
      onTouchMove: (event: ReactTouchEvent) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const state = stateRef.current;
        if (
          Math.abs(touch.clientX - state.startX) > moveThreshold ||
          Math.abs(touch.clientY - state.startY) > moveThreshold
        ) {
          state.moved = true;
        }
      },
      onTouchEnd: () => {
        const state = stateRef.current;
        if (state.moved) return;
        state.handledByTouch = true;
        actionRef.current();
      },
      onClick: () => {
        const state = stateRef.current;
        if (state.handledByTouch) {
          state.handledByTouch = false;
          return;
        }
        actionRef.current();
      },
    }),
    [moveThreshold],
  );
}
