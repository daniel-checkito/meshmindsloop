export default function ContactPage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            Contact <span style={{ color: "var(--orange)" }}>Meshminds3D</span>
          </h1>
          <p>For collaborations, custom tooling, or printing workflow consulting.</p>
        </div>
      </section>
      <section className="container page-section">
        <div className="tool-grid">
          <article className="card">
            <h3>Instagram</h3>
            <p>
              <a href="https://instagram.com/meshminds3d" target="_blank" rel="noreferrer">
                @meshminds3d
              </a>
            </p>
          </article>
          <article className="card">
            <h3>Email</h3>
            <p>hello@meshminds3d.com</p>
          </article>
          <article className="card">
            <h3>Services</h3>
            <p>Tooling, automation setup, print profile optimization, and production troubleshooting.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
