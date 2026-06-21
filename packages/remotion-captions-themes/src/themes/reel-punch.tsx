import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { InternalThemeProps } from "../types";

export const ReelPunchTheme: React.FC<InternalThemeProps> = ({
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
  const baseSize = typeof fontSize === "number" ? fontSize : 96;
  const scaledFontSize = `${baseSize * scaleFactor}px`;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${8 * scaleFactor}px ${16 * scaleFactor}px`,
        maxWidth: "90%",
        textAlign: "center",
        lineHeight: 0.9,
      }}
    >
      {activeLine.words.map((word, index) => {
        const isActive = time >= word.start && time < word.end;
        const wordStartFrame = Math.round(word.start * fps);

        // Reel Punch uses a fast glitch spring-scale pop-in on entrance
        const pop = spring({
          frame: frame - wordStartFrame,
          fps,
          config: { damping: 8, stiffness: 220 },
        });

        const color = isActive
          ? (secondaryColor !== "#FFD700" ? secondaryColor : "#f97316")
          : primaryColor;

        return (
          <span
            key={index}
            style={{
              color,
              fontFamily: '"Anton", sans-serif',
              fontSize: scaledFontSize,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: `-${5 * scaleFactor}px`,
              transform: `scale(${pop})`,
              display: "inline-block",
              transition: "color 0.1s ease",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
