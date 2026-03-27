import Link from "next/link";

const tools = [
  { href: "/loop", name: "Loop Farming", desc: "Build print queues and auto-eject loops." },
  { href: "/loop-pro", name: "Loop Pro", desc: "Advanced loop workflow with pro controls." },
  { href: "/gen", name: "Gen", desc: "Generate algorithmic G-code directly." },
  { href: "/impossible", name: "Impossible", desc: "Run extreme print challenge files." },
  { href: "/character", name: "Character", desc: "Create figurine-style printable characters." },
  { href: "/about", name: "About", desc: "Your creator profile and account positioning." },
  { href: "/contact", name: "Contact", desc: "Ways to reach your 3D printing brand." }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            Meshminds <span style={{ color: "var(--orange)" }}>3D</span>
          </h1>
          <p>
            React + Next.js website for your 3D printing account. Each subpage is isolated in its own route so you can
            edit tools independently and deploy cleanly on Vercel.
          </p>
        </div>
      </section>

      <section className="container page-section">
        <h2>Tools & Pages</h2>
        <div className="tool-grid">
          {tools.map((tool) => (
            <Link className="card" key={tool.href} href={tool.href}>
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
