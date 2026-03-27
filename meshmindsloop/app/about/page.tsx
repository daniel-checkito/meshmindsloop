export default function AboutPage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            About <span style={{ color: "var(--orange)" }}>Meshminds3D</span>
          </h1>
          <p>
            Tools, experiments, and production systems for practical 3D printing workflows. Built for creators who want
            reliable output and faster turnaround.
          </p>
        </div>
      </section>
      <section className="container page-section">
        <div className="tool-grid">
          <article className="card">
            <h3>What I Build</h3>
            <p>Queue automation, direct G-code generators, and challenge prints that test machine limits.</p>
          </article>
          <article className="card">
            <h3>Who It Is For</h3>
            <p>Print farms, Etsy sellers, makers optimizing throughput, and creators exploring procedural geometry.</p>
          </article>
          <article className="card">
            <h3>Account Focus</h3>
            <p>This website acts as your tool hub and brand home with separate pages you can edit independently.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
