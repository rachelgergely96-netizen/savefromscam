"use client";

import { useState, useEffect } from "react";

export default function AnimatedNumber({ target, duration = 1500, suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(interval);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);

  return (
    <span>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
