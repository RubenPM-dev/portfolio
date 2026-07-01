import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f8f5ef 0%, #ebe4d5 100%)",
          color: "#141413",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "70%" }}>
          <p style={{ fontSize: 26, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            Ruben Poveda
          </p>
          <h1 style={{ fontSize: 74, lineHeight: 1, margin: 0 }}>
            Senior iOS Engineer for Realtime Product Systems
          </h1>
        </div>
        <div
          style={{
            width: "230px",
            height: "350px",
            borderRadius: "28px",
            border: "1px solid rgba(20,20,19,0.25)",
            background: "radial-gradient(circle at 30% 30%, #d5cebf 0%, #ece4d2 45%, #f7f2e7 100%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
