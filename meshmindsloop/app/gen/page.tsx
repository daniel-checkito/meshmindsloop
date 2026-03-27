"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function GenPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [diameter, setDiameter] = useState(80);
  const [height, setHeight] = useState(120);
  const [segments, setSegments] = useState(72);
  const [twist, setTwist] = useState(180);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const estimateLayers = useMemo(() => Math.floor(height / 0.2), [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;

    const draw = () => {
      frame += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0f0f0f";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,107,0,0.8)";
      ctx.lineWidth = 1;
      const cx = w / 2;
      const cy = h / 2;
      const layers = Math.max(8, Math.floor(height / 6));
      for (let l = 0; l < layers; l++) {
        const t = l / layers;
        const r = (diameter / 2) * (0.8 - t * 0.2);
        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const a = (s / segments) * Math.PI * 2 + frame + t * ((twist * Math.PI) / 180);
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r * 0.45 + (t - 0.5) * height * 0.8;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [diameter, height, segments, twist]);

  const generate = () => {
    const lines: string[] = [];
    lines.push("; MESHMINDS GEN");
    lines.push(`; diameter=${diameter} height=${height} segments=${segments} twist=${twist}`);
    lines.push("G28");
    lines.push("M140 S60");
    lines.push("M104 S215");
    lines.push("M190 S60");
    lines.push("M109 S215");
    let e = 0;
    for (let z = 0; z < height; z += 0.2) {
      const t = z / Math.max(height, 1);
      const r = diameter / 2 - t * 8;
      for (let s = 0; s <= segments; s++) {
        const a = (s / segments) * Math.PI * 2 + t * ((twist * Math.PI) / 180);
        const x = 128 + Math.cos(a) * r;
        const y = 128 + Math.sin(a) * r;
        e += 0.03;
        lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} E${e.toFixed(5)} F2400`);
      }
    }
    lines.push("M104 S0");
    lines.push("M140 S0");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    setDownloadUrl(URL.createObjectURL(blob));
  };

  return (
    <main className="container page-section">
      <h2>Gen</h2>
      <p className="muted">Native generative preview + G-code export.</p>
      <div className="tool-grid" style={{ marginTop: 14 }}>
        <div className="card">
          <label>
            Diameter
            <input type="range" min={20} max={220} value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} />
            <div>{diameter} mm</div>
          </label>
          <label>
            Height
            <input type="range" min={20} max={250} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            <div>{height} mm</div>
          </label>
          <label>
            Segments
            <input type="range" min={24} max={180} value={segments} onChange={(e) => setSegments(Number(e.target.value))} />
            <div>{segments}</div>
          </label>
          <label>
            Twist
            <input type="range" min={0} max={720} value={twist} onChange={(e) => setTwist(Number(e.target.value))} />
            <div>{twist} deg</div>
          </label>
          <p className="muted">Estimated layers: {estimateLayers}</p>
          <button onClick={generate}>Generate GCode</button>
          {downloadUrl ? (
            <p>
              <a href={downloadUrl} download={`meshminds_gen_${diameter}x${height}.gcode`}>
                Download generated .gcode
              </a>
            </p>
          ) : null}
        </div>
        <div className="card">
          <canvas ref={canvasRef} width={700} height={460} style={{ width: "100%", borderRadius: 8, border: "1px solid #222" }} />
        </div>
      </div>
    </main>
  );
}
