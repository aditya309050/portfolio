/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import gsap from 'gsap';
import ContactPage from './ContactPage';
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
      if (countExpRef.current) countUp(countExpRef.current, 4, 1200);
      if (countLiveRef.current) countUp(countLiveRef.current, 2, 1200);
      if (countGhRef.current) countUp(countGhRef.current, 500, 1500);
      if (countContribRef.current) countUp(countContribRef.current, 5, 1200);
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
              <li className="nav-item"><a href="#projects" className="nav-link" onMouseEnter={() => handleNavHover('work', 'Selected projects & case studies', '2024–2026')} onClick={toggleNav}><div className="nav-link-inner"><span className="nav-num">01</span><span className="nav-text">My Projects</span><span className="nav-tag">4 live</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#skills" className="nav-link" onMouseEnter={() => handleNavHover('lab', 'React, Next.js, Node.js', 'Core')} onClick={toggleNav}><div className="nav-link-inner"><span className="nav-num">02</span><span className="nav-text">Skills</span><span className="nav-tag">Stack</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><a href="#about" className="nav-link" onMouseEnter={() => handleNavHover('journal', 'B.Tech CS Student', 'Ongoing')} onClick={toggleNav}><div className="nav-link-inner"><span className="nav-num">03</span><span className="nav-text">About</span><span className="nav-tag">Bio</span></div><div className="nav-link-line"></div></a></li>
              <li className="nav-item"><Link to="/contact" className="nav-link" onMouseEnter={() => handleNavHover('contact', "Let's build something together", 'Available')} onClick={toggleNav}><div className="nav-link-inner"><span className="nav-num">04</span><span className="nav-text">Contact</span><span className="nav-tag">Hire me</span></div><div className="nav-link-line"></div></Link></li>
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
          <div style={{fontSize: '11px', color: '#555', letterSpacing: '2px'}}>Aditya raj · Lab</div>
          <div style={{fontSize: '11px', color: '#555'}}>© 2026</div>
        </div>
      </div>

      {/* HEADER */}
      <header id="site-header">
        <a href="#" className="logo">Aditya raj</a>
        <div className="header-right">
          <a href="https://github.com/aditya309050" target="_blank" rel="noreferrer" className="page-tag" style={{ textDecoration: 'none' }}>GitHub</a>
          <button id="burger" aria-label="menu" className={isNavOpen ? 'active' : ''} onClick={toggleNav} ref={burgerRef}>
            <span className="bline"></span><span className="bline"></span><span className="bline"></span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="about">
        <div className="hero-left">
          <div className="hero-accent-box"></div>
          <div className="scramble-title" id="scramble-title" ref={scrambleTitleRef}>
            <span className="word"><span className="word-inner" data-text="Full">Full</span></span>
            <span className="word"><span className="word-inner" data-text="Stack">Stack</span></span>
            <span className="word"><span className="word-inner" data-text="Dev">Dev</span></span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-tag">
            <div className="tag-line"></div>
            <span>Aditya Raj — Portfolio</span>
          </div>
          <div className="hero-desc">
            <p>Ambitious Full Stack Developer with strong expertise in building responsive, high-performance web applications using React.js and Next.js.</p>
          </div>
          <div className="hero-stat-row" id="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-exp" ref={countExpRef}>0</div>
              <div className="hero-stat-label">Projects</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-live" ref={countLiveRef}>0</div>
              <div className="hero-stat-label">Client Sites</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-gh" ref={countGhRef}>0</div>
              <div className="hero-stat-label">Hours Learning</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num" id="count-contrib" ref={countContribRef}>0</div>
              <div className="hero-stat-label">Months Exp.</div>
            </div>
          </div>
        </div>

        {/* bottom info strip */}
        <div className="hero-bottom">
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--red)'}}></div>React / Next.js</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--blue)'}}></div>TypeScript / JS</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--green)'}}></div>Node.js / API</div>
          <div className="hb-cell"><div className="hb-dot" style={{background: 'var(--yellow)'}}></div>Tailwind / UI</div>
          <div className="hb-cell" style={{justifyContent: 'flex-end', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '1px', color: 'var(--muted)'}}>Based in Bihar, India</div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(16)].map((_, i) => (
            <div className="ticker-item" key={i}>
              <span className="ticker-star">★</span>
              {["FULL STACK", "REACT.JS", "NEXT.JS", "NODE.JS", "TYPESCRIPT", "TAILWIND CSS", "RESPONSIVE", "WEB DEV"][i % 8]}
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIMENTS GRID */}
      <section className="lab-section" id="projects">
        <div className="lab-header">
          <div className="lab-h-title" id="lh-title">Projects</div>
          <div className="lab-h-meta" id="lh-meta">2025 — 2026<br />Freelance & Personal</div>
        </div>

        <div className="grid-broken" id="exp-grid">
          {/* Row 1 */}
          <a href="https://travelers-omega.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-5 row-4 tile-ink" aria-label="Open Travelers project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 001</div>
              <div className="tile-name">Travelers</div>
              <div className="tile-meta">Travel Platform · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <a href="https://lakhilrajwelfarefoundation.com/" target="_blank" rel="noreferrer" className="exp-tile col-7 row-2 tile-yellow" aria-label="Open Lakhi Lraj Welfare project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 002</div>
              <div className="tile-name">Lakhi Lraj Welfare</div>
              <div className="tile-meta">NGO · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <a href="https://global-trend-nine.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-4 row-2" aria-label="Open Global Trend project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 003</div>
              <div className="tile-name">Global Trend</div>
              <div className="tile-meta">Project Management System </div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <div className="exp-tile col-3 row-2 tile-red">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 004</div>
              <div className="tile-name">Travelers</div>
              <div className="tile-meta">Travel Platform</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">React & Strapi</div></div>
          </div>

          {/* Row 2 */}
          <a href="https://digital-hero-theta.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-4 row-3 tile-blue" aria-label="Open Kurage Agency project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num"> PRJ — 005</div>
              <div className="tile-name">Digital hero</div>
              <div className="tile-meta">Frontend Dev · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <a href="https://mall-red.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-8 row-3 tile-type-only" aria-label="Open Mall experiment project">
            <div className="tile-inner">
              <div className="tile-num" style={{textAlign: 'center', marginBottom: '12px'}}>PRJ — 006</div>
              <div className="tile-name" style={{color: 'var(--ink)'}}>Mall</div>
              <div className="tile-meta" style={{textAlign: 'center', marginTop: '8px'}}>Experiment Project · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          {/* Row 3 */}
          <a href="https://netflix-gtp-two.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-3 row-2" aria-label="Open Netflix clone project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 007</div>
              <div className="tile-name">Netflix clone</div>
              <div className="tile-meta">Clone · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <a href="https://small-screen1.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-6 row-2 tile-green" aria-label="Open smallscale marketing project">
            <div className="tile-status status-live"></div>
            <div className="tile-inner">
              <div className="tile-num">PRJ — 008</div>
              <div className="tile-name">smallscale<br />marketing</div>
              <div className="tile-meta">Live Project · Marketing / Small Screen</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>

          <a href="https://coaching-demo-rouge.vercel.app/" target="_blank" rel="noreferrer" className="exp-tile col-3 row-2 tile-yellow" aria-label="Open coaching institute freelance project">
            <div className="tile-inner">
              <div className="tile-num">PRJ — 009</div>
              <div className="tile-name">coaching<br />institute</div>
              <div className="tile-meta">Freelance Project · Live</div>
            </div>
            <div className="tile-hover"><div className="tile-hover-arrow">↗</div><div className="tile-hover-text">Open Project</div></div>
          </a>
        </div>
      </section>

      {/* LIST */}
      <section className="list-section" id="experience">
        <div id="skills"></div>
        <div className="list-header">
          <span className="list-h"> Skills</span>
          <span className="list-h">Details</span>
        </div>

        <div id="exp-list">
          
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--muted)'}}></span>MongoDB</span><span className="eli-cat">Database</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>PostgreSQL</span><span className="eli-cat">Database</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Firebase</span><span className="eli-cat">Backend / Auth</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--blue)'}}></span>React.js</span><span className="eli-cat">Frontend</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>Next.js</span><span className="eli-cat">Framework</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--muted)'}}></span>TypeScript</span><span className="eli-cat">Language</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>JavaScript (ES6+)</span><span className="eli-cat">Language</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Tailwind CSS</span><span className="eli-cat">Styling / UI</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>npm / pnpm</span><span className="eli-cat">Package Managers</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--muted)'}}></span>Vercel</span><span className="eli-cat">Deployment</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>Firebase Hosting</span><span className="eli-cat">Hosting</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Node.js</span><span className="eli-cat">Runtime</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--blue)'}}></span>Express.js</span><span className="eli-cat">Backend Framework</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>REST APIs</span><span className="eli-cat">API Design</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--ink)'}}></span>Redux / Zustand</span><span className="eli-cat">State Management</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--muted)'}}></span>Framer Motion</span><span className="eli-cat">Animation</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--green)'}}></span>GSAP</span><span className="eli-cat">Animation</span><span className="eli-year">Proficient</span><span className="eli-arrow">↗</span></div>
          <div className="exp-list-item"><span className="eli-num">SKL</span><span className="eli-name"><span className="eli-chip" style={{background: 'var(--yellow)'}}></span>Responsive Design</span><span className="eli-cat">UX / Layout</span><span className="eli-year">Expert</span><span className="eli-arrow">↗</span></div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="lab-footer" id="contact">
        <div className="lf-bg-text">HIRE</div>
        <div className="lf-content">
          <div className="lf-title">Let's build<br />together</div>
          <div className="lf-sub">Available for freelance opportunities and full-time roles. Let's discuss your next project.</div>
          <div className="lf-btns">
            <Link to="/contact" className="btn-ink">Contact Me →</Link>
            <a href="https://github.com/aditya309050" target="_blank" rel="noreferrer" className="btn-outline">View GitHub ↗</a>
          </div>
        </div>
        <div className="lf-stat-col">
          <div className="lf-big-num">100%</div>
          <div className="lf-label">Client Satisfaction</div>
        </div>
      </footer>
    </>
  );
}

function AppWithRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppWithRoutes;
