import React, { useState } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill } from "remotion";
import { CaptionTheme, CaptionsData } from "@vshukla7/remotion-captions-themes";
import { sampleCaptions } from "./sample-captions";

const VideoComposition: React.FC<{
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  data: CaptionsData;
  bgGradient: string;
}> = ({ theme, primaryColor, secondaryColor, data, bgGradient }) => {
  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          right: "10%",
          bottom: "10%",
          border: "2px dashed rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ color: "rgba(255, 255, 255, 0.08)", fontSize: "1.2rem", fontWeight: 600 }}>
          Video Frame Safe Area
        </span>
      </div>

      <CaptionTheme
        theme={theme}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        data={data}
      />
    </AbsoluteFill>
  );
};

export default function App() {
  const [theme, setTheme] = useState<string>("pop");
  const [primaryColor, setPrimaryColor] = useState<string>("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState<string>("#FFD700");
  const [bgGradient, setBgGradient] = useState<string>("linear-gradient(135deg, #0f0c1b 0%, #201335 50%, #07050d 100%)");
  const [captionsJsonText, setCaptionsJsonText] = useState<string>(
    JSON.stringify(sampleCaptions, null, 2)
  );
  const [parsedCaptions, setParsedCaptions] = useState<CaptionsData>(sampleCaptions);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCaptionsJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.lines)) {
        setParsedCaptions(parsed);
        setJsonError(null);
      } else {
        setJsonError("Invalid schema: Must contain a top-level 'lines' array.");
      }
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  const bgOptions = [
    { name: "Midnight Glow", value: "linear-gradient(135deg, #0f0c1b 0%, #201335 50%, #07050d 100%)" },
    { name: "Oceanic Depths", value: "linear-gradient(135deg, #091a27 0%, #0f3954 50%, #030a10 100%)" },
    { name: "Cyberpunk Alley", value: "linear-gradient(135deg, #1b0a1d 0%, #3d0d34 50%, #0a020d 100%)" },
    { name: "Charcoal Dark", value: "linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 100%)" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#08090c",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "15px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "2.2rem",
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              background: "linear-gradient(90deg, #ff7e5f, #feb47b, #86e3ce)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Remotion Caption Themes
          </h1>
          <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "0.95rem" }}>
            Visual studio for building and previewing animated word-level captions
          </p>
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            color: "#6bcfb4",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#6bcfb4" }}></span>
          Local Workspace Connected
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 450px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
              backdropFilter: "blur(4px)",
            }}
          >
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.3rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🎨</span> Theme Configuration
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#c1c4cb", fontSize: "0.9rem", fontWeight: 500 }}>
                Caption Animation Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#14161f",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="pop">✨ pop (Scale Spring Highlight)</option>
                <option value="karaoke">🎤 karaoke (Progressive Color Fill)</option>
                <option value="fadeSlide">🚀 fadeSlide (Slide Entrance - Boilerplate)</option>
                <option value="typewriter">⌨️ typewriter (Character Reveal - Boilerplate)</option>
                <option value="bounce">🏀 bounce (Spring Bounce - Boilerplate)</option>
                <option value="kinetic-01">📐 kinetic-01 (Layout Anchored - Boilerplate)</option>
                <option value="kinetic-02">📏 kinetic-02 (Layout Secondary - Boilerplate)</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#c1c4cb", fontSize: "0.9rem", fontWeight: 500 }}>
                  Primary (Base) Color
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "#14161f",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#c1c4cb", fontSize: "0.9rem", fontWeight: 500 }}>
                  Secondary (Active) Color
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "#14161f",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#c1c4cb", fontSize: "0.9rem", fontWeight: 500 }}>
                Demo Backdrop Frame
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {bgOptions.map((bg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBgGradient(bg.value)}
                    style={{
                      background: bg.value,
                      border: bgGradient === bg.value ? "2px solid #ff7e5f" : "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      padding: "10px",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      textAlign: "center",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>📝</span> Timed Captions JSON
              </h2>
              {jsonError ? (
                <span style={{ color: "#ff6b6b", fontSize: "0.8rem", fontWeight: 600 }}>⚠️ Invalid JSON</span>
              ) : (
                <span style={{ color: "#6bcfb4", fontSize: "0.8rem", fontWeight: 600 }}>✅ Valid Schema</span>
              )}
            </div>

            <textarea
              value={captionsJsonText}
              onChange={handleJsonChange}
              style={{
                width: "100%",
                flex: 1,
                minHeight: "220px",
                background: "#0c0d12",
                border: jsonError ? "1px solid #ff6b6b" : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                padding: "15px",
                color: "#e1e3e6",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                lineHeight: "1.5",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {jsonError && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 15px",
                  background: "rgba(255, 107, 107, 0.1)",
                  border: "1px solid rgba(255, 107, 107, 0.2)",
                  borderRadius: "6px",
                  color: "#ff8c8c",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                }}
              >
                {jsonError}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            flex: "1 1 600px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}
          >
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.3rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>📺</span> Live Video Player Preview
            </h2>

            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: "#000",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Player
                component={VideoComposition}
                inputProps={{
                  theme,
                  primaryColor,
                  secondaryColor,
                  data: parsedCaptions,
                  bgGradient,
                }}
                durationInFrames={270}
                fps={30}
                compositionWidth={1280}
                compositionHeight={720}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                controls
                loop
              />
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                fontSize: "0.85rem",
                color: "#a1a5b0",
                lineHeight: "1.5",
              }}
            >
              <h4 style={{ margin: "0 0 6px 0", color: "#fff", fontWeight: 600 }}>💡 Pro-Tip for Theme Development</h4>
              You can add more styles inside the package at <code style={{ color: "#feb47b" }}>packages/remotion-captions-themes/src/themes/</code>. Once registered in the registry, they will immediately show up in the player select dropdown for validation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
