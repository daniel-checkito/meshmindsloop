"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Challenge = {
  id: string;
  title: string;
  difficulty: number;
  description: string;
};

const challenges: Challenge[] = [
  { id: "floating-rings", title: "Floating Ring Stack", difficulty: 5, description: "Free-space ring bridging challenge." },
  { id: "knot-tower", title: "Torus Knot Tower", difficulty: 5, description: "Non-planar knot path printing test." },
  { id: "hyperbolic-grid", title: "Hyperbolic Lattice", difficulty: 4, description: "Saddle lattice with open-air spans." },
  { id: "spider-web", title: "Mid-Air Spider Web", difficulty: 5, description: "Rapid cooling bridge web challenge." }
];

export default function ImpossiblePage() {
  const [selected, setSelected] = useState<Challenge>(challenges[0]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#090909";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,107,0,0.85)";
      ctx.lineWidth = 1;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < 40; i++) {
        const a = i * 0.3 + t;
        const r = 40 + i * 3;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 40, cy + Math.sin(a) * 26, r * 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [selected.id]);

  const stars = useMemo(() => "★".repeat(selected.difficulty) + "☆".repeat(5 - selected.difficulty), [selected.difficulty]);

  const generate = () => {
    const lines = [
      `; MESHMINDS IMPOSSIBLE - ${selected.title}`,
      "G28",
      "M109 S215",
      "M190 S60",
      "G1 X128 Y128 Z0.2 F4000"
    ];
    for (let i = 0; i < 320; i++) {
      const a = i * 0.22;
      const x = 128 + Math.cos(a) * (35 + i * 0.04);
      const y = 128 + Math.sin(a * 1.13) * (30 + i * 0.03);
      const z = 0.2 + i * 0.05;
      lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} E${(i * 0.03).toFixed(5)} F2200`);
    }
    lines.push("M104 S0");
    lines.push("M140 S0");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    setDownloadUrl(URL.createObjectURL(blob));
  };

  return (
    <main className="container page-section">
      <h2>Impossible Prints</h2>
      <p className="muted">Native challenge browser and generator.</p>
      <div className="tool-grid" style={{ marginTop: 12 }}>
        <div className="card">
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: 8,
                textAlign: "left",
                borderColor: selected.id === c.id ? "var(--orange)" : "var(--border)"
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="card">
          <h3>{selected.title}</h3>
          <p className="muted">Difficulty: {stars}</p>
          <p>{selected.description}</p>
          <canvas ref={canvasRef} width={760} height={360} style={{ width: "100%", border: "1px solid #222", borderRadius: 8 }} />
          <div style={{ marginTop: 10 }}>
            <button onClick={generate}>Generate Challenge GCode</button>
            {downloadUrl ? (
              <p>
                <a href={downloadUrl} download={`meshminds_${selected.id}.gcode`}>
                  Download {selected.id}.gcode
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
