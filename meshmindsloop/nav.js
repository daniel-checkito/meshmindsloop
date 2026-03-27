// nav.js — shared navigation for all Meshminds tools
// Drop this <script src="/nav.js"></script> in every page's <head>

(function () {
  const PAGES = [
    { href: "/index.html", label: "Home", sub: "3D printing tools" },
    { href: "/loop.html", label: "Loop Farming", sub: "Infinite print queue" },
    { href: "/loop-pro.html", label: "Loop Pro", sub: "Advanced queue mode" },
    { href: "/gen.html", label: "Gen", sub: "Algorithmic G-code" },
    { href: "/impossible.html", label: "Impossible", sub: "Push your printer" },
    { href: "/character.html", label: "Character", sub: "Build a figurine", badge: "New" },
    { href: "/about.html", label: "About", sub: "@meshminds3d" }
  ];

  const current = window.location.pathname.replace(/\/$/, "") || "/index.html";

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
    #mm-nav {
      position: sticky; top: 0; z-index: 999;
      background: #111; border-bottom: 2px solid #FF6B00;
      display: flex; align-items: center; gap: 0;
      height: 52px; padding: 0 20px;
      font-family: 'DM Sans', sans-serif;
      box-shadow: 0 2px 16px rgba(0,0,0,0.25);
    }
    #mm-nav .mm-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.45rem; letter-spacing: 0.05em; line-height: 1;
      color: #fff; text-decoration: none; margin-right: 24px; flex-shrink: 0;
    }
    #mm-nav .mm-logo span { color: #FF6B00; }
    #mm-nav .mm-links {
      display: flex; align-items: stretch; height: 100%; flex: 1; gap: 0;
      overflow-x: auto; scrollbar-width: none;
    }
    #mm-nav .mm-links::-webkit-scrollbar { display: none; }
    #mm-nav .mm-link {
      display: flex; flex-direction: column; justify-content: center;
      padding: 0 14px; text-decoration: none; border-bottom: 3px solid transparent;
      transition: background 0.15s, border-color 0.15s; white-space: nowrap;
      position: relative;
    }
    #mm-nav .mm-link:hover { background: rgba(255,107,0,0.08); }
    #mm-nav .mm-link.active { border-bottom-color: #FF6B00; background: rgba(255,107,0,0.06); }
    #mm-nav .mm-link-label {
      font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.05em;
      color: #eee; line-height: 1;
    }
    #mm-nav .mm-link.active .mm-link-label { color: #FF6B00; }
    #mm-nav .mm-link-sub {
      font-family: 'DM Mono', monospace; font-size: 9px; color: #666;
      letter-spacing: 0.06em; margin-top: 1px; line-height: 1;
    }
    #mm-nav .mm-link.active .mm-link-sub { color: #cc5500; }
    #mm-nav .mm-badge-dot {
      position: absolute; top: 8px; right: 6px;
      background: #FF6B00; color: #fff;
      font-family: 'DM Mono', monospace; font-size: 8px; font-weight: 500;
      padding: 1px 5px; border-radius: 100px; line-height: 1.4;
    }
    #mm-nav .mm-right { margin-left: auto; flex-shrink: 0; padding-left: 14px; }
    #mm-nav .mm-ig {
      font-family: 'DM Mono', monospace; font-size: 10px; color: #555;
      text-decoration: none; transition: color 0.15s; letter-spacing: 0.06em;
    }
    #mm-nav .mm-ig:hover { color: #FF6B00; }
    @media(max-width: 520px) {
      #mm-nav .mm-link-sub { display: none; }
      #mm-nav .mm-link { padding: 0 10px; }
      #mm-nav .mm-right { display: none; }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'mm-nav';

  const logo = document.createElement('a');
  logo.className = 'mm-logo';
  logo.href = '/index.html';
  logo.innerHTML = 'Meshminds<span>.</span>';
  nav.appendChild(logo);

  const links = document.createElement('div');
  links.className = 'mm-links';

  PAGES.forEach(p => {
    const a = document.createElement('a');
    const isActive = current === p.href || (p.href !== "/index.html" && current.endsWith(p.href.replace("/", "")));
    a.className = "mm-link" + (isActive ? " active" : "");
    a.href = p.href;
    a.innerHTML = `<span class="mm-link-label">${p.label}</span><span class="mm-link-sub">${p.sub}</span>`;
    if (p.badge) {
      const dot = document.createElement('span');
      dot.className = 'mm-badge-dot';
      dot.textContent = p.badge;
      a.appendChild(dot);
    }
    links.appendChild(a);
  });
  nav.appendChild(links);

  const right = document.createElement('div');
  right.className = 'mm-right';
  right.innerHTML = '<a class="mm-ig" href="https://instagram.com/meshminds3d" target="_blank">@meshminds3d</a>';
  nav.appendChild(right);

  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    body.insertBefore(nav, body.firstChild);
  });
})();
