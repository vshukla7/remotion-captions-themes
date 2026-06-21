import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { InternalThemeProps } from "../types";

export const VibeTheme: React.FC<InternalThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const time = frame / fps;

  // Find active line
  let activeLineIdx = 0;
  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    if (line.words.length === 0) continue;
    const lineStart = line.words[0].start;
    const lineEnd = line.words[line.words.length - 1].end;
    if (time >= lineStart && time <= lineEnd) {
      activeLineIdx = i;
      break;
    }
    if (time > lineEnd) {
      activeLineIdx = i;
    }
  }

  const activeLine = data.lines[activeLineIdx] || data.lines[0];
  if (!activeLine || !activeLine.words.length) return null;

  // Responsive scaling
  const scaleFactor = width / 1080;
  const baseSize = typeof fontSize === "number" ? fontSize : 60;
  const containerFontSize = `${baseSize * scaleFactor}px`;

  const VIBE_FONTS = [
    { fontFamily: '"UnifrakturMaguntia", serif', fontSize: "1.2em", textTransform: "lowercase", color: "#fbbf24", margin: "20px 40px 15px -20px" },
    { fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: "1.6em", textTransform: "capitalize", color: "#ffffff", margin: "15px -30px 15px 40px" },
    { fontFamily: '"Inter", sans-serif', fontSize: "0.8em", textTransform: "lowercase", opacity: 0.7, margin: "10px 0" },
    { fontFamily: '"Impact", sans-serif', textTransform: "uppercase", fontSize: "1.3em", color: "#ffffff", margin: "20px -40px 20px 0" },
    { fontFamily: '"Montserrat", sans-serif', fontWeight: "900", textTransform: "uppercase", fontSize: "1.5em", color: "#fbbf24", margin: "15px 20px" },
    { fontFamily: '"Montserrat", sans-serif', fontSize: "0.4em", fontWeight: "900", textTransform: "uppercase", color: "#ffffff", opacity: 0.6, order: -1, margin: "0 0 15px 0" }
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: `${10 * scaleFactor}px`,
        maxWidth: "90%",
        textAlign: "center",
        fontSize: containerFontSize,
        lineHeight: "1.2",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {activeLine.words.map((word, i) => {
          const wordStartFrame = Math.round(word.start * fps);
          const isRevealed = frame >= wordStartFrame;
          const isActive = time >= word.start && time < word.end;

          const fontStyle = VIBE_FONTS[i % VIBE_FONTS.length];

          // Mixed animations:
          // type 0: pop spring
          // type 1: blur-in & scale
          // type 2: slide up
          const animType = i % 3;
          const animFrame = Math.max(0, frame - wordStartFrame);

          let animStyle: React.CSSProperties = {};
          if (isRevealed) {
            if (animType === 0) {
              const pop = spring({ frame: animFrame, fps, config: { damping: 9, stiffness: 200 } });
              animStyle.transform = `scale(${pop})`;
            } else if (animType === 1) {
              const blur = interpolate(animFrame, [0, 8], [25 * scaleFactor, 0], { extrapolateRight: "clamp" });
              const opacity = interpolate(animFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
              const scale = interpolate(animFrame, [0, 8], [0.8, 1], { extrapolateRight: "clamp" });
              animStyle.filter = `blur(${blur}px)`;
              animStyle.opacity = opacity;
              animStyle.transform = `scale(${scale})`;
            } else {
              const slide = interpolate(animFrame, [0, 10], [30 * scaleFactor, 0], { extrapolateRight: "clamp" });
              const opacity = interpolate(animFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
              animStyle.transform = `translateY(${slide}px)`;
              animStyle.opacity = opacity;
            }
          } else {
            animStyle.opacity = 0;
          }

          // Active highlights
          const color = isActive
            ? (secondaryColor !== "#FFD700" ? secondaryColor : "#fbbf24")
            : (primaryColor !== "#FFFFFF" ? primaryColor : (fontStyle.color || "#ffffff"));

          return (
            <span
              key={i}
              style={{
                fontFamily: fontStyle.fontFamily,
                fontSize: `calc(1em * ${parseFloat(fontStyle.fontSize || "1.0")})`,
                fontStyle: fontStyle.fontStyle as any,
                fontWeight: fontStyle.fontWeight as any,
                textTransform: fontStyle.textTransform as any,
                opacity: animStyle.opacity ?? (fontStyle.opacity ?? 1),
                margin: fontStyle.margin
                  ? fontStyle.margin.replace(/(-?\d+\.?\d*)px/g, (_match, p1) => `${parseFloat(p1) * scaleFactor}px`)
                  : `0 ${6 * scaleFactor}px`,
                transform: animStyle.transform,
                filter: animStyle.filter,
                color,
                order: fontStyle.order,
                display: "inline-block",
                transition: "color 0.1s ease",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
