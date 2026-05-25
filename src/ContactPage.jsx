import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

  .cp-root *, .cp-root *::before, .cp-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .cp-root {
    --cream: #EDE8DF;
    --ink: #111010;
    --muted: #8a8578;
    --accent: #C8401A;
    --border: rgba(17,16,16,0.12);
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    cursor: none;
    position: relative;
    min-height: 100vh;
  }

  .cp-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
    opacity: 0.5;
  }

  .cp-cursor {
    width: 12px; height: 12px;
    background: var(--ink);
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.25s ease, height 0.25s ease, background 0.25s ease;
  }
  .cp-cursor.hovered { width: 6px; height: 6px; background: #C8401A; }

  .cp-cursor-ring {
    width: 36px; height: 36px;
    border: 1.5px solid var(--ink);
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease;
  }
  .cp-cursor-ring.hovered { width: 56px; height: 56px; border-color: #C8401A; }

  .cp-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 2rem 4rem;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    background: var(--cream);
    opacity: 0; transform: translateY(-20px);
    animation: cp-fadeDown 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .cp-nav-logo {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cp-nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .cp-nav-links a {
    font-size: 13px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--muted);
    transition: color 0.2s;
    position: relative;
  }
  .cp-nav-links a::after {
    content: '';
    position: absolute; bottom: -2px; left: 0; width: 0; height: 1px;
    background: var(--ink);
    transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .cp-nav-links a:hover { color: var(--ink); }
  .cp-nav-links a:hover::after { width: 100%; }
  .cp-nav-links a.active { color: var(--ink); }

  .cp-hero {
    padding: 5rem 4rem 4rem;
    border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
  }
  .cp-hero-watermark {
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(10rem, 22vw, 22rem);
    color: rgba(17,16,16,0.055);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    letter-spacing: 0.02em;
    user-select: none;
    pointer-events: none;
    animation: cp-driftIn 1.2s 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .cp-hero-content { position: relative; z-index: 2; }
  .cp-hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 13vw, 13rem);
    line-height: 0.9;
    letter-spacing: -0.01em;
  }
  .cp-hero-line { display: block; overflow: hidden; }
  .cp-hero-line span {
    display: block;
    transform: translateY(100%);
    animation: cp-slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .cp-hero-line:nth-child(1) span { animation-delay: 0.3s; }
  .cp-hero-line:nth-child(2) span { animation-delay: 0.45s; }
  .cp-hero-line:nth-child(3) span { animation-delay: 0.6s; }

  .cp-hero-meta {
    margin-top: 2.5rem;
    display: flex; align-items: flex-end; justify-content: space-between;
    opacity: 0;
    animation: cp-fadeUp 0.7s 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .cp-hero-sub {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
    max-width: 320px;
  }
  .cp-hero-stat { text-align: right; }
  .cp-hero-stat .num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: 1;
  }
  .cp-hero-stat .label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-top: 0.25rem;
  }

  .cp-grid {
    min-height: 70vh;
    opacity: 0;
    animation: cp-fadeUp 0.7s 1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .cp-info-panel {
    padding: 4rem 6rem;
    display: flex; flex-direction: column; gap: 3rem;
  }
  .cp-section-title {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 2rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .cp-section-title::after {
    content: ''; flex: 1;
    height: 1px; background: var(--border);
  }

  .cp-contact-link {
    display: flex; align-items: baseline; justify-content: space-between;
    text-decoration: none; color: var(--ink);
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
    transition: padding-left 0.3s cubic-bezier(0.16,1,0.3,1);
    opacity: 0;
    transform: translateY(20px);
  }
  .cp-contact-link.visible {
    opacity: 1; transform: translateY(0);
  }
  .cp-contact-link::before {
    content: '→';
    position: absolute; left: -2rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    color: #C8401A;
    transition: left 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .cp-contact-link:hover { padding-left: 2rem; }
  .cp-contact-link:hover::before { left: 0; }
  .cp-link-type {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .cp-link-value { font-size: 15px; font-weight: 500; }

  .cp-availability {
    margin-top: 3rem;
    display: flex; align-items: center; gap: 1rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--border);
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .cp-availability.visible { opacity: 1; transform: translateY(0); }
  .cp-avail-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #2ECC71;
    animation: cp-pulse 2s infinite;
    flex-shrink: 0;
  }
  .cp-avail-text { font-size: 13px; line-height: 1.4; }
  .cp-avail-text strong { display: block; font-weight: 500; font-size: 14px; }
  .cp-avail-text span { color: var(--muted); font-size: 12px; }

  .cp-social-row {
    display: flex; gap: 1.5rem;
    padding-top: 2rem; border-top: 1px solid var(--border);
  }
  .cp-social-link {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--muted);
    display: flex; align-items: center; gap: 0.4rem;
    transition: color 0.2s;
  }
  .cp-social-link::after { content: '↗'; font-size: 10px; }
  .cp-social-link:hover { color: var(--ink); }

  .cp-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 4rem;
    border-top: 1px solid var(--border);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  @keyframes cp-slideUp { to { transform: translateY(0); } }
  @keyframes cp-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cp-fadeDown { to { opacity: 1; transform: translateY(0); } }
  @keyframes cp-driftIn {
    from { opacity: 0; transform: translate(-50%, -60%); }
    to   { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes cp-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(46,204,113,0); }
  }
`;

const contactItems = [
  { type: "Email", value: "adityaraj309050@gmail.com", href: "mailto:adityaraj309050@gmail.com" },
  { type: "Phone", value: "+91 12345 67890", href: "tel:+911234567890" },
  { type: "Location", value: "Bihar, India", href: "#" },
  { type: "Response time", value: "Within 24 hours", href: "#" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/aditya309050" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Twitter", href: "https://twitter.com" },
];

export default function ContactPage() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const linkRefs = useRef([]);
  const availRef = useRef(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onEnter = () => {
      cursorRef.current?.classList.add("hovered");
      ringRef.current?.classList.add("hovered");
    };

    const onLeave = () => {
      cursorRef.current?.classList.remove("hovered");
      ringRef.current?.classList.remove("hovered");
    };

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    linkRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = `opacity 0.5s ${0.1 + i * 0.08}s ease, transform 0.5s ${0.1 + i * 0.08}s ease`;
      observer.observe(el);
    });

    if (availRef.current) {
      availRef.current.style.transition = `opacity 0.5s ${0.1 + linkRefs.current.length * 0.08}s ease, transform 0.5s ${0.1 + linkRefs.current.length * 0.08}s ease`;
      observer.observe(availRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="cp-root">
        <div className="cp-cursor" ref={cursorRef} />
        <div className="cp-cursor-ring" ref={ringRef} />

        <nav className="cp-nav">
          <div className="cp-nav-logo">Portfolio ©2025</div>
          <ul className="cp-nav-links">
            <li><a href="/">Work</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/">Services</a></li>
            <li><a href="/contact" className="active">Contact</a></li>
          </ul>
        </nav>

        <section className="cp-hero">
          <div className="cp-hero-watermark">CONTACT</div>
          <div className="cp-hero-content">
            <h1>
              <span className="cp-hero-line"><span>LET'S</span></span>
              <span className="cp-hero-line"><span>BUILD</span></span>
              <span className="cp-hero-line"><span>TOGETHER</span></span>
            </h1>
            <div className="cp-hero-meta">
              <p className="cp-hero-sub">
                Available for freelance opportunities and full-time roles.
                Let's discuss your next project.
              </p>
              <div className="cp-hero-stat">
                <span className="num">100%</span>
                <span className="label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        <div className="cp-grid">
          <div className="cp-info-panel">
            <div>
              <div className="cp-section-title">02 — Direct contact</div>

              {contactItems.map(({ type, value, href }, i) => (
                <a
                  key={type}
                  href={href}
                  className="cp-contact-link"
                  ref={(el) => (linkRefs.current[i] = el)}
                >
                  <span className="cp-link-type">{type}</span>
                  <span className="cp-link-value">{value}</span>
                </a>
              ))}

              <div className="cp-availability" ref={availRef}>
                <div className="cp-avail-dot" />
                <div className="cp-avail-text">
                  <strong>Available for new projects</strong>
                  <span>Next slot opens — January 2026</span>
                </div>
              </div>
            </div>

            <div>
              <div className="cp-social-row">
                {socialLinks.map(({ label, href }) => (
                  <a key={label} href={href} className="cp-social-link" target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="cp-footer">
          <span>© 2025 — All rights reserved</span>
          <span>Built with intention</span>
        </footer>
      </div>
    </>
  );
}
