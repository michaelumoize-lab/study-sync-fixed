import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StudySync — Your Personal Study Vault";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#aff33e",
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          StudySync
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#ffffff",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Your Personal Study Vault
        </div>
        <div
          style={{
            marginTop: "40px",
            padding: "14px 32px",
            backgroundColor: "#aff33e",
            borderRadius: "16px",
            fontSize: 24,
            fontWeight: 700,
            color: "#0d0d0d",
          }}
        >
          Start for Free →
        </div>
      </div>
    ),
    { ...size }
  );
}