"use client";

import { useMemo, useState } from "react";

type QueueItem = {
  id: string;
  name: string;
  content: string;
  qty: number;
  pauseAfter: boolean;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

export default function LoopProPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [cooldown, setCooldown] = useState(20);
  const [progressiveCooldown, setProgressiveCooldown] = useState(false);
  const [injectComments, setInjectComments] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  const total = useMemo(() => queue.reduce((a, b) => a + b.qty, 0), [queue]);

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    const mapped = await Promise.all(
      Array.from(files)
        .filter((f) => f.name.toLowerCase().endsWith(".gcode"))
        .map(async (file) => ({
          id: makeId(),
          name: file.name.replace(/\.gcode$/i, ""),
          content: await file.text(),
          qty: 1,
          pauseAfter: false
        }))
    );
    setQueue((prev) => [...prev, ...mapped]);
  };

  const generate = () => {
    if (!queue.length) return;
    let index = 0;
    const content: string[] = ["; MESHMINDS LOOP PRO"];
    queue.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        index++;
        if (injectComments) content.push(`; ==== ITEM ${index}/${total}: ${item.name} ====`);
        content.push(item.content);
        if (index < total) {
          const cd = progressiveCooldown ? cooldown + (index - 1) * 5 : cooldown;
          content.push(`G4 P${cd * 60000} ; cooldown`);
          if (item.pauseAfter && i === item.qty - 1) {
            content.push("M0 ; manual pause");
          }
        }
      }
    });
    const blob = new Blob([content.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setFilename(`meshminds_loop_pro_${total}prints.gcode`);
  };

  return (
    <main className="container page-section">
      <h2>Loop Pro</h2>
      <p className="muted">Advanced loop queue with pause controls and progressive cooldown.</p>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Queue</h3>
        <input type="file" accept=".gcode" multiple onChange={(e) => void onUpload(e.target.files)} />
        <div style={{ marginTop: 10 }}>
          {queue.map((q) => (
            <div key={q.id} style={{ borderTop: "1px solid var(--border)", padding: "8px 0" }}>
              <strong>{q.name}</strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                <button onClick={() => setQueue((prev) => prev.map((p) => (p.id === q.id ? { ...p, qty: Math.max(1, p.qty - 1) } : p)))}>-</button>
                <span>qty {q.qty}</span>
                <button onClick={() => setQueue((prev) => prev.map((p) => (p.id === q.id ? { ...p, qty: p.qty + 1 } : p)))}>+</button>
                <label>
                  <input
                    type="checkbox"
                    checked={q.pauseAfter}
                    onChange={(e) =>
                      setQueue((prev) => prev.map((p) => (p.id === q.id ? { ...p, pauseAfter: e.target.checked } : p)))
                    }
                  />{" "}
                  pause after this file
                </label>
                <button onClick={() => setQueue((prev) => prev.filter((p) => p.id !== q.id))}>remove</button>
              </div>
            </div>
          ))}
          {!queue.length ? <p className="muted">No files uploaded yet.</p> : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Pro Settings</h3>
        <label>
          Cooldown minutes
          <input type="number" value={cooldown} min={1} onChange={(e) => setCooldown(Number(e.target.value) || 1)} />
        </label>
        <label style={{ display: "block", marginTop: 8 }}>
          <input type="checkbox" checked={progressiveCooldown} onChange={(e) => setProgressiveCooldown(e.target.checked)} />{" "}
          Progressive cooldown (+5 mins each loop)
        </label>
        <label style={{ display: "block", marginTop: 6 }}>
          <input type="checkbox" checked={injectComments} onChange={(e) => setInjectComments(e.target.checked)} /> Inject loop comments
        </label>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <button onClick={generate} disabled={!queue.length}>
          Generate Loop Pro File
        </button>
        {downloadUrl ? (
          <p style={{ marginTop: 10 }}>
            <a href={downloadUrl} download={filename}>
              Download {filename}
            </a>
          </p>
        ) : null}
      </div>
    </main>
  );
}
