"use client";

import { useTheme } from "@/components/ThemeContext";

export default function CircularScore({ score, size = 160, stroke = 10 }) {
  const { resolvedTheme } = useTheme();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70 ? "#2EC4B6" : score >= 40 ? "#F4A261" : "#E63946";
  const bgStroke = resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0";
  const subColor = resolvedTheme === "dark" ? "#A5A7C9" : "#6b7888";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} className="mx-auto">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={bgStroke}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
      />
      <text
        x={size / 2}
        y={size / 2 - size * 0.04}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={size * 0.28}
        fontWeight="800"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {score}
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.16}
        textAnchor="middle"
        dominantBaseline="central"
        fill={subColor}
        fontSize={size * 0.09}
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        out of 100
      </text>
    </svg>
  );
}
