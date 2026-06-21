import React from "react";
import { CaptionThemeProps } from "./types";
import { resolveColors } from "./utils/resolveColors";
import { themeRegistry } from "./registry";

export const CaptionTheme: React.FC<CaptionThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  theme = "pop",
}) => {
  const colors = resolveColors(primaryColor, secondaryColor);
  const ThemeComponent = themeRegistry[theme] || themeRegistry.pop;

  return (
    <ThemeComponent
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
      data={data}
    />
  );
};
