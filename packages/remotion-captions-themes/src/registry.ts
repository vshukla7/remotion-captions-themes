import React from "react";
import { InternalThemeProps } from "./types";
import { PopTheme } from "./themes/pop";
import { KaraokeTheme } from "./themes/karaoke";
import { FadeSlideTheme } from "./themes/fadeSlide";
import { TypewriterTheme } from "./themes/typewriter";
import { BounceTheme } from "./themes/bounce";
import { Kinetic01 } from "./themes/kinetic-01";
import { Kinetic02 } from "./themes/kinetic-02";

export const themeRegistry: Record<string, React.FC<InternalThemeProps>> = {
  pop: PopTheme,
  karaoke: KaraokeTheme,
  fadeSlide: FadeSlideTheme,
  typewriter: TypewriterTheme,
  bounce: BounceTheme,
  "kinetic-01": Kinetic01,
  "kinetic-02": Kinetic02,
} as const;

export type ThemeName = keyof typeof themeRegistry;
