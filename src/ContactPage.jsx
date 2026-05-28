import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');

  .cp *, .cp *::before, .cp *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp {
    --cream: #EAE5DC;
    --ink:   #0F0E0E;
    --muted: #9a9389;
    --red:   #C8401A;
    --border: rgba(15,14,14,0.13);
    --panel-left: #E3DDD3;
    min-height: 100vh;
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    cursor: none;
    overflow-x: hidden;
  }

  .cp::after {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 200;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  }

  .cp-dot, .cp-ring {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
  }
  .cp-dot  { width: 8px; height: 8px; background: var(--ink); transition: width .2s, height .2s, background .2s; }
  .cp-ring { width: 32px; height: 32px; border: 1.5px solid rgba(15,14,14,.4); transition: width .25s, height .25s, border-color .25s; }
  .cp-dot.h  { width: 5px; height: 5px; background: #C8401A; }
  .cp-ring.h { width: 48px; height: 48px; border-color: #C8401A; }

  .cp-nav {
    display: flex; align-items: center; justify-content: flex-start;
    padding: 1.6rem 3.5rem;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100; background: var(--cream);
    opacity: 0; animation: cpFD .6s .1s cubic-bezier(.16,1,.3,1) forwards;
  }
  .cp-nav-back {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .1em; text-transform: uppercase;
    text-decoration: none; color: var(--muted);
    transition: color .2s;
  }
  .cp-nav-back:hover { color: var(--ink); }

  .cp-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 64px);
    position: relative;
  }

  .cp-left {
    padding: 4rem 5rem 3rem;
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
    border-right: 1px solid var(--border);
  }

  .cp-accent-box {
    position: absolute;
    top: 50%; right: -1px;
    transform: translateY(-50%);
    width: 6px; height: 120px;
    background: #C8401A;
    z-index: 10;
  }

  .cp-hero-copy {
    max-width: 520px;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--ink);
    opacity: .9;
    margin-top: 2rem;
  }

  .cp-tag {
    display: inline-flex; align-items: center; gap: .75rem;
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    opacity: 0; animation: cpFU .6s .3s cubic-bezier(.16,1,.3,1) forwards;
  }
  .cp-tag-line { width: 26px; height: 1px; background: var(--muted); }
  .cp-tag-circle {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
  }

  .cp-left-h {
    margin-top: 2rem; position: relative; z-index: 2;
    opacity: 0; animation: cpFU .7s .5s cubic-bezier(.16,1,.3,1) forwards;
    margin-bottom: 1.5rem;
  }
  .cp-left-h h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5.5rem, 11vw, 10rem);
    line-height: .9; letter-spacing: -.01em;
  }
  .cp-hl { display: block; overflow: hidden; }
  .cp-hl span {
    display: block; transform: translateY(105%);
    animation: cpSU .8s cubic-bezier(.16,1,.3,1) forwards;
  }
  .cp-hl:nth-child(1) span { animation-delay: .35s; }
  .cp-hl:nth-child(2) span { animation-delay: .5s; }
  .cp-hl:nth-child(3) span { animation-delay: .65s; }

  .cp-divider-wrap {
    display: flex; align-items: center; justify-content: center;
    padding: .5rem 0; position: relative; z-index: 2;
  }
  .cp-accent-bar {
    display: block; width: 3px; height: 3.2rem;
    background: #C8401A; border-radius: 2px;
    animation: cpGrow .7s 1s cubic-bezier(.16,1,.3,1) both;
    transform-origin: top center;
  }
  @keyframes cpGrow { from { transform: scaleY(0); opacity:0; } to { transform: scaleY(1); opacity:1; } }

  .cp-left-bottom {
    position: relative; z-index: 2;
    opacity: 0; animation: cpFU .7s 1s cubic-bezier(.16,1,.3,1) forwards;
  }
  .cp-left-sub {
    font-size: 13px; color: var(--muted); line-height: 1.65;
    max-width: 280px; margin-bottom: 2.5rem; font-style: italic;
  }
  .cp-stat-box {
    border: 1px solid var(--border); padding: 1.5rem 2rem;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .cp-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 4.5rem); line-height: 1;
  }
  .cp-stat-label {
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    display: block; margin-top: .2rem;
  }
  .cp-stat-right {
    text-align: right;
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted); line-height: 1.6;
  }

  .cp-right {
    padding: 4rem 5rem 3rem;
    display: flex; flex-direction: column; gap: 2.5rem; justify-content: center;
    opacity: 0; animation: cpFU .7s 1.1s cubic-bezier(.16,1,.3,1) forwards;
  }

  .cp-sec-head {
    display: flex; align-items: center; gap: .75rem;
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 1.2rem;
  }
  .cp-sec-head::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .cp-contact-rows { display: flex; flex-direction: column; }
  .cp-row {
    display: flex; align-items: center;
    padding: 1.3rem 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none; color: var(--ink);
    position: relative; overflow: hidden;
    opacity: 0; transform: translateY(16px);
    transition: padding-left .3s cubic-bezier(.16,1,.3,1), opacity .45s ease, transform .45s ease;
  }
  .cp-row.vis { opacity: 1; transform: translateY(0); }
  .cp-row::before {
    content: '↗'; position: absolute; right: 0;
    font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem;
    color: #C8401A; opacity: 0; transition: opacity .25s;
  }
  .cp-row:hover { padding-left: .75rem; }
  .cp-row:hover::before { opacity: 1; }
  .cp-row-label {
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); width: 100px; flex-shrink: 0;
  }
  .cp-row-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem; letter-spacing: .02em; line-height: 1;
  }

  .cp-social { display: flex; gap: 1rem; flex-wrap: wrap; }
  .cp-pill {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .65rem 1.3rem; border: 1px solid var(--border);
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .08em; text-transform: uppercase;
    text-decoration: none; color: var(--ink);
    position: relative; overflow: hidden; transition: color .3s;
  }
  .cp-pill::before {
    content: ''; position: absolute; inset: 0;
    background: var(--ink); transform: translateX(-101%);
    transition: transform .35s cubic-bezier(.16,1,.3,1); z-index: 0;
  }
  .cp-pill:hover { color: var(--cream); }
  .cp-pill:hover::before { transform: translateX(0); }
  .cp-pill span, .cp-pill-arrow { position: relative; z-index: 1; }
  .cp-pill-arrow { font-size: 10px; }

  .cp-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.3rem 3.5rem; border-top: 1px solid var(--border);
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: .08em; text-transform: uppercase; color: var(--muted);
  }

  @keyframes cpSU  { to { transform: translateY(0); } }
  @keyframes cpFU  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cpFD  { to { opacity:1; transform:translateY(0); } }
  @keyframes cpDrift { from { opacity:0; transform:translate(-4%, 6%); } to { opacity:1; transform:translate(0,0); } }
  @keyframes cpPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(39,174,96,.4); }
    50%      { box-shadow: 0 0 0 7px rgba(39,174,96,0); }
  }

  /* ── MD (≤768px) ── */
  @media (max-width: 768px) {
    .cp-body {
      grid-template-columns: 1fr;
    }
    .cp-left {
      padding: 2.5rem 2rem 2rem;
      border-bottom: 1px solid var(--border);
      border-right: none;
    }
    .cp-accent-box {
      display: none;
    }
    .cp-left-h h1 {
      font-size: clamp(4rem, 14vw, 7rem);
    }
    .cp-right {
      padding: 2.5rem 2rem 3rem;
    }
    .cp-nav {
      padding: 1.2rem 2rem;
    }
    .cp-footer {
      padding: 1.2rem 2rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .cp-hero-copy {
      max-width: 100%;
      font-size: 0.95rem;
    }
    .cp-stat-box {
      padding: 1.2rem 1.5rem;
    }
  }

  /* ── SM (≤480px) ── */
  @media (max-width: 480px) {
    .cp-nav {
      padding: 1rem 1.2rem;
    }
    .cp-left {
      padding: 2rem 1.2rem 1.8rem;
    }
    .cp-left-h {
      margin-top: 2rem;
    }
    .cp-left-h h1 {
      font-size: clamp(3.2rem, 16vw, 5.5rem);
    }
    .cp-right {
      padding: 2rem 1.2rem 2.5rem;
      gap: 2rem;
    }
    .cp-tag {
      font-size: 10px;
    }
    .cp-row-val {
      font-size: 1.1rem;
    }
    .cp-row-label {
      width: 76px;
      font-size: 9px;
    }
    .cp-social {
      gap: .7rem;
    }
    .cp-pill {
      padding: .55rem 1rem;
      font-size: 10px;
    }
    .cp-stat-box {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.2rem;
    }
    .cp-stat-right {
      text-align: left;
    }
    .cp-footer {
      padding: 1rem 1.2rem;
      font-size: 9px;
    }
    .cp-hero-copy {
      font-size: 0.88rem;
      line-height: 1.7;
    }
  }
`;

const CONTACT_ROWS = [
  { label: "Email",    value: "adityaraj309050@gmail.com", href: "mailto:adityaraj309050@gmail.com" },
  { label: "Phone",    value: "8969940709",                href: "tel:+918969940709" },
  { label: "Location", value: "Bihar, India",              href: "#" },
];

const SOCIALS = [
  { label: "GitHub",   href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const rowRefs  = useRef([]);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    const enter  = () => { dotRef.current?.classList.add("h"); ringRef.current?.classList.add("h"); };
    const leave  = () => { dotRef.current?.classList.remove("h"); ringRef.current?.classList.remove("h"); };
    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,input,textarea").forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    const loop = () => {
      if (dotRef.current)  { dotRef.current.style.left  = mx+"px"; dotRef.current.style.top  = my+"px"; }
      rx += (mx-rx)*.12; ry += (my-ry)*.12;
      if (ringRef.current) { ringRef.current.style.left = rx+"px"; ringRef.current.style.top = ry+"px"; }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transitionDelay = `${0.08 + i * 0.07}s`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="cp">
        <div className="cp-dot"  ref={dotRef}  />
        <div className="cp-ring" ref={ringRef} />

        <nav className="cp-nav">
          <a className="cp-nav-back" href="/">Back</a>
        </nav>

        <div className="cp-body">
          <div className="cp-left">
            <div className="cp-tag">
              <span className="cp-tag-line" />
              CONTACT
            </div>
            <div className="cp-left-h">
              <h1>
                <span className="cp-hl"><span>LET'S</span></span>
                <span className="cp-hl"><span>BUILD</span></span>
                <span className="cp-hl"><span>TOGETHER</span></span>
              </h1>
            </div>
            <p className="cp-hero-copy">
              Ambitious Full Stack Developer with strong expertise in building responsive, high-performance web applications using React.js and Next.js.
            </p>
            <div className="cp-accent-box" />
          </div>

          {/* RIGHT */}
          <div className="cp-right">
            <div>
              <div className="cp-sec-head">Contact</div>
              <div className="cp-contact-rows">
                {CONTACT_ROWS.map(({ label, value, href }, i) => (
                  <a key={label} href={href} className="cp-row" ref={el => rowRefs.current[i] = el}>
                    <span className="cp-row-label">{label}</span>
                    <span className="cp-row-val">{value}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="cp-sec-head">Social</div>
              <div className="cp-social">
                {SOCIALS.map(({ label, href }) => (
                  <a key={label} href={href} className="cp-pill">
                    <span>{label}</span>
                    <span className="cp-pill-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability and message form removed per request */}
          </div>
        </div>

        <footer className="cp-footer">
          <span>© 2025 Aditya Raj — All rights reserved</span>
          <span>Built with intention</span>
        </footer>
      </div>
    </>
  );
}
