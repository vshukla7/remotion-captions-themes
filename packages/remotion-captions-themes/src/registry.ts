import React from "react";
import { InternalThemeProps } from "./types";
import { PopTheme } from "./themes/pop";
import { KaraokeTheme } from "./themes/karaoke";
import { FadeSlideTheme } from "./themes/fadeSlide";
import { TypewriterTheme } from "./themes/typewriter";
import { BounceTheme } from "./themes/bounce";
import { Kinetic01 } from "./themes/kinetic-01";
import { Kinetic02 } from "./themes/kinetic-02";

// Import new custom themes
import { HustleTheme } from "./themes/hustle";
import { GrapeTheme } from "./themes/grape";
import { KarlTheme } from "./themes/karl";
import { BeastTheme } from "./themes/beast";
import { VibeTheme } from "./themes/vibe";
import { ContrastTheme } from "./themes/contrast";
import { PoppinTheme } from "./themes/poppin";
import { CapCutTheme } from "./themes/capcut";
import { SoftAITheme } from "./themes/soft-ai";
import { GamingStreamTheme } from "./themes/gaming-stream";
import { ReelPunchTheme } from "./themes/reel-punch";
import { SimpleOneWordTheme } from "./themes/simple-one-word";

export const themeRegistry: Record<string, React.FC<InternalThemeProps>> = {
  pop: PopTheme,
  karaoke: KaraokeTheme,
  fadeSlide: FadeSlideTheme,
  typewriter: TypewriterTheme,
  bounce: BounceTheme,
  "kinetic-01": Kinetic01,
  "kinetic-02": Kinetic02,

  // New Custom Themes
  hustle: HustleTheme,
  grape: GrapeTheme,
  karl: KarlTheme,
  beast: BeastTheme,
  vibe: VibeTheme,
  contrast: ContrastTheme,
  poppin: PoppinTheme,
  capcut: CapCutTheme,
  "soft-ai": SoftAITheme,
  "gaming-stream": GamingStreamTheme,
  "reel-punch": ReelPunchTheme,
  "simple-one-word": SimpleOneWordTheme,
} as const;

export type ThemeName = keyof typeof themeRegistry;
