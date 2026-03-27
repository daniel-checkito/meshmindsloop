"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CharacterPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bodyType, setBodyType] = useState("slim");
  const [headType, setHeadType] = useState("round");
  const [weapon, setWeapon] = useState("sword");
  const [height, setHeight] = useState(80);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let r = 0;
    const draw = () => {
      r += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#101010";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 20;
      ctx.strokeStyle = "rgba(255,107,0,0.85)";
      ctx.lineWidth = 2;
      const scale = height / 80;
      const torso = bodyType === "stocky" ? 52 : bodyType === "tall" ? 72 : 60;
      ctx.strokeRect(cx - 20 * scale, cy - torso * scale, 40 * scale, torso * scale);
      ctx.beginPath();
      const hr = (headType === "helmet" ? 18 : 14) * scale;
      ctx.arc(cx, cy - (torso + 16) * scale, hr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      const wx = cx + Math.cos(r) * 8;
      const wy = cy - (torso - 10) * scale;
      ctx.moveTo(cx + 20 * scale, wy);
      ctx.lineTo(wx + 48 * scale, wy - 28 * scale);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(weapon.toUpperCase(), 14, 20);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [bodyType, headType, weapon, height]);

  const summary = useMemo(() => `${bodyType} body, ${headType} head, ${weapon}, ${height}mm`, [bodyType, headType, weapon, height]);

  const generate = () => {
    const lines = [
      `; MESHMINDS CHARACTER`,
      `; ${summary}`,
      "G28",
      "M109 S215",
      "M190 S60",
      "G1 X128 Y128 Z0.2 F4000"
    ];
    let e = 0;
    for (let z = 0; z < height; z += 0.2) {
      const r = 8 + (z / height) * 8;
      for (let s = 0; s <= 60; s++) {
        const a = (s / 60) * Math.PI * 2;
        const x = 128 + Math.cos(a) * r;
        const y = 128 + Math.sin(a) * r;
        e += 0.02;
        lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} E${e.toFixed(5)} F2400`);
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    setDownloadUrl(URL.createObjectURL(blob));
  };

  return (
    <main className="container page-section">
      <h2>Character Builder</h2>
      <p className="muted">Native React figurine configurator and generator.</p>
      <div className="tool-grid" style={{ marginTop: 14 }}>
        <div className="card">
          <label>
            Body
            <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
              <option value="slim">Slim</option>
              <option value="stocky">Stocky</option>
              <option value="tall">Tall</option>
            </select>
          </label>
          <label>
            Head
            <select value={headType} onChange={(e) => setHeadType(e.target.value)}>
              <option value="round">Round</option>
              <option value="helmet">Helmet</option>
              <option value="robot">Robot</option>
            </select>
          </label>
          <label>
            Weapon
            <select value={weapon} onChange={(e) => setWeapon(e.target.value)}>
              <option value="sword">Sword</option>
              <option value="staff">Staff</option>
              <option value="axe">Axe</option>
            </select>
          </label>
          <label>
            Height ({height}mm)
            <input type="range" min={40} max={140} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </label>
          <p className="muted">{summary}</p>
          <button onClick={generate}>Generate Character GCode</button>
          {downloadUrl ? (
            <p>
              <a href={downloadUrl} download={`meshminds_character_${bodyType}_${weapon}.gcode`}>
                Download character.gcode
              </a>
            </p>
          ) : null}
        </div>
        <div className="card">
          <canvas ref={canvasRef} width={720} height={460} style={{ width: "100%", border: "1px solid #222", borderRadius: 8 }} />
        </div>
      </div>
      <style jsx global>{`
        select,
        input[type="range"] {
          width: 100%;
          margin-top: 4px;
          margin-bottom: 10px;
          background: #111;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px;
        }
      `}</style>
    </main>
  );
}
