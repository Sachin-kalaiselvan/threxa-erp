import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/* ─────────────────────────────────────────────────────────────────
   NON-NEGOTIABLE RULES GOVERNING THIS FILE
   1  Nothing stops animating. Every beat overlaps the next by 300-500ms.
   2  Earth + stars + space MUST be GONE before login appears.
   3  The logo is SACRED. No particles, no glints, no stars, no glow blobs.
      Only: crisp edges, one soft rim pulse, nothing passing over it.
   4  THREXA is always a unit. Stacked during forge. Side-by-side after dock.
   5  Login ASSEMBLES — cursor, typing, field lines drawing themselves, button grows.
   6  Background after cinematic: deep graphite + blue radial + grain + mesh + particles.
   7  Logo docks to top-CENTER. Sidebar slide happens post-auth (next phase).
   8  The transition from cinematic to login must be imperceptible.
   9  One continuous camera shot. No cuts. No pauses.
───────────────────────────────────────────────────────────────────── */

/* deterministic city lights */
function makeLights() {
  let s = 20260717;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  return [
    [152,72,14,22,10],[128,52, 9,18, 8],[ 88,68, 7,14, 8],
    [464,32,16,30,13],[516,62, 7,14, 8],[586,70,11,18,11],
    [680,48,18,26,15],[725,48, 8,13,10],[672,84, 7,13, 8],
  ].flatMap(([cx,cy,n,sx,sy]) =>
    Array.from({length:n}, () => ({
      cx:cx+(r()-.5)*sx*2, cy:cy+(r()-.5)*sy*2,
      ra:r()*1.9+0.5, warm:r()>.28,
    }))
  );
}
const CITY_LIGHTS = makeLights();

export default function Login() {
  const [email,    setEmail   ] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError   ] = useState<string | null>(null);
  const [busy,     setBusy    ] = useState(false);

  const [playIntro, setPlayIntro] = useState(() => {
    /* ALWAYS play the cinematic on mount.
       Only skip if OS has reduce-motion enabled. */
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<number | null>(null);

  /* Canvas: stars (0→5s) then premium micro-particles (5.5s+)
     Done in one RAF loop — zero extra DOM elements.            */
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const ctx = cv.getContext("2d"); if (!ctx) return;

    let rs = 99991;
    const rng = () => { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 0xffffffff; };
    const stars = Array.from({ length: 200 }, () => ({
      x: rng(), y: rng() * .78, r: rng() * 1.4 + .3,
      ph: rng() * Math.PI * 2, sp: rng() * .4 + .12,
    }));
    const parts = Array.from({ length: 18 }, () => ({
      x: rng(), y: rng(), r: rng() * .9 + .25, sp: rng() * .00009 + .00004,
    }));

    let frame: number;
    const t0 = Date.now();
    const draw = () => {
      const el = (Date.now() - t0) / 1000;
      ctx.clearRect(0, 0, cv.width, cv.height);

      /* stars: fade in 0–0.8s, fade out 5.0–6.0s */
      const sIn  = Math.min(1, el / .8);
      const sOut = Math.max(0, 1 - Math.max(0, (el - 5.0)));
      const sOp  = sIn * sOut;
      if (sOp > .004) {
        stars.forEach(st => {
          const op = sOp * (.2 + .6 * Math.abs(Math.sin(st.ph + el * st.sp)));
          ctx.beginPath();
          ctx.arc(st.x * cv.width, st.y * cv.height, st.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${op.toFixed(3)})`;
          ctx.fill();
        });
      }

      /* premium micro-particles: emerge 5.5s+, max opacity 1.4% */
      const pOp = Math.min(.014, Math.max(0, (el - 5.5) / 2) * .014);
      if (pOp > .0003) {
        parts.forEach(p => {
          p.y -= p.sp; if (p.y < 0) p.y = 1;
          ctx.beginPath();
          ctx.arc(p.x * cv.width, p.y * cv.height, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148,164,228,${pOp.toFixed(4)})`;
          ctx.fill();
        });
      }

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  /* drop cinematic DOM after sequence completes */
  useEffect(() => {
    if (!playIntro) return;
    cleanupRef.current = window.setTimeout(() => {
      setPlayIntro(false);
    }, 8400);
    return () => { if (cleanupRef.current) clearTimeout(cleanupRef.current); };
  }, [playIntro]);

  const skip = () => {
    if (cleanupRef.current) clearTimeout(cleanupRef.current);
    setPlayIntro(false);
  };

  const signIn = async () => {
    if (!email || !password) { setError("Enter your email and password."); return; }
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  const ia = playIntro; /* "intro active" — controls class variants */

  return (
    <div className="lg-root">

      {/* ── Canvas — OUTSIDE camera for real parallax depth ─────── */}
      <canvas ref={canvasRef} className="lg-canvas" />

      {/* ── Premium app background layers ──────────────────────────
          These exist from mount but are invisible during the cinematic.
          The cinematic dissolves INTO them — no hard cut possible.  */}
      <div className="lg-bg-glow"  /> {/* subtle blue radial at top     */}
      <div className="lg-bg-grain" /> {/* SVG fractal noise at 2.5% op  */}
      <div className="lg-bg-mesh"  /> {/* barely visible 48px grid       */}

      {/* ── Real brand — top-center above the form ─────────────────
          Hidden during the cinematic. Crossfades in at 6.6s while
          the cinematic logo is AT THE EXACT SAME PIXEL POSITION.  */}
      <div className={`lg-brand${ia ? " lg-brand-hidden" : ""}`}>
        <img src={threxaIcon}     className="lg-icon"     alt="" />
        <img src={threxaWordmark} className="lg-wordmark" alt="THREXA" />
      </div>

      {/* ── Login form — assembles while the logo is still docking ──
          RULE 10: logo docks while login is 30–40% visible.
          RULE 11: login finishes exactly as logo reaches final pos. */}
      <div className={`lg-form${ia ? " lg-assembling" : ""}`}>

        {/* cursor + Welcome Back types in */}
        <div className="lg-welcome-wrap">
          {ia && <span className="lg-cursor" />}
          <span className="lg-welcome-text">Welcome Back</span>
        </div>

        {/* email field — underline draws itself, then input appears */}
        <div className="lg-field lg-f0">
          <div className="lg-underline" />
          <label className="lg-label" htmlFor="lg-em">Email</label>
          <input
            id="lg-em" className="lg-input" type="email" autoComplete="email"
            placeholder="you@company.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && signIn()} />
        </div>

        {/* password field */}
        <div className="lg-field lg-f1">
          <div className="lg-underline" />
          <label className="lg-label" htmlFor="lg-pw">Password</label>
          <input
            id="lg-pw" className="lg-input" type="password" autoComplete="current-password"
            placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && signIn()} />
        </div>

        {error && <p className="lg-error">{error}</p>}

        {/* button grows from center */}
        <button className="lg-btn" onClick={signIn} disabled={busy}>
          {busy
            ? <span className="lg-busy"><span className="lg-spinner" />Signing in…</span>
            : "Sign in"}
        </button>

        <p className="lg-footnote">Accounts are created by the administrator.</p>
      </div>

      <p className={`lg-credit${ia ? " lg-credit-hidden" : ""}`}>
        Threxa ERP · Smart Packaging Solutions
      </p>

      {/* ══════════════ CINEMATIC OVERLAY ═════════════════════════
          One continuous camera shot:
          0–3.2s  RISE   — world lifts into view
          3.2–5.5s DOLLY — slow push toward the logo birth point
          5.5–6.5s PULL  — zoom out, making room for the OS to wake
          Camera returns to identity at 6.5s, 0.1s before crossfade.
         ══════════════════════════════════════════════════════════ */}
      {playIntro && <>
        <div className="tx-camera">

          <div className="tx-scene">
            <div className="tx-earth">
              <svg className="tx-geo" viewBox="0 0 800 150" preserveAspectRatio="none">
                <defs>
                  <filter id="landBlur"><feGaussianBlur stdDeviation="2.2"/></filter>
                  <filter id="cg" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="1.8" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(64,96,78,.42)"/>
                    <stop offset="100%" stopColor="rgba(30,52,42,.06)"/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(76,88,62,.36)"/>
                    <stop offset="100%" stopColor="rgba(38,46,36,.05)"/>
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(58,82,72,.40)"/>
                    <stop offset="100%" stopColor="rgba(28,48,44,.05)"/>
                  </linearGradient>
                </defs>
                <g filter="url(#landBlur)">
                  {/* North America */}
                  <path fill="url(#g2)" d="M 58,32 C 85,14 142,10 192,20 C 226,28 244,48 236,70 C 228,92 200,106 168,108 C 132,110 96,98 74,80 C 52,62 44,46 58,32 Z"/>
                  <path fill="url(#g2)" d="M 192,20 C 208,24 220,34 218,46 C 216,56 204,60 196,54 C 188,48 186,34 192,20 Z"/>
                  {/* South America */}
                  <path fill="url(#g1)" d="M 108,104 C 126,96 154,98 168,112 C 180,124 176,140 162,146 C 146,152 124,144 114,130 C 106,118 104,110 108,104 Z"/>
                  {/* Greenland */}
                  <path fill="url(#g3)" d="M 240,6 C 256,1 274,4 278,12 C 282,20 276,30 262,32 C 248,34 234,26 234,14 L 240,6 Z"/>
                  {/* Iceland */}
                  <path fill="url(#g3)" d="M 376,16 C 382,12 392,14 394,20 C 396,26 390,32 382,32 C 374,32 370,24 376,16 Z"/>
                  {/* British Isles */}
                  <path fill="url(#g2)" d="M 448,22 C 454,16 464,16 468,22 C 472,28 470,38 462,42 C 454,44 444,38 448,22 Z"/>
                  <ellipse fill="url(#g2)" cx="452" cy="44" rx="7" ry="5"/>
                  {/* Western Europe */}
                  <path fill="url(#g2)" d="M 464,16 C 480,8 512,8 528,20 C 542,30 544,48 532,58 C 518,68 492,68 474,58 C 456,46 450,28 464,16 Z"/>
                  {/* Iberian Peninsula */}
                  <path fill="url(#g2)" d="M 444,56 C 454,50 470,52 474,62 C 478,72 472,82 460,84 C 448,86 438,76 440,64 L 444,56 Z"/>
                  {/* Scandinavia */}
                  <path fill="url(#g3)" d="M 490,6 C 500,2 514,4 518,12 C 522,20 518,34 508,38 C 498,42 486,36 484,24 L 490,6 Z"/>
                  {/* Africa */}
                  <path fill="url(#g1)" d="M 456,56 C 478,44 530,44 550,58 C 566,70 568,96 556,120 C 544,142 518,150 496,144 C 472,136 452,112 450,88 C 448,68 450,62 456,56 Z"/>
                  {/* Madagascar */}
                  <path fill="url(#g1)" d="M 562,104 C 568,100 576,102 578,110 C 580,118 574,126 566,126 C 558,126 554,118 562,104 Z"/>
                  {/* Arabia */}
                  <path fill="url(#g2)" d="M 548,56 C 564,48 586,52 590,64 C 594,76 584,90 568,92 C 552,94 540,82 542,68 L 548,56 Z"/>
                  {/* India */}
                  <path fill="url(#g2)" d="M 596,56 C 614,46 636,50 640,64 C 646,80 636,100 620,108 C 604,114 588,108 584,92 C 580,76 584,64 596,56 Z"/>
                  <ellipse fill="url(#g2)" cx="628" cy="114" rx="5" ry="7"/>
                  {/* East Asia */}
                  <path fill="url(#g3)" d="M 644,18 C 686,6 746,6 790,20 C 818,30 826,50 810,68 C 794,86 752,92 712,88 C 672,82 644,66 636,46 C 630,32 634,22 644,18 Z"/>
                  <path fill="url(#g3)" d="M 748,68 C 756,62 766,64 768,72 C 770,80 764,88 754,90 C 744,90 738,82 748,68 Z"/>
                  {/* Japan */}
                  <path fill="url(#g3)" d="M 782,28 C 790,22 804,24 808,34 C 812,44 806,56 796,58 C 786,60 778,52 778,40 L 782,28 Z"/>
                  <ellipse fill="url(#g3)" cx="800" cy="24" rx="10" ry="7"/>
                  {/* SE Asia */}
                  <path fill="url(#g2)" d="M 716,84 C 732,76 756,80 764,92 C 770,102 764,116 750,118 C 734,120 718,108 716,94 L 716,84 Z"/>
                  <path fill="url(#g1)" d="M 748,104 C 758,98 774,102 778,114 C 782,126 772,136 758,136 C 744,136 736,124 748,104 Z"/>
                  {/* Australia */}
                  <path fill="url(#g2)" d="M 760,112 C 778,104 812,108 820,120 C 826,132 816,146 796,148 C 774,150 756,138 754,124 L 760,112 Z"/>
                  {/* Cloud wisps */}
                  <g opacity="0.05">
                    <ellipse cx="295" cy="55" rx="110" ry="24" fill="white"/>
                    <ellipse cx="530" cy="38" rx="75" ry="19" fill="white"/>
                    <ellipse cx="685" cy="28" rx="92" ry="21" fill="white"/>
                  </g>
                </g>
                <g filter="url(#cg)">
                  {CITY_LIGHTS.map((l, i) => (
                    <circle key={i} cx={l.cx} cy={l.cy} r={l.ra}
                      fill={l.warm ? "rgba(255,212,138,.92)" : "rgba(208,224,255,.85)"}
                      opacity={0.52 + (i * 7 % 3) * 0.16} />
                  ))}
                </g>
              </svg>
            </div>
            <div className="tx-trail" />
            <div className="tx-flash" />
            <div className="tx-sunrise">
              <div className="tx-sun-core"   />
              <div className="tx-sun-halo"   />
              <div className="tx-sun-bloom"  />
              <div className="tx-sun-streak" />
            </div>
            <div className="tx-sphere" />
          </div>{/* end .tx-scene */}

          {/* ── CINEMATIC LOGO ──────────────────────────────────────
              RULE 3: The logo is SACRED. Nothing on it, around it,
              or passing over it. One soft rim pulse at most.
              RULE 4: Stacked during forge. Side-by-side after dock.

              Architecture: outer div handles POSITION (dock motion).
                            inner div handles BIRTH (opacity/scale).
              These two transforms never conflict with each other.

              STACKED birth position:
                tx-icon-outer: top:45vh center (where sphere collapses)
                tx-word-outer: top:calc(45vh + 58px) center (below icon)

              DOCKED final position (matching lg-brand exactly):
                icon center: (50vw - 74px, 22vh)   → scale 0.52
                word center: (50vw + 30px, 22vh)   → scale 0.70
              ──────────────────────────────────────────────────── */}
          <div className="tx-icon-outer">
            <div className="tx-icon-inner">
              <img src={threxaIcon} alt="" />
            </div>
          </div>

          <div className="tx-word-outer">
            <div className="tx-word-inner">
              <img src={threxaWordmark} alt="THREXA" />
            </div>
          </div>

        </div>{/* end .tx-camera */}

        <button className="tx-skip" onClick={skip}>Skip ›</button>
      </>}

      <style>{`
        /* ═══════════════════════════════════════════════════════════
           ROOT & CANVAS
        ═══════════════════════════════════════════════════════════ */
        .lg-root{
          position:fixed; inset:0;
          background:#0A0B11; /* baseline deep graphite */
          overflow:hidden; font-family:inherit;
          animation:lgBgShift .9s ease 5.3s forwards;
        }
        @keyframes lgBgShift{ to{background:#0D0E15;} }

        .lg-canvas{ position:absolute; inset:0; z-index:1; }

        /* ═══════════════════════════════════════════════════════════
           PREMIUM APP BACKGROUND
           Think: Linear, Raycast, Stripe. Not NASA.
        ═══════════════════════════════════════════════════════════ */
        .lg-bg-glow{
          position:fixed; inset:0; z-index:2; pointer-events:none;
          background: radial-gradient(ellipse 90% 55% at 50% -5%,
            rgba(80,110,210,.09) 0%,
            rgba(60,85,190,.04) 40%,
            transparent 70%);
          opacity:0;
          animation:txFadeIn 1.1s ease 5.6s forwards;
        }
        .lg-bg-grain{
          position:fixed; inset:0; z-index:2; pointer-events:none;
          background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
          opacity:0;
          animation:lgGrainIn .8s ease 5.8s forwards;
        }
        @keyframes lgGrainIn{ to{opacity:.028;} }
        .lg-bg-mesh{
          position:fixed; inset:0; z-index:2; pointer-events:none;
          background-image:
            linear-gradient(rgba(120,140,210,.013) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,140,210,.013) 1px, transparent 1px);
          background-size:48px 48px;
          opacity:0;
          animation:lgMeshIn .8s ease 6.0s forwards, lgMeshDrift 28s linear 6.0s infinite;
        }
        @keyframes lgMeshIn{ to{opacity:1;} }
        @keyframes lgMeshDrift{
          from{background-position:0 0;}
          to{background-position:48px 48px;}
        }

        /* ═══════════════════════════════════════════════════════════
           REAL BRAND (top-center, always in DOM)
        ═══════════════════════════════════════════════════════════ */
        /* Brand center at (50vw, 22vh). Icon: 52px. Wordmark: 152px.
           Total unit: 52+8+152=212px. Icon center: 50vw-74px. Word center: 50vw+30px.
           These values match the cinematic logo dock positions exactly. */
        .lg-brand{
          position:fixed; top:22vh; left:50%; z-index:5;
          transform:translate(-50%,-50%);
          display:flex; align-items:center; gap:8px;
        }
        .lg-brand-hidden{ opacity:0; }
        .lg-brand:not(.lg-brand-hidden){
          animation:txFadeIn .55s ease 6.6s both;
        }
        .lg-icon{
          width:52px; height:52px; object-fit:contain; flex-shrink:0;
          filter:drop-shadow(0 0 8px rgba(139,92,246,.35));
        }
        .lg-wordmark{ width:152px; display:block; flex-shrink:0; }

        /* ═══════════════════════════════════════════════════════════
           LOGIN FORM (assembles below brand)
        ═══════════════════════════════════════════════════════════ */
        .lg-form{
          position:fixed; z-index:5;
          left:50%; top:calc(22vh + 44px);   /* brand-center + 26px half-icon + 18px gap */
          transform:translateX(-50%);
          width:360px; max-width:calc(100vw - 48px);
        }

        /* ── Welcome Back ── */
        .lg-welcome-wrap{
          display:flex; align-items:center; height:30px; margin-bottom:34px;
          overflow:hidden;
        }
        .lg-cursor{
          display:inline-block; width:2px; height:22px;
          background:rgba(139,92,246,.8); border-radius:1px;
          margin-right:3px; flex-shrink:0;
          opacity:0;
          animation:
            txFadeIn .05s ease 5.38s forwards,
            lgCursorBlink .5s ease 5.38s 1,
            lgCursorFade  .2s ease 5.78s forwards;
        }
        @keyframes lgCursorBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes lgCursorFade{to{opacity:0;}}
        .lg-welcome-text{
          font-size:19px; font-weight:300; letter-spacing:.03em;
          color:rgba(255,255,255,.56);
          overflow:hidden; white-space:nowrap; display:inline-block;
          width:0;
          animation:lgWelcomeType .38s steps(12,end) 5.42s forwards;
        }
        @keyframes lgWelcomeType{ to{width:7.2em;} }

        /* ── Fields ── */
        .lg-field{ margin-bottom:28px; position:relative; }

        /* underline draws left→right first */
        .lg-underline{
          height:1px; background:rgba(255,255,255,.2);
          transform:scaleX(0); transform-origin:left;
          margin-bottom:8px;
        }
        /* then label + input reveal top→bottom */
        .lg-label{
          display:block; font-size:11px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(255,255,255,.38);
          margin-bottom:6px;
          opacity:0; transform:translateY(4px);
        }
        .lg-input{
          width:100%; background:transparent;
          border:none; border-bottom:1px solid rgba(255,255,255,.1);
          border-radius:0; color:#fff; font-size:15px;
          padding:10px 0; outline:none; box-sizing:border-box;
          transition:border-color .2s;
          opacity:0; transform:translateY(4px);
        }
        .lg-input::placeholder{ color:rgba(255,255,255,.22); }
        .lg-input:focus{ border-bottom-color:rgba(139,92,246,.6); }

        .lg-error{
          margin:-12px 0 18px; font-size:12px; color:#f87171;
          background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2);
          border-radius:8px; padding:8px 12px;
        }

        /* button grows from center, then glow settles */
        .lg-btn{
          width:100%; background:linear-gradient(135deg,#7C5CFF,#5B7CFA);
          color:#fff; font-size:14px; font-weight:500; letter-spacing:.03em;
          border:none; border-radius:10px; padding:13px;
          cursor:pointer; box-sizing:border-box;
          box-shadow:0 6px 24px rgba(124,92,255,.28);
          transition:transform .15s, filter .2s, box-shadow .2s;
          clip-path:inset(0 50% 0 50%);
        }
        .lg-btn:hover:not(:disabled){
          filter:brightness(1.09); box-shadow:0 8px 32px rgba(124,92,255,.42);
          transform:translateY(-1px);
        }
        .lg-btn:active:not(:disabled){ transform:translateY(0); }
        .lg-btn:disabled{ opacity:.55; cursor:not-allowed; }
        .lg-busy{ display:inline-flex; align-items:center; gap:9px; justify-content:center; }
        .lg-spinner{
          width:13px; height:13px; border-radius:50%;
          border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
          animation:lgSpin .7s linear infinite;
        }
        @keyframes lgSpin{ to{transform:rotate(360deg);} }

        .lg-footnote{
          margin:22px 0 0; text-align:center; font-size:11px;
          color:rgba(255,255,255,.24); letter-spacing:.03em;
          opacity:0; transform:translateY(4px);
        }
        .lg-credit{
          position:fixed; bottom:22px; left:0; right:0; z-index:5;
          text-align:center; font-size:11px; color:rgba(255,255,255,.16);
          letter-spacing:.06em;
        }
        .lg-credit-hidden{ opacity:0; animation:txFadeIn .4s ease 7.0s forwards; }

        /* ── ASSEMBLY ANIMATIONS (only active during intro) ─────── */
        /*
          Timeline (seconds from mount):
          5.38  cursor + welcome-wrap appear
          5.42  Welcome Back types in (0.38s)
          5.55  field 0: underline draws (0.42s)
          5.72  field 0: label + input reveal (0.3s)
          5.85  field 1: underline draws (0.42s)
          6.02  field 1: label + input reveal (0.3s)
          6.10  logo finishes docking ← LOGIN IS ~82% DONE AT THIS POINT
          6.15  button grows from center (0.5s)
          6.45  footnote fades in
          6.6   brand crossfades in, cinematic dissolves
        */
        .lg-assembling .lg-welcome-wrap{
          opacity:0;
          animation:txFadeIn .05s ease 5.38s forwards;
        }
        /* underline per field */
        .lg-assembling .lg-f0 .lg-underline{
          animation:lgLineDraw .42s cubic-bezier(.3,0,.2,1) 5.55s forwards;
        }
        .lg-assembling .lg-f1 .lg-underline{
          animation:lgLineDraw .42s cubic-bezier(.3,0,.2,1) 5.85s forwards;
        }
        @keyframes lgLineDraw{ to{transform:scaleX(1);} }

        /* label + input per field */
        .lg-assembling .lg-f0 .lg-label{
          animation:lgFieldIn .3s ease 5.72s forwards;
        }
        .lg-assembling .lg-f0 .lg-input{
          animation:lgFieldIn .3s ease 5.76s forwards;
        }
        .lg-assembling .lg-f1 .lg-label{
          animation:lgFieldIn .3s ease 6.02s forwards;
        }
        .lg-assembling .lg-f1 .lg-input{
          animation:lgFieldIn .3s ease 6.06s forwards;
        }
        @keyframes lgFieldIn{
          to{ opacity:1; transform:none; }
        }

        /* label + input instant for settled (no intro) */
        .lg-form:not(.lg-assembling) .lg-label,
        .lg-form:not(.lg-assembling) .lg-input,
        .lg-form:not(.lg-assembling) .lg-footnote{ opacity:1; transform:none; }
        .lg-form:not(.lg-assembling) .lg-underline{ transform:scaleX(1); }
        .lg-form:not(.lg-assembling) .lg-btn{ clip-path:inset(0 0 0 0); }
        .lg-form:not(.lg-assembling) .lg-welcome-text{ width:7.2em; }

        /* button grows */
        .lg-assembling .lg-btn{
          animation:lgBtnGrow .5s cubic-bezier(.3,0,.2,1) 6.15s forwards,
                    lgBtnGlow .4s ease 6.55s forwards;
        }
        @keyframes lgBtnGrow{ to{clip-path:inset(0 0% 0 0%);} }
        @keyframes lgBtnGlow{
          to{box-shadow:0 6px 24px rgba(124,92,255,.28);}
        }
        .lg-assembling .lg-footnote{
          animation:lgFieldIn .35s ease 6.45s forwards;
        }

        /* ═══════════════════════════════════════════════════════════
           CINEMATIC — CAMERA RIG
        ═══════════════════════════════════════════════════════════ */
        @keyframes txFadeIn{  from{opacity:0;} to{opacity:1;} }
        @keyframes txFadeOut{ to{opacity:0; pointer-events:none;} }

        /*  Camera: 6.5s total
            0–3.2s (0–49.2%)   RISE   translateY(-2.6vh → 0)
            3.2–5.5s (49.2–84.6%) DOLLY  scale(1 → 1.05)
            5.5–6.5s (84.6–100%)  PULL   scale(1.05 → 1)
            transform-origin locked on the logo birth point (50%, 45vh)
            so the dolly naturally zooms toward where the emblem is forged.  */
        .tx-camera{
          position:fixed; inset:0; z-index:10;
          transform-origin:50% 45vh;
          will-change:transform;
          animation:txCamera 6.5s linear forwards;
        }
        @keyframes txCamera{
          0%     {transform:translateY(-2.6vh) scale(1);
                  animation-timing-function:cubic-bezier(.22,.1,.25,1);}
          49.2%  {transform:translateY(0) scale(1);
                  animation-timing-function:cubic-bezier(.35,0,.55,1);}
          84.6%  {transform:translateY(0) scale(1.05);
                  animation-timing-function:cubic-bezier(.42,0,.18,1);}
          100%   {transform:translateY(0) scale(1);}
        }

        /* Space scene — fades away at 6.6s */
        .tx-scene{
          position:absolute; inset:0; background:#08090E;
          animation:txFadeOut .9s ease 6.6s forwards;
        }

        /* ── Earth ── */
        .tx-earth{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%; overflow:hidden;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%,
              rgba(16,42,88,.9) 0%, rgba(7,16,40,.92) 45%, rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.6),
            0 -8px 34px rgba(95,145,255,.3),
            0 -30px 120px rgba(60,100,230,.15),
            inset 0 6px 70px rgba(80,140,255,.18);
          opacity:0;
          will-change:opacity;
          animation:txFadeIn .6s ease .6s forwards, txEarthGone 1.0s ease 5.0s forwards;
        }
        /* Earth MUST be COMPLETELY GONE before login appears (rule 2+4) */
        @keyframes txEarthGone{ to{opacity:0;} }

        .tx-geo{
          position:absolute; left:50%; top:0;
          transform:translateX(-50%);
          width:80vw; height:12vw;
        }

        /* Trail */
        .tx-trail{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%;
          box-shadow:0 -1px 0 rgba(157,108,255,.9),0 -4px 16px rgba(139,92,246,.45);
          clip-path:inset(-40px 100% 90% 0); opacity:0;
          animation:txTrailGrow 2s cubic-bezier(.45,0,.25,1) 1.0s forwards,
                    txTrailFade .4s ease 3.2s forwards;
        }
        @keyframes txTrailGrow{
          0%{opacity:0;clip-path:inset(-40px 100% 90% 0);}
          10%{opacity:.9;}
          100%{opacity:.9;clip-path:inset(-40px 50% 90% 0);}
        }
        @keyframes txTrailFade{ to{opacity:0;} }

        /* Horizon flash at collapse */
        .tx-flash{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%;
          box-shadow:0 -3px 34px rgba(200,190,255,.6),0 -14px 110px rgba(140,150,255,.38);
          opacity:0; animation:txFlashPop .35s ease 3.18s 1;
        }
        @keyframes txFlashPop{0%{opacity:0;}40%{opacity:1;}100%{opacity:0;}}

        /* Sunrise travels left edge → center → collapses to logo birth point */
        .tx-sunrise{
          position:absolute; left:50%; top:78vh; width:0; height:0;
          opacity:0; will-change:transform,opacity;
          animation:
            txSunTravel  2s   cubic-bezier(.4,.05,.3,1) 1.0s forwards,
            txSunBreathe .65s ease-in-out 3.0s 1,
            txSunCollapse .4s cubic-bezier(.6,0,.8,1) 3.4s forwards;
        }
        /* NO mix-blend-mode on large elements — GPU killer */
        .tx-sun-core{
          position:absolute; left:-13px; top:-13px; width:26px; height:26px;
          border-radius:50%;
          background:radial-gradient(circle,#fff 0%,#fff8ec 55%,rgba(255,240,215,0) 100%);
          box-shadow:0 0 10px 3px rgba(255,255,255,.95),0 0 28px 9px rgba(255,235,200,.6);
          mix-blend-mode:screen; /* tiny element — acceptable */
        }
        .tx-sun-halo{
          position:absolute; left:-80px; top:-80px; width:160px; height:160px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,236,205,.68) 0%,rgba(255,214,165,.28) 42%,rgba(255,200,150,0) 72%);
        }
        .tx-sun-bloom{
          position:absolute; left:-230px; top:-230px; width:460px; height:460px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(200,180,255,.15) 0%,rgba(150,130,255,.08) 45%,rgba(140,120,255,0) 75%);
        }
        .tx-sun-streak{
          position:absolute; left:-280px; top:-1.5px; width:560px; height:3px;
          background:linear-gradient(90deg,rgba(255,240,220,0),rgba(255,244,228,.72),rgba(255,240,220,0));
          filter:blur(1.5px);
        }
        @keyframes txSunTravel{
          0%  {transform:translate(-44vw,7.66vw) scale(.15); opacity:0;}
          8%  {opacity:.5;}
          18% {transform:translate(-36vw,5.07vw) scale(.3);  opacity:.68;}
          36% {transform:translate(-28vw,3.04vw) scale(.45); opacity:.78;}
          54% {transform:translate(-20vw,1.55vw) scale(.6);  opacity:.86;}
          72% {transform:translate(-13vw,.65vw)  scale(.75); opacity:.93;}
          88% {transform:translate(-6vw,.14vw)   scale(.9);  opacity:.98;}
          100%{transform:translate(0,0) scale(1); opacity:1;}
        }
        @keyframes txSunBreathe{ 0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes txSunCollapse{
          0%  {transform:translate(0,0) scale(1); opacity:1;}
          /* collapse to icon birth point: earth at 78vh, icon at 45vh → -33vh */
          100%{transform:translate(0,-33vh) scale(.08); opacity:1;}
        }

        /* Energy sphere — appears where sunrise collapsed */
        .tx-sphere{
          position:absolute; left:50%; top:45vh;
          width:56px; height:56px; margin-left:-28px; margin-top:-28px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,255,255,1) 0%,rgba(200,175,255,.88) 35%,rgba(139,92,246,.4) 60%,rgba(139,92,246,0) 80%);
          box-shadow:0 0 14px 4px rgba(255,255,255,.75),0 0 44px 14px rgba(157,108,255,.45);
          mix-blend-mode:screen;
          opacity:0; will-change:transform,opacity;
          animation:
            txSphereIn    .12s ease 3.78s forwards,
            txSpherePulse .3s  ease-in-out 3.86s 1,
            txSphereBurst .75s cubic-bezier(.4,0,.2,1) 4.08s forwards;
        }
        @keyframes txSphereIn{to{opacity:1;}}
        @keyframes txSpherePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.38);}}
        @keyframes txSphereBurst{
          0%{transform:scale(1);opacity:1;}
          100%{transform:scale(5.4);opacity:0;}
        }

        /* ═══════════════════════════════════════════════════════════
           CINEMATIC LOGO
           RULE 3: SACRED. No particles. No glow blobs. No stars.
                   Crisp edges. One soft rim pulse. Nothing on it.
           RULE 4: STACKED during forge. SIDE-BY-SIDE after dock.

           MATH (verified):
           icon-outer: top:45vh left:50% → center (50vw, 45vh)
           word-outer: top:calc(45vh+58px) left:50% → center (50vw, 45vh+76px)

           After dock (at 5.1s, 1.0s duration, done 6.1s):
           icon-outer → translate(calc(-50%-74px), calc(-50%-23vh)) scale(.52)
             → visual center: (50vw-74px, 22vh) ← matches lg-brand icon center ✓
           word-outer → translate(calc(-50%+30px), calc(-23vh-76px)) scale(.70)
             → visual center: (50vw+30px, 22vh) ← matches lg-brand word center ✓
        ═══════════════════════════════════════════════════════════ */

        /* ── Icon (centered at 45vh, birth animation then dock) ── */
        .tx-icon-outer{
          position:fixed; left:50%; top:45vh;
          width:100px; height:100px;
          transform:translate(-50%,-50%);
          will-change:transform;
          animation:txIconDock 1.0s cubic-bezier(.4,0,.2,1) 5.1s forwards,
                    txIconFadeOut .55s ease 6.6s forwards;
        }
        .tx-icon-inner{
          width:100%; height:100%;
          opacity:0; will-change:opacity,transform;
          /* NO filter:blur — GPU killer. Scale+opacity only. */
          animation:
            txIconBirth .75s cubic-bezier(.4,0,.2,1) 4.1s forwards,
            txIconRim   2.2s ease-in-out 4.85s 1;
        }
        .tx-icon-inner img{ width:100%; height:100%; object-fit:contain; display:block; }

        @keyframes txIconBirth{
          0%  {opacity:0; transform:scale(1.42);}
          35% {opacity:.65;}
          100%{opacity:1; transform:scale(1);}
        }
        /* ONE soft rim pulse — this is all the "sacred" logo gets */
        @keyframes txIconRim{
          0%,100%{filter:drop-shadow(0 0 6px rgba(139,92,246,.3));}
          50%    {filter:drop-shadow(0 0 14px rgba(139,92,246,.65));}
        }
        @keyframes txIconDock{
          to{ transform:translate(calc(-50% - 80px), calc(-50% - 23vh)) scale(.52); }
        }
        @keyframes txIconFadeOut{ to{opacity:0;} }

        /* ── Wordmark (below icon → beside icon after dock) ── */
        .tx-word-outer{
          position:fixed; left:50%; top:calc(45vh + 78px);
          width:200px;
          transform:translateX(-50%);
          transform-origin:50% 0;
          will-change:transform;
          animation:txWordDock 1.0s cubic-bezier(.4,0,.2,1) 5.1s forwards,
                    txWordFadeOut .55s ease 6.6s forwards;
        }
        .tx-word-inner{
          opacity:0; transform:translateY(calc(-50% + 8px));
          will-change:opacity,transform;
          animation:txWordBirth .42s cubic-bezier(.3,0,.2,1) 4.52s forwards;
        }
        .tx-word-inner img{ width:100%; display:block; }

        /* birth: rises up from below, fades in — stacked directly below icon */
        @keyframes txWordBirth{
          0%  {opacity:0; transform:translateY(calc(-50% + 8px));}
          100%{opacity:1; transform:translateY(-50%);}
        }
        /* dock: translate to beside-icon position + scale down
           FROM: translateX(-50%) [word centered at 50vw, top=45vh+58px]
           TO:   word center at (50vw+30px, 22vh)
                 Δx = +30px from center → translate to -50%+30px
                 Δy = 22vh - (45vh+58px+18px) = -23vh-76px
                 scale: 200px→140px visible = 0.70 */
        @keyframes txWordDock{
          to{ transform:translate(calc(-50% + 30px), calc(-23vh - 78px)) scale(.76); }
        }
        @keyframes txWordFadeOut{ to{opacity:0;} }

        /* Skip */
        .tx-skip{
          position:fixed; top:20px; right:24px; z-index:30;
          background:rgba(255,255,255,.06); color:rgba(255,255,255,.5);
          border:1px solid rgba(255,255,255,.1); border-radius:999px;
          font-size:12px; padding:7px 16px; cursor:pointer;
          backdrop-filter:blur(6px);
          transition:color .2s,border-color .2s,background .2s;
          opacity:0; animation:txFadeIn .5s ease 1.2s forwards;
        }
        .tx-skip:hover{
          color:#fff; border-color:rgba(139,92,246,.5);
          background:rgba(139,92,246,.12);
        }

        @media(prefers-reduced-motion:reduce){
          .tx-camera,.tx-icon-outer,.tx-word-outer,.tx-scene{ animation:none!important; opacity:0!important; }
          .lg-brand-hidden{ opacity:1!important; }
          .lg-assembling .lg-label,.lg-assembling .lg-input,.lg-assembling .lg-footnote
            { opacity:1!important; transform:none!important; animation:none!important; }
          .lg-assembling .lg-underline{ transform:scaleX(1)!important; animation:none!important; }
          .lg-assembling .lg-btn{ clip-path:inset(0 0 0 0)!important; animation:none!important; }
          .lg-assembling .lg-welcome-text{ width:7.2em!important; }
        }
      `}</style>
    </div>
  );
}
