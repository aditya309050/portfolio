/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './index.css';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function App() {
  const canvasRef = useRef(null);
  const curRef = useRef(null);
  const curRingRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const scrambleTitleRef = useRef(null);
  const navContentRef = useRef(null);
  const navBottomRef = useRef(null);
  const navOverlayRef = useRef(null);
  const burgerRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Stats refs
  const countExpRef = useRef(null);
  const countLiveRef = useRef(null);
  const countGhRef = useRef(null);
  const countContribRef = useRef(null);

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    let animationFrameId;

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random()
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,10,10,${p.a * 0.4})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(10,10,10,${(1 - dist / 120) * 0.08})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Cursor logic
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(curRef.current, { x: mx, y: my });
    };
    
    document.addEventListener('mousemove', onMouseMove);

    function animRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      gsap.set(curRingRef.current, { x: rx, y: ry });
      animationFrameId = requestAnimationFrame(animRing);
    }
    animRing();

    // Hover logic
    const hoverElements = document.querySelectorAll('a,button,.exp-tile,.exp-list-item');
    const addHover = () => document.body.classList.add('c-hover');
    const removeHover = () => document.body.classList.remove('c-hover');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  // Scroll Progress and Reveal
  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.height = pct + '%';
      }

      // Reveal logic
      document.querySelectorAll('.exp-tile:not(.revealed)').forEach(tile => {
        const r = tile.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.88) {
          tile.classList.add('revealed');
          gsap.fromTo(tile,
            { clipPath: 'inset(100% 0 0 0)' },
            { clipPath: 'inset(0% 0 0% 0)', duration: 0.9, ease: 'power4.out', delay: Math.random() * 0.2 }
          );
        }
      });
      document.querySelectorAll('.exp-list-item:not(.revealed)').forEach((item, i) => {
        const r = item.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) {
          item.classList.add('revealed');
          gsap.from(item, { x: -20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: i * 0.03 });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Count up util
  const countUp = (el, target, duration = 1200) => {
    const start = performance.now();
    function step(ts) {
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      if (el) el.textContent = Math.floor(ease * target) + (prog < 1 ? '' : '');
      if (prog < 1) requestAnimationFrame(step);
      else if (el) el.textContent = target;
    }
    requestAnimationFrame(step);
  };

  // Intro Timeline
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    // header
    tl.from('#site-header', { y: -24, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0);

    // hero title words clip up
    tl.to('.word-inner', {
      translateY: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.08
    }, 0.3);

    // trigger scramble on title after reveal
    tl.add(() => {
      let flashes = 0;
      const iv = setInterval(() => {
        if (flashes++ > 8) { clearInterval(iv); return; }
        document.querySelectorAll('.word-inner').forEach(w => {
          const orig = w.getAttribute('data-text');
          if (!orig) return;
          const rand = Array.from(orig).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
          w.textContent = rand;
          setTimeout(() => { w.textContent = orig; }, 80);
        });
      }, 60);
    }, 0.9);

    // hero tag
    tl.to('.hero-tag span', { translateY: '0%', duration: 0.7, ease: 'power3.out' }, 0.6);

    // desc
    tl.to('.hero-desc p', { translateY: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.8);

    // stats box
    tl.to('#hero-stats', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.0);

    // count up stats
    tl.add(() => {
      if (countExpRef.current) countUp(countExpRef.current, 24, 1200);
      if (countLiveRef.current) countUp(countLiveRef.current, 9, 1200);
      if (countGhRef.current) countUp(countGhRef.current, 3847, 1500);
      if (countContribRef.current) countUp(countContribRef.current, 61, 1200);
    }, 1.0);

    // bottom strip cells
    tl.to('.hb-cell', { translateY: '0%', duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 0.9);

    // lab header
    tl.to('#lh-title, #lh-meta', { translateY: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }, 1.0);

    // trigger scroll reveal
    tl.add(() => window.dispatchEvent(new Event('scroll')), 1.3);
  }, []);

  // Nav actions
  const toggleNav = () => {
    if (!isNavOpen) {
      setIsNavOpen(true);
      document.body.classList.add('nav-open');
      if (navOverlayRef.current) navOverlayRef.current.style.pointerEvents = 'auto';
      if (navContentRef.current) navContentRef.current.style.pointerEvents = 'auto';
      
      const panels = document.querySelectorAll('.nav-panel');
      const navInners = document.querySelectorAll('.nav-link-inner');
      
      gsap.to(panels[0], { translateY: '0%', duration: 0.9, ease: 'power4.inOut' });
      gsap.to(panels[1], { translateY: '0%', duration: 0.9, ease: 'power4.inOut' });
      gsap.to(navContentRef.current, { opacity: 1, duration: 0.1, delay: 0.3 });
      gsap.to(navInners, { translateY: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.07, delay: 0.45 });
      gsap.to(navBottomRef.current, { translateY: '0%', duration: 0.7, ease: 'power4.out', delay: 0.6 });
    } else {
      setIsNavOpen(false);
      document.body.classList.remove('nav-open');
      
      const panels = document.querySelectorAll('.nav-panel');
      const navInners = document.querySelectorAll('.nav-link-inner');
      
      gsap.to(navInners, { translateY: '110%', duration: 0.5, ease: 'power4.in', stagger: { each: 0.04, from: 'end' } });
      gsap.to(navBottomRef.current, { translateY: '110%', duration: 0.4, ease: 'power4.in' });
      gsap.to(navContentRef.current, { opacity: 0, duration: 0.1, delay: 0.3 });
      gsap.to(panels[0], { translateY: '-100%', duration: 0.8, ease: 'power4.inOut', delay: 0.25 });
      gsap.to(panels[1], { 
        translateY: '100%', duration: 0.8, ease: 'power4.inOut', delay: 0.25, onComplete: () => {
          if (navOverlayRef.current) navOverlayRef.current.style.pointerEvents = 'none';
          if (navContentRef.current) navContentRef.current.style.pointerEvents = 'none';
          document.querySelectorAll('.nav-preview-img').forEach(el => el.classList.remove('active'));
          const desc = document.getElementById('meta-desc');
          const year = document.getElementById('meta-year');
          if (desc) desc.textContent = 'Hover a link to preview';
          if (year) year.textContent = '—';
        }
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isNavOpen) toggleNav();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen]);

  const handleNavHover = (imgKey, desc, year) => {
    document.querySelectorAll('.nav-preview-img').forEach(e => e.classList.remove('active'));
    const t = document.getElementById('img-' + imgKey);
    if (t) t.classList.add('active');
    
    const descEl = document.getElementById('meta-desc');
    const yearEl = document.getElementById('meta-year');
    if (descEl) descEl.textContent = desc || '—';
    if (yearEl) yearEl.textContent = year || '—';
  };

  return (
    <>
      {/* Scroll progress */}
      <div id="scroll-progress" ref={scrollProgressRef}></div>

      {/* Canvas particle bg */}
      <canvas id="canvas" ref={canvasRef}></canvas>

      {/* Cursors */}
      <div id="cur" ref={curRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>

      {/* NAV OVERLAY */}
      <div id="nav-overlay" aria-hidden="true" ref={navOverlayRef}>
        <div className="nav-panel top"></div>
        <div className="nav-panel bot"></div>
        <div id="nav-content" ref={navContentRef}>
          <nav className="nav-left">
            <div className="nav-counter">Menu</div>
            <ul className="nav-links-list">
              <li className="nav-item"><a href="#" className="nav-link" onMouseEnter={() => handleNavHover('work', 'Selected projects & case studies', '2024–2026')}><div className="nav-link-inner"><span className="nav-num">01</span><span className="nav-text">Work</span><span className="nav-tag">12 projects</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#" className="nav-link" onMouseEnter={() => handleNavHover('about', 'Who we are & our mission', 'Est. 2022')}><div className="nav-link-inner"><span className="nav-num">02</span><span className="nav-text">About</span><span className="nav-tag">Our story</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#" className="nav-link" onMouseEnter={() => handleNavHover('lab', 'Experiments & open source', 'Ongoing')}><div className="nav-link-inner"><span className="nav-num">03</span><span className="nav-text">Lab</span><span className="nav-tag">Experimental</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#" className="nav-link" onMouseEnter={() => handleNavHover('journal', 'Thoughts on design & code', 'Weekly')}><div className="nav-link-inner"><span className="nav-num">04</span><span className="nav-text">Journal</span><span className="nav-tag">Blog</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#" className="nav-link" onMouseEnter={() => handleNavHover('contact', "Let's build something together", 'Open')}><div className="nav-link-inner"><span className="nav-num">05</span><span className="nav-text">Contact</span><span className="nav-tag">Hire us</span></div><div className="nav-link-line"></div></a></li>
            </ul>
          </nav>
          <aside className="nav-right-panel">
            <div className="nav-preview">
              <div className="nav-preview-img img-work" id="img-work"></div>
              <div className="nav-preview-img img-about" id="img-about"></div>
              <div className="nav-preview-img img-lab" id="img-lab"></div>
              <div className="nav-preview-img img-journal" id="img-journal"></div>
              <div className="nav-preview-img img-contact" id="img-contact"></div>
            </div>
            <div className="nav-meta">
              <div className="nav-meta-label">Description</div>
              <div className="nav-meta-val" id="meta-desc">Hover a link to preview</div>
              <div style={{marginTop: '20px'}}><div className="nav-meta-label">Year</div><div className="nav-meta-val" id="meta-year">—</div></div>
            </div>
          </aside>
        </div>
        <div className="nav-bottom" id="nav-bottom" ref={navBottomRef}>
          <div style={{display: 'flex', gap: '32px'}}><a href="#" className="nav-bottom-link">Twitter</a><a href="#" className="nav-bottom-link">GitHub</a><a href="#" className="nav-bottom-link">Discord</a></div>
          <div style={{fontSize: '11px', color: '#555', letterSpacing: '2px'}}>EverSwap · Lab</div>
          <div style={{fontSize: '11px', color: '#555'}}>© 2026</div>
        </div>
      </div>

      {/* HEADER */}
      <header id="site-header">
        <a href="#" className="logo">EVERSWAP</a>
        <div className="header-right">
          <span className="page-tag">Lab</span>
          <button id="burger" aria-label="menu" className={isNavOpen ? 'active' : ''} onClick={toggleNav} ref={burgerRef}>
            <span className="bline"></span><span className="bline"></span><span className="bline"></span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-accent-box"></div>
          <div className="scramble-title" id="scramble-title" ref={scrambleTitleRef}>
            <span className="word"><span className="word-inner" data-text="Exp">Exp</span></span>
            <span className="word"><span className="word-inner" data-text="erim">erim</span></span>
            <span className="word"><span className="word-inner" data-text="ents">ents</span></span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-tag">
            <div className="tag-line"></div>
            <span>Research &amp; Development</span>
          </div>
          <div className="hero-desc">
            <p>Where we break things on purpose. Prototypes, open-source tools, and half-finished ideas that occasionally become real products.</p>
          </div>
          <div className="hero-stat-row" id="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-exp" ref={countExpRef}>0</div>
              <div className="hero-stat-label">Experiments</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-live" ref={countLiveRef}>0</div>
              <div className="hero-stat-label">Live now</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-gh" ref={countGhRef}>0</div>
              <div className="hero-stat-label">GitHub stars</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-contrib" ref={countContribRef}>0</div>
              <div className="hero-stat-label">Contributors</div>
            </div>
          </div>
        </div>

        {/* bottom info strip */}
        <div className="hero-bottom">
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--red)'}}></div>Solidity / EVM</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--blue)'}}></div>TypeScript</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--green)'}}></div>WebGL / Three.js</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--yellow)'}}></div>Rust / WASM</div>
          <div className="hb-cell" style={{justifyContent: 'flex-end', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '1px', color: 'var(--muted)'}}>Last updated: today</div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(16)].map((_, i) => (
            <div className="ticker-item" key={i}>
              <span className="ticker-star">★</span>
              {["OPEN SOURCE", "ON-CHAIN", "WEB3 NATIVE", "EXPERIMENTAL", "PROOF OF CONCEPT", "RESEARCH", "CREATIVE CODE", "INTEROPERABILITY"][i % 8]}
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIMENTS GRID */}
      <section className="lab-section">
        <div className="lab-header">
          <div className="lab-h-title" id="lh-title">Selected Experiments</div>
          <div className="lab-h-meta" id="lh-meta">2022 — 2026<br />Ongoing research</div>
        </div>

        <div className="grid-broken" id="exp-grid">
          {/* Row 1 */}
          <div className="exp-tile col-5 row-4 tile-ink">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 001</div>
              <div className="tile-name">Mempool<br />Viz</div>
              <div className="tile-meta">WebGL · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-7 row-2 tile-yellow">
            <div className="tile-status status-wip"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 002</div>
              <div className="tile-name">Gas Oracle</div>
              <div className="tile-meta">Solidity · WIP</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-4 row-2">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 003</div>
              <div className="tile-name">TWAP Hook</div>
              <div className="tile-meta">Uniswap v4</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-3 row-2 tile-red">
            <div className="tile-inner">
              <div className="tile-num">EXP — 004</div>
              <div className="tile-name">Intent Router</div>
              <div className="tile-meta">ERC-4337</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          {/* Row 2 */}
          <div className="exp-tile col-4 row-3 tile-blue">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 005</div>
              <div className="tile-name">Zk<br />Prover</div>
              <div className="tile-meta">Circom · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-8 row-3 tile-type-only">
            <div className="tile-inner">
              <div className="tile-num" style={{textAlign: 'center', marginBottom: '12px'}}>EXP — 006</div>
              <div className="tile-name" style={{color: 'var(--ink)'}}>Liquidity<br />Topology</div>
              <div className="tile-meta" style={{textAlign: 'center', marginTop: '8px'}}>Graph Theory · Research</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          {/* Row 3 */}
          <div className="exp-tile col-3 row-2">
            <div className="tile-status status-archived"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 007</div>
              <div className="tile-name">MEV Shield</div>
              <div className="tile-meta">Archived</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-6 row-2 tile-green">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">EXP — 008</div>
              <div className="tile-name">Chain<br />Indexer</div>
              <div className="tile-meta">Rust · 1.2M blocks/s</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>

          <div className="exp-tile col-3 row-2 tile-yellow">
            <div className="tile-inner">
              <div className="tile-num">EXP — 009</div>
              <div className="tile-name">Slippage<br />ML</div>
              <div className="tile-meta">Python · WIP</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open experiment</div></div>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="list-section">
        <div className="list-header">
          <span className="list-h">All experiments</span>
          <span className="list-h">12 total</span>
        </div>

        <div id="exp-list">
          <div className="exp-list-item"><span className="eli-num">001</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--red)'}}></span>Mempool Visualizer</span><span className="eli-cat">WebGL / Three.js</span><span className="eli-year">2026</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">002</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Gas Oracle v2</span><span className="eli-cat">Solidity / EVM</span><span className="eli-year">2026</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">003</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--blue)'}}></span>TWAP Hook</span><span className="eli-cat">Uniswap v4 / Hooks</span><span className="eli-year">2025</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">004</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>Intent Router</span><span className="eli-cat">ERC-4337 / AA</span><span className="eli-year">2025</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">005</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--blue)'}}></span>ZK Prover Lib</span><span className="eli-cat">Circom / Rust</span><span className="eli-year">2025</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">006</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>Liquidity Topology</span><span className="eli-cat">Graph Theory / Research</span><span className="eli-year">2024</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">007</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--muted)'}}></span>MEV Shield (archived)</span><span className="eli-cat">Flashbots / Go</span><span className="eli-year">2024</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">008</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>Chain Indexer</span><span className="eli-cat">Rust / WASM</span><span className="eli-year">2024</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">009</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Slippage ML</span><span className="eli-cat">Python / TensorFlow</span><span className="eli-year">2023</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">010</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--red)'}}></span>Yield Optimizer</span><span className="eli-cat">Solidity / Hardhat</span><span className="eli-year">2023</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">011</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--blue)'}}></span>Cross-chain Relay</span><span className="eli-cat">LayerZero / TypeScript</span><span className="eli-year">2023</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">012</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>On-chain SVG Gen</span><span className="eli-cat">Solidity / SVG</span><span className="eli-year">2022</span><span className="eli-arrow">↗</span></div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="lab-footer">
        <div className="lf-bg-text">LAB</div>
        <div className="lf-content">
          <div className="lf-title">Got a wild<br />idea?</div>
          <div className="lf-sub">We prototype fast. Drop us a brief and we'll have something to show you in 72 hours.</div>
          <div className="lf-btns">
            <a href="#" className="btn-ink">Start a project →</a>
            <a href="#" className="btn-outline">View GitHub ↗</a>
          </div>
        </div>
        <div className="lf-stat-col">
          <div className="lf-big-num">72h</div>
          <div className="lf-label">Prototype turnaround</div>
        </div>
      </footer>
    </>
  );
}

export default App;
