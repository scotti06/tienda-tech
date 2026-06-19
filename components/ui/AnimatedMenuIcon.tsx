"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedMenuIconProps = {
  open: boolean;
  className?: string;
};

const MENU_ICON_EASE = [0.22, 1, 0.36, 1] as const;
const MENU_ICON_DURATION = 0.3;

export function AnimatedMenuIcon({
  open,
  className = "h-6 w-6",
}: AnimatedMenuIconProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : MENU_ICON_DURATION;

  const transition = {
    duration,
    ease: MENU_ICON_EASE,
  };

  return (
    <span className={`relative block ${className}`} aria-hidden>
      <motion.span
        className="absolute left-1/2 top-[7px] block h-[1.5px] w-[16.5px] -translate-x-1/2 rounded-full bg-current"
        style={{ originX: "50%", originY: "50%" }}
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 5 : 0,
        }}
        transition={transition}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 block h-[1.5px] w-[16.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        style={{ originX: "50%", originY: "50%" }}
        animate={{
          opacity: open ? 0 : 1,
          scaleX: open ? 0 : 1,
        }}
        transition={transition}
      />
      <motion.span
        className="absolute bottom-[7px] left-1/2 block h-[1.5px] w-[16.5px] -translate-x-1/2 rounded-full bg-current"
        style={{ originX: "50%", originY: "50%" }}
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -5 : 0,
        }}
        transition={transition}
      />
    </span>
  );
}
