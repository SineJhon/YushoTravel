"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", background: "#f5f0e5", color: "#161c18", display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 480 }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Something went off-trail</h1>
          <p style={{ opacity: 0.7, marginBottom: 20 }}>An unexpected error occurred. Try again, or contact Yusho Travel.</p>
          <button
            onClick={reset}
            style={{ background: "#e6b23a", border: "none", borderRadius: 999, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}