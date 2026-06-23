"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  variant?: "default" | "price";
}

function isPriceStaticChar(char: string): boolean {
  return /[\s$.,]/.test(char);
}

export function TextScramble({
  text,
  className = "",
  variant = "default",
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);
  const isPrice = variant === "price";

  const scramble = useCallback(() => {
    setIsScrambling(true);
    frameRef.current = 0;
    const duration = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / duration;
      const revealedLength = Math.floor(progress * text.length);

      const newText = text
        .split("")
        .map((char, i) => {
          if (isPrice && isPriceStaticChar(char)) return char;
          if (char === " ") return " ";
          if (i < revealedLength) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(newText);

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [isPrice, text]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    scramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scramblingClass = isPrice
    ? "text-[var(--brand-cyan)]"
    : "text-primary scale-110";

  return (
    <span
      className={`group relative inline-block ${
        isPrice ? "cursor-pointer select-none" : "inline-flex cursor-pointer flex-col select-none"
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={
          isPrice
            ? "relative"
            : "relative font-mono text-lg tracking-widest uppercase"
        }
      >
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              isScrambling && char !== text[i]
                ? scramblingClass
                : isPrice
                  ? "text-inherit"
                  : "text-foreground"
            }`}
            style={{
              transitionDelay: `${i * 10}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {!isPrice && (
        <>
          <span className="relative mt-2 h-px w-full overflow-hidden">
            <span
              className={`absolute inset-0 origin-left bg-foreground transition-transform duration-500 ease-out ${
                isHovering ? "scale-x-100" : "scale-x-0"
              }`}
            />
            <span className="absolute inset-0 bg-border" />
          </span>
          <span
            className={`absolute -inset-4 -z-10 rounded-lg bg-primary/5 transition-opacity duration-300 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}
    </span>
  );
}
