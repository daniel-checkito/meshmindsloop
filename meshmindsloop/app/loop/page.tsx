"use client";

import { useMemo, useState } from "react";

type QueueItem = {
  id: string;
  name: string;
  content: string;
  qty: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function LoopPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [cooldown, setCooldown] = useState(20);
  const [ejectSpeed, setEjectSpeed] = useState(1200);
  const [nozzleZ, setNozzleZ] = useState(5);
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const totalPrints = useMemo(() => queue.reduce((acc, q) => acc + q.qty, 0), [queue]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.name.toLowerCase().endsWith(".gcode"));
    const mapped = await Promise.all(
      list.map(async (file) => ({
        id: uid(),
        name: file.name.replace(/\.gcode$/i, ""),
        content: await file.text(),
        qty: 1
      }))
    );
    setQueue((prev) => [...prev, ...mapped]);
  };

  const changeQty = (id: string, delta: number) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)));
  };

  const removeItem = (id: string) => setQueue((prev) => prev.filter((q) => q.id !== id));

  const generate = () => {
    if (!queue.length) return;
    const lines: string[] = [];
    lines.push("; MESHMINDS LOOP FARMING OUTPUT");
    lines.push(`; Cooldown=${cooldown} mins | EjectSpeed=${ejectSpeed} | NozzleZ=${nozzleZ}`);
    let current = 1;
    const total = totalPrints;
    queue.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        lines.push(`; === PRINT ${current}/${total}: ${item.name} ===`);
        lines.push(item.content);
        if (current < total) {
          lines.push("; === EJECT BLOCK ===");
          lines.push("M400");
          lines.push(`G1 Z${nozzleZ} F3000`);
          lines.push(`G1 Y0 F${ejectSpeed}`);
          lines.push(`G4 P${cooldown * 60000}`);
        }
        current++;
      }
    });
    lines.push("; === COMPLETE ===");
    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setGeneratedName(`meshminds_loop_${totalPrints}prints.gcode`);
  };

  return (
    <main className="container page-section">
      <h2>Loop Farming</h2>
      <p className="muted">Native React queue tool for batch loop generation (no iframe).</p>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>1) Upload .gcode files</h3>
        <input
          type="file"
          accept=".gcode"
          multiple
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
        <div style={{ marginTop: 10 }}>
          {queue.length === 0 ? (
            <p className="muted">No files added yet.</p>
          ) : (
            queue.map((item) => (
              <div key={item.id} style={{ borderTop: "1px solid var(--border)", padding: "8px 0" }}>
                <strong>{item.name}</strong>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button onClick={() => changeQty(item.id, -1)}>-</button>
                  <span>qty: {item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}>+</button>
                  <button onClick={() => removeItem(item.id)}>remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>2) Loop Settings</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
          <label>
            Cooldown (mins)
            <input type="number" min={1} value={cooldown} onChange={(e) => setCooldown(Number(e.target.value) || 1)} />
          </label>
          <label>
            Eject Speed
            <input
              type="number"
              min={100}
              value={ejectSpeed}
              onChange={(e) => setEjectSpeed(Number(e.target.value) || 100)}
            />
          </label>
          <label>
            Nozzle Z
            <input type="number" min={1} value={nozzleZ} onChange={(e) => setNozzleZ(Number(e.target.value) || 1)} />
          </label>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>3) Generate</h3>
        <p className="muted">
          Total queued prints: <strong>{totalPrints}</strong>
        </p>
        <button onClick={generate} disabled={!queue.length}>
          Generate Looped GCode
        </button>
        {downloadUrl && generatedName ? (
          <p style={{ marginTop: 12 }}>
            <a href={downloadUrl} download={generatedName}>
              Download {generatedName}
            </a>
          </p>
        ) : null}
      </div>

      <style jsx global>{`
        input[type="number"],
        input[type="file"],
        button {
          margin-top: 4px;
          background: #111;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 10px;
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
