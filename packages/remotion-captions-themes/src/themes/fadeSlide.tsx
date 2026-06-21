import React from "react";
import { InternalThemeProps } from "../types";
import { PopTheme } from "./pop";

export const FadeSlideTheme: React.FC<InternalThemeProps> = (props) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", top: 10, left: 10, fontSize: "1rem", opacity: 0.5, color: props.primaryColor }}>
        [Theme: fadeSlide (Boilerplate)]
      </div>
      <PopTheme {...props} />
    </div>
  );
};
