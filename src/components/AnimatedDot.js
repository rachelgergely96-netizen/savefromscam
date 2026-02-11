"use client";

export default function AnimatedDot({ delay = 0 }) {
  return (
    <div
      className="w-2 h-2 bg-teal-500 rounded-full animate-dot"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
