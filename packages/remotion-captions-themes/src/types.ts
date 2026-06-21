export interface WordTiming {
  text: string;
  start: number; // seconds
  end: number;   // seconds
  emphasis?: boolean;
}

export interface CaptionLine {
  words: WordTiming[];
}

export interface CaptionsData {
  lines: CaptionLine[];
}

export interface CaptionThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  data: CaptionsData;
  theme?: string;
}

export interface InternalThemeProps {
  primaryColor: string;
  secondaryColor: string;
  data: CaptionsData;
}
