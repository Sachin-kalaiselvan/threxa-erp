import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/* ── timing constants (seconds from mount) ─────────────────── */
const INTRO_KEY = "threxa_intro_v4";
const T_SCENE_FADE  = 9.3;   // cinematic overlay fades out (after camera returns to identity)
const T_BRAND_IN    = 9.3;   // real brand fades in
const T_CARD_IN     = 9.45;  // form card fades in
const T_CLEANUP_MS  = 11600; // drop cinematic DOM

/* ── deterministic city lights (same every session) ───────────*/
function makeCityLights() {
  let s = 20260717;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  const clusters = [
    [152, 72, 14, 22, 10],   // US east coast
    [128, 52, 9,  18,  8],   // Canada
    [88,  68, 7,  14,  8],   // US west coast
    [464, 32, 16, 30, 13],   // western Europe
    [516, 62, 7,  14,  8],   // Middle East
    [586, 70, 11, 18, 11],   // India
    [680, 48, 18, 26, 15],   // East Asia
    [728, 46, 8,  13, 10],   // Japan
    [674, 88, 7,  13,  8],   // SE Asia
  ];
  const lights: {cx:number,cy:number,ra:number,warm:boolean,cl:number}[] = [];
  clusters.forEach(([cx, cy, n, sx, sy]) => {
    for (let i = 0; i < n; i++) {
      lights.push({ cx: cx+(r()-.5)*sx*2, cy: cy+(r()-.5)*sy*2,
                    ra: r()*1.9+0.5, warm: r()>.28, cl: i%3 });
    }
  });
  return lights;
}
const CITY_LIGHTS = makeCityLights();

/* ────────────────────────────────────────────────────────────── */
export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string|null>(null);
  const [busy,     setBusy]     = useState(false);

  const [playIntro, setPlayIntro] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("intro") === "1") return true;
    return !sessionStorage.getItem(INTRO_KEY);
  });

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<number|null>(null);

  /* Canvas starfield — single GPU element, far faster than 80+ divs */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d"); if (!ctx) return;;
    let s = 99991;
    const rr = () => { s = (s*1664525+1013904223)>>>0; return s/0xffffffff; };
    const stars = Array.from({length:220}, () => ({
      x: rr(), y: rr()*.78, r: rr()*1.5+.3, ph: rr()*Math.PI*2, sp: rr()*.4+.12
    }));

    let frame: number;
    const t0 = Date.now();
    const draw = () => {
      const el = (Date.now()-t0)/1000;
      const gOp = Math.min(1, el/1.4);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(st => {
        const op = gOp * (.25 + .55*Math.abs(Math.sin(st.ph + el*st.sp)));
        ctx.beginPath();
        ctx.arc(st.x*canvas.width, st.y*canvas.height, st.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(3)})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  /* Cleanup timer — drop cinematic DOM after sequence completes */
  useEffect(() => {
    if (!playIntro) return;
    cleanupRef.current = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPlayIntro(false);
    }, T_CLEANUP_MS);
    return () => { if (cleanupRef.current) clearTimeout(cleanupRef.current); };
  }, [playIntro]);

  const skip = () => {
    if (cleanupRef.current) clearTimeout(cleanupRef.current);
    sessionStorage.setItem(INTRO_KEY, "1");
    setPlayIntro(false);
  };

  const signIn = async () => {
    if (!email || !password) { setError("Enter your email and password."); return; }
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  const intr = playIntro;  // shorthand for class toggling

  return (
    <div className="lg-root">

      {/* ── LAYER 1: permanent backdrop ──────────────────────── */}
      <canvas ref={canvasRef} className="lg-canvas" />
      <div className="lg-earth-glow" />

      {/* ── LAYER 2: real UI (always in DOM, starts opacity:0) ── */}

      {/* Brand — at final position from the start.
          During the intro the cinematic logo sits on top.
          When the cinematic fades, this cross-fades in. */}
      <div className={`lg-brand${intr?" lg-brand-hidden":""}`}>
        <img src={threxaIcon}    className="lg-icon"     alt="" />
        <img src={threxaWordmark} className="lg-wordmark" alt="THREXA" />
      </div>

      {/* Form card — assembles below the brand */}
      <div className={`lg-card${intr?" lg-card-hidden":""}`}>
        <p className={`lg-tagline${intr?" lg-ci":""}`} style={{"--ci":0} as React.CSSProperties}>
          Manufacturing ERP
        </p>

        <div className="lg-fields">
          <div className={intr?"lg-ci":""} style={{"--ci":1} as React.CSSProperties}>
            <label className="lg-label" htmlFor="lg-em">Email</label>
            <input id="lg-em" className="lg-input" type="email" autoComplete="email"
              placeholder="you@company.com" value={email}
              onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&signIn()} />
          </div>

          <div className={intr?"lg-ci":""} style={{"--ci":2} as React.CSSProperties}>
            <label className="lg-label" htmlFor="lg-pw">Password</label>
            <input id="lg-pw" className="lg-input" type="password" autoComplete="current-password"
              placeholder="••••••••" value={password}
              onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&signIn()} />
          </div>

          {error && <p className="lg-error">{error}</p>}

          <button className={`lg-btn${intr?" lg-ci":""}`}
            style={{"--ci":3} as React.CSSProperties}
            onClick={signIn} disabled={busy}>
            {busy
              ? <span className="lg-busy"><span className="lg-spinner"/>Signing in…</span>
              : "Sign in"}
          </button>
        </div>

        <p className={`lg-footnote${intr?" lg-ci":""}`} style={{"--ci":4} as React.CSSProperties}>
          Accounts are created by the administrator.
        </p>
      </div>

      <p className={`lg-credit${intr?" lg-ci":""}`} style={{"--ci":5} as React.CSSProperties}>
        Threxa ERP · Smart Packaging Solutions
      </p>

      {/* ── LAYER 3: cinematic overlay (conditional) ─────────── */}
      {playIntro && <>

        {/* CAMERA RIG — one transform drives the whole shot:
            0-4s   rise (world drifts down as the camera lifts)
            4-7.9s slow dolly toward the logo (origin locked on it)
            7.9-9.4s gentle zoom out, returning to EXACT identity
            before the UI crossfade — handoff stays pixel-perfect. */}
        <div className="tx-camera">

        {/* The space scene — fades away at T_SCENE_FADE */}
        <div className="tx-scene">

          {/* Earth planet */}
          <div className="tx-earth">
            <svg className="tx-geo" viewBox="0 0 800 150" preserveAspectRatio="none">
              <defs>
                <filter id="landBlur"><feGaussianBlur stdDeviation="2"/></filter>
                <filter id="cityGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="1.8" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(64,96,78,.40)"/>
                  <stop offset="100%" stopColor="rgba(30,52,42,.08)"/>
                </linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(76,88,62,.34)"/>
                  <stop offset="100%" stopColor="rgba(38,46,36,.06)"/>
                </linearGradient>
                <linearGradient id="lg3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(58,82,72,.38)"/>
                  <stop offset="100%" stopColor="rgba(28,48,44,.06)"/>
                </linearGradient>
              </defs>

              {/* ── Continents (atlantic view: Americas left, EU/Africa center-right, Asia right) ── */}
              <g filter="url(#landBlur)">
                {/* North America */}
                <path fill="url(#lg2)" d="M 58,32 C 85,14 142,10 192,20 C 226,28 244,48 236,70 C 228,92 200,106 168,108 C 132,110 96,98 74,80 C 52,62 44,46 58,32 Z"/>
                {/* NE peninsula (New England) */}
                <path fill="url(#lg2)" d="M 192,20 C 208,24 220,34 218,46 C 216,56 204,60 196,54 C 188,48 186,34 192,20 Z"/>
                {/* South America */}
                <path fill="url(#lg1)" d="M 108,104 C 126,96 154,98 168,112 C 180,124 176,140 162,146 C 146,152 124,144 114,130 C 106,118 104,110 108,104 Z"/>
                {/* Greenland */}
                <path fill="url(#lg3)" d="M 240,6 C 256,1 274,4 278,12 C 282,20 276,30 262,32 C 248,34 234,26 234,14 L 240,6 Z"/>
                {/* Iceland */}
                <path fill="url(#lg3)" d="M 376,16 C 382,12 392,14 394,20 C 396,26 390,32 382,32 C 374,32 370,24 376,16 Z"/>
                {/* British Isles */}
                <path fill="url(#lg2)" d="M 448,22 C 454,16 464,16 468,22 C 472,28 470,38 462,42 C 454,44 444,38 448,22 Z"/>
                <ellipse fill="url(#lg2)" cx="452" cy="44" rx="7" ry="5"/>
                {/* Western Europe */}
                <path fill="url(#lg2)" d="M 464,16 C 480,8 512,8 528,20 C 542,30 544,48 532,58 C 518,68 492,68 474,58 C 456,46 450,28 464,16 Z"/>
                {/* Iberian Peninsula */}
                <path fill="url(#lg2)" d="M 444,56 C 454,50 470,52 474,62 C 478,72 472,82 460,84 C 448,86 438,76 440,64 L 444,56 Z"/>
                {/* Scandinavia */}
                <path fill="url(#lg3)" d="M 490,6 C 500,2 514,4 518,12 C 522,20 518,34 508,38 C 498,42 486,36 484,24 L 490,6 Z"/>
                {/* Africa */}
                <path fill="url(#lg1)" d="M 456,56 C 478,44 530,44 550,58 C 566,70 568,96 556,120 C 544,142 518,150 496,144 C 472,136 452,112 450,88 C 448,68 450,62 456,56 Z"/>
                {/* Madagascar */}
                <path fill="url(#lg1)" d="M 562,104 C 568,100 576,102 578,110 C 580,118 574,126 566,126 C 558,126 554,118 562,104 Z"/>
                {/* Arabian Peninsula */}
                <path fill="url(#lg2)" d="M 548,56 C 564,48 586,52 590,64 C 594,76 584,90 568,92 C 552,94 540,82 542,68 L 548,56 Z"/>
                {/* Indian subcontinent */}
                <path fill="url(#lg2)" d="M 596,56 C 614,46 636,50 640,64 C 646,80 636,100 620,108 C 604,114 588,108 584,92 C 580,76 584,64 596,56 Z"/>
                {/* Sri Lanka */}
                <ellipse fill="url(#lg2)" cx="628" cy="114" rx="5" ry="7"/>
                {/* East Asia */}
                <path fill="url(#lg3)" d="M 644,18 C 686,6 746,6 790,20 C 818,30 826,50 810,68 C 794,86 752,92 712,88 C 672,82 644,66 636,46 C 630,32 634,22 644,18 Z"/>
                {/* Korean peninsula */}
                <path fill="url(#lg3)" d="M 748,68 C 756,62 766,64 768,72 C 770,80 764,88 754,90 C 744,90 738,82 748,68 Z"/>
                {/* Japan main island */}
                <path fill="url(#lg3)" d="M 782,28 C 790,22 804,24 808,34 C 812,44 806,56 796,58 C 786,60 778,52 778,40 L 782,28 Z"/>
                {/* Hokkaido */}
                <ellipse fill="url(#lg3)" cx="800" cy="24" rx="10" ry="7"/>
                {/* SE Asia */}
                <path fill="url(#lg2)" d="M 716,84 C 732,76 756,80 764,92 C 770,102 764,116 750,118 C 734,120 718,108 716,94 L 716,84 Z"/>
                {/* Borneo */}
                <path fill="url(#lg1)" d="M 748,104 C 758,98 774,102 778,114 C 782,126 772,136 758,136 C 744,136 736,124 748,104 Z"/>
                {/* Australia */}
                <path fill="url(#lg2)" d="M 760,112 C 778,104 812,108 820,120 C 826,132 816,146 796,148 C 774,150 756,138 754,124 L 760,112 Z"/>
                {/* Atmospheric haze overlay */}
                <g opacity="0.055">
                  <ellipse cx="300" cy="55" rx="110" ry="24" fill="white"/>
                  <ellipse cx="530" cy="38" rx="70" ry="18" fill="white"/>
                  <ellipse cx="680" cy="30" rx="90" ry="20" fill="white"/>
                </g>
              </g>

              {/* City lights */}
              <g filter="url(#cityGlow)">
                {CITY_LIGHTS.map((l,i) => (
                  <circle key={i} cx={l.cx} cy={l.cy} r={l.ra}
                    fill={l.warm?"rgba(255,212,138,.92)":"rgba(208,224,255,.85)"}
                    opacity={0.5+l.cl*0.18}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Purple trail along the horizon */}
          <div className="tx-trail"/>

          {/* Horizon flash at collapse */}
          <div className="tx-flash"/>

          {/* The traveling sunrise */}
          <div className="tx-sunrise">
            <div className="tx-sun-core"/>
            <div className="tx-sun-halo"/>
            <div className="tx-sun-bloom"/>
            <div className="tx-sun-streak"/>
          </div>

          {/* Energy sphere */}
          <div className="tx-sphere"/>

        </div>{/* end .tx-scene */}

        {/* Cinematic logo unit — born at screen center, stays at screen center.
            ARCHITECTURE: the real .lg-brand is at position (26vh, center).
            This cinematic unit is ALSO at (47vh, center) during birth, then
            settles to (26vh, center) via CSS animation — same final position
            as .lg-brand. They crossfade: cinematic fades out, lg-brand fades in.
            No runtime measurement. No race conditions. ───────────────────────*/}
        <div className="tx-lu">
          <div className="tx-lu-icon">
            <img src={threxaIcon} alt=""/>
            <div className="tx-g tx-g1"/>
            <div className="tx-g tx-g2"/>
          </div>
          <div className="tx-lu-word">
            <img src={threxaWordmark} alt="THREXA"/>
          </div>
        </div>
        <div className="tx-lu-streak"/>

        </div>{/* end .tx-camera */}

        <button className="tx-skip" onClick={skip}>Skip ›</button>
      </>}

      {/* ── All styles inline — self-contained component ─────── */}
      <style>{`
        .lg-root{ position:fixed; inset:0; background:#05060A; overflow:hidden; font-family:inherit; }

        /* ── permanent backdrop ───────────────────── */
        .lg-canvas{ position:absolute; inset:0; z-index:1; }

        .lg-earth-glow{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%; z-index:2;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%, rgba(16,42,88,.9) 0%, rgba(7,16,40,.92) 45%, rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.6),
            0 -8px 34px rgba(95,145,255,.3),
            0 -30px 120px rgba(60,100,230,.15),
            inset 0 6px 70px rgba(80,140,255,.18);
        }

        /* ── real brand (top-center, z:3) ─────────── */
        /* Position anchors everything: brand center at top:26vh left:50%.
           The cinematic logo settles to exactly this position at 7.1s.
           They crossfade at 7.8s → seamless handoff, no black gap possible. */
        .lg-brand{
          position:fixed; top:26vh; left:50%; z-index:3;
          transform:translate(-50%,-50%);
          display:flex; align-items:center; gap:8px;
          transition:opacity .6s ease;
        }
        .lg-brand-hidden{ opacity:0; }
        /* fades in as cinematic fades out */
        .lg-brand:not(.lg-brand-hidden){ animation:txFadeIn .6s ease ${T_BRAND_IN}s both; }
        .lg-icon{
          width:56px; height:56px; object-fit:contain;
          filter:drop-shadow(0 0 10px rgba(157,108,255,.5));
        }
        .lg-wordmark{ width:155px; display:block; }

        /* ── form card (below brand) ──────────────── */
        .lg-card{
          position:fixed; left:50%; top:calc(26vh + 36px); z-index:3;
          transform:translateX(-50%);
          width:380px; max-width:calc(100vw - 40px);
          background:rgba(11,12,20,.82);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px; padding:24px 32px 28px;
          backdrop-filter:blur(14px);
          box-shadow:0 0 0 1px rgba(157,108,255,.06), 0 24px 70px rgba(0,0,0,.55), 0 0 90px rgba(139,92,246,.08);
        }
        .lg-card-hidden{
          opacity:0; transform:translateX(-50%) translateY(10px);
        }
        .lg-card:not(.lg-card-hidden){
          animation:lgCardIn .6s cubic-bezier(.3,0,.2,1) ${T_CARD_IN}s both;
        }
        @keyframes lgCardIn{
          from{opacity:0;transform:translateX(-50%) translateY(10px);}
          to{opacity:1;transform:translateX(-50%) translateY(0);}
        }

        /* cascade-in for children (--ci = item index) */
        .lg-ci{
          opacity:0; transform:translateY(7px);
          animation:lgCi .45s cubic-bezier(.3,0,.2,1) both;
          animation-delay:calc(${T_CARD_IN + 0.12}s + var(--ci,0)*.09s);
        }
        @keyframes lgCi{ to{opacity:1;transform:none;} }

        .lg-tagline{
          margin:0 0 22px; text-align:center;
          font-size:11px; letter-spacing:.28em; text-transform:uppercase; color:#8b8d9e;
        }
        .lg-fields{ display:flex; flex-direction:column; gap:0; }
        .lg-label{ display:block; font-size:11px; color:#9a9cad; margin:0 0 6px 2px; letter-spacing:.04em; }
        .lg-input{
          width:100%; background:#12131d; border:1px solid rgba(255,255,255,.09);
          border-radius:10px; color:#fff; font-size:14px; padding:11px 14px;
          margin-bottom:16px; outline:none; box-sizing:border-box;
          transition:border-color .18s,box-shadow .18s,background .18s;
        }
        .lg-input::placeholder{color:#585a6b;}
        .lg-input:focus{
          border-color:rgba(157,108,255,.55); background:#151625;
          box-shadow:0 0 0 3px rgba(139,92,246,.13);
        }
        .lg-error{
          margin:0 0 14px; font-size:12px; color:#f87171;
          background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.22);
          border-radius:8px; padding:8px 12px;
        }
        .lg-btn{
          width:100%; background:linear-gradient(135deg,#7C5CFF,#5B7CFA);
          color:#fff; font-size:14px; font-weight:600;
          border:none; border-radius:10px; padding:12px; cursor:pointer;
          box-shadow:0 6px 22px rgba(124,92,255,.28);
          transition:transform .15s,box-shadow .2s,filter .2s;
        }
        .lg-btn:hover:not(:disabled){
          filter:brightness(1.08); box-shadow:0 8px 30px rgba(124,92,255,.4);
          transform:translateY(-1px);
        }
        .lg-btn:active:not(:disabled){transform:translateY(0);}
        .lg-btn:disabled{opacity:.6;cursor:not-allowed;}
        .lg-busy{display:inline-flex;align-items:center;gap:9px;justify-content:center;}
        .lg-spinner{
          width:14px;height:14px;border-radius:50%;
          border:2px solid rgba(255,255,255,.35);border-top-color:#fff;
          animation:lgSpin .7s linear infinite;
        }
        @keyframes lgSpin{to{transform:rotate(360deg);}}
        .lg-footnote{margin:20px 0 0;text-align:center;font-size:11px;color:#6b6d7e;}
        .lg-credit{
          position:fixed;bottom:24px;left:0;right:0;z-index:3;
          text-align:center;font-size:11px;color:#4c4e5e;letter-spacing:.06em;
        }
        .lg-credit.lg-ci{opacity:0;}

        /* ═════════════ CINEMATIC OVERLAY (z:10–22) ═════════════ */

        @keyframes txFadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes txFadeOut{to{opacity:0;pointer-events:none;}}

        /* Camera rig — the entire shot lives inside this transform */
        .tx-camera{
          position:fixed;inset:0;z-index:10;
          transform-origin:50% 47%;
          will-change:transform;
          animation:txCamera 9.4s linear forwards;
        }
        /* keyframe %s of 9.4s: 4s=42.55%, 7.9s=84.04% — eased per-segment */
        @keyframes txCamera{
          0%     {transform:translateY(-2.4vh) scale(1);
                  animation-timing-function:cubic-bezier(.25,.1,.25,1);}
          42.55% {transform:translateY(0) scale(1);
                  animation-timing-function:cubic-bezier(.4,0,.6,1);}
          84.04% {transform:translateY(0) scale(1.055);
                  animation-timing-function:cubic-bezier(.35,0,.25,1);}
          100%   {transform:translateY(0) scale(1);}
        }

        /* Scene overlay — plays, then fades away */
        .tx-scene{
          position:absolute;inset:0;background:#05060A;
          animation:txFadeOut .9s ease ${T_SCENE_FADE}s forwards;
        }

        /* Earth */
        .tx-earth{
          position:absolute;left:50%;top:78vh;width:260vw;height:260vw;
          margin-left:-130vw;border-radius:50%;overflow:hidden;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%, rgba(16,42,88,.9) 0%,rgba(7,16,40,.92) 45%,rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.6),
            0 -8px 34px rgba(95,145,255,.3),
            0 -30px 120px rgba(60,100,230,.15),
            inset 0 6px 70px rgba(80,140,255,.18);
          opacity:0;
          animation:txFadeIn .6s ease .6s forwards, txEarthDim 1.6s ease 8.2s forwards;
        }
        @keyframes txEarthDim{to{opacity:.12;}}

        /* Geo SVG (continents + city lights inside the earth) */
        .tx-geo{
          position:absolute;left:50%;top:0;
          transform:translateX(-50%);
          width:80vw;height:12vw;
        }

        /* Trail */
        .tx-trail{
          position:absolute;left:50%;top:78vh;width:260vw;height:260vw;
          margin-left:-130vw;border-radius:50%;
          box-shadow:0 -1px 0 rgba(157,108,255,.9),0 -4px 16px rgba(139,92,246,.45);
          clip-path:inset(-40px 100% 90% 0);opacity:0;
          animation:txTrailGrow 2s cubic-bezier(.45,0,.25,1) 1.2s forwards,
                    txTrailFade .4s ease 3.85s forwards;
        }
        @keyframes txTrailGrow{
          0%{opacity:0;clip-path:inset(-40px 100% 90% 0);}
          10%{opacity:.9;}
          100%{opacity:.9;clip-path:inset(-40px 50% 90% 0);}
        }
        @keyframes txTrailFade{to{opacity:0;}}

        /* Horizon flash */
        .tx-flash{
          position:absolute;left:50%;top:78vh;width:260vw;height:260vw;
          margin-left:-130vw;border-radius:50%;
          box-shadow:0 -3px 34px rgba(200,190,255,.6),0 -14px 110px rgba(140,150,255,.38);
          opacity:0;animation:txFlashPop .35s ease 3.68s 1;
        }
        @keyframes txFlashPop{0%{opacity:0;}40%{opacity:1;}100%{opacity:0;}}

        /* Sunrise — travels left edge of globe to center */
        .tx-sunrise{
          position:absolute;left:50%;top:78vh;width:0;height:0;
          opacity:0;will-change:transform,opacity;
          animation:
            txSunTravel 2s cubic-bezier(.4,.05,.3,1) 1.2s forwards,
            txSunBreathe .65s ease-in-out 3.2s 1,
            txSunCollapse .4s cubic-bezier(.6,0,.8,1) 3.85s forwards;
        }
        /* sun core — small bright point, keep mix-blend-mode (tiny element, worth it) */
        .tx-sun-core{
          position:absolute;left:-13px;top:-13px;width:26px;height:26px;border-radius:50%;
          background:radial-gradient(circle,#fff 0%,#fff8ec 55%,rgba(255,240,215,0) 100%);
          box-shadow:0 0 10px 3px rgba(255,255,255,.95),0 0 28px 9px rgba(255,235,200,.6);
          mix-blend-mode:screen;
        }
        /* halo, bloom, streak — NO mix-blend-mode (large, expensive), just higher opacity */
        .tx-sun-halo{
          position:absolute;left:-80px;top:-80px;width:160px;height:160px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,236,205,.7) 0%,rgba(255,214,165,.3) 42%,rgba(255,200,150,0) 72%);
        }
        .tx-sun-bloom{
          position:absolute;left:-230px;top:-230px;width:460px;height:460px;border-radius:50%;
          background:radial-gradient(circle,rgba(200,180,255,.16) 0%,rgba(150,130,255,.08) 45%,rgba(140,120,255,0) 75%);
        }
        .tx-sun-streak{
          position:absolute;left:-280px;top:-1.5px;width:560px;height:3px;
          background:linear-gradient(90deg,rgba(255,240,220,0),rgba(255,244,228,.75),rgba(255,240,220,0));
          filter:blur(1.5px);
        }
        @keyframes txSunTravel{
          0%  {transform:translate(-44vw,7.66vw) scale(.15);opacity:0;}
          8%  {opacity:.5;}
          18% {transform:translate(-36vw,5.07vw) scale(.3);opacity:.68;}
          36% {transform:translate(-28vw,3.04vw) scale(.45);opacity:.78;}
          54% {transform:translate(-20vw,1.55vw) scale(.6);opacity:.86;}
          72% {transform:translate(-13vw,.65vw) scale(.75);opacity:.93;}
          88% {transform:translate(-6vw,.14vw) scale(.9);opacity:.98;}
          100%{transform:translate(0,0) scale(1);opacity:1;}
        }
        @keyframes txSunBreathe{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes txSunCollapse{
          0%{transform:translate(0,0) scale(1);opacity:1;}
          /* collapse toward the birth point of the logo (top:47vh from viewport)
             earth is at 78vh, so birth point is 78vh-47vh = 31vh above earth top */
          100%{transform:translate(0,-31vh) scale(.08);opacity:1;}
        }

        /* Energy sphere — appears where the sunrise collapsed */
        .tx-sphere{
          position:absolute;left:50%;top:47vh;
          width:56px;height:56px;margin-left:-28px;margin-top:-28px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,255,255,1) 0%,rgba(200,175,255,.88) 35%,rgba(139,92,246,.4) 60%,rgba(139,92,246,0) 80%);
          box-shadow:0 0 14px 4px rgba(255,255,255,.75),0 0 44px 14px rgba(157,108,255,.45);
          mix-blend-mode:screen;
          opacity:0;will-change:transform,opacity;
          animation:
            txSphereIn .12s ease 4.22s forwards,
            txSpherePulse .3s ease-in-out 4.3s 1,
            txSphereBurst .75s cubic-bezier(.4,0,.2,1) 4.55s forwards;
        }
        @keyframes txSphereIn{to{opacity:1;}}
        @keyframes txSpherePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.38);}}
        @keyframes txSphereBurst{
          0%{transform:scale(1);opacity:1;}
          100%{transform:scale(5.4);opacity:0;}
        }

        /* ── Cinematic logo unit ─────────────────────────────────
           Born at top:47vh center. Settles at top:26vh center.
           47vh - 21vh = 26vh = exact .lg-brand position.
           Scale 0.4: icon 140*0.4=56px, wordmark 388*0.4=155px.
           Both match .lg-brand sizes exactly. ─────────────────── */
        .tx-lu{
          position:absolute;left:50%;top:47vh;
          transform:translate(-50%,-50%);
          display:flex;align-items:center;gap:18px;
          z-index:20;will-change:transform;
          animation:txLuSettle .9s cubic-bezier(.35,0,.2,1) 8.6s forwards;
        }
        @keyframes txLuSettle{
          to{transform:translate(-50%,-50%) translateY(-21vh) scale(.4);}
        }

        .tx-lu-icon{
          position:relative;width:140px;height:140px;flex-shrink:0;
          opacity:0;will-change:transform,opacity;
          /* birth: scale+opacity only — NO filter:blur (GPU killer) */
          animation:txLuBirth .75s cubic-bezier(.4,0,.2,1) 4.55s forwards,
                    txLuPulse 2.4s ease-in-out 5.8s 2,
                    txLuFadeOut .7s ease ${T_SCENE_FADE}s forwards;
        }
        .tx-lu-icon img{width:100%;height:100%;object-fit:contain;display:block;}
        @keyframes txLuBirth{
          0%{opacity:0;transform:scale(1.5);}
          35%{opacity:.65;}
          100%{opacity:1;transform:scale(1);}
        }
        @keyframes txLuPulse{
          0%,100%{filter:drop-shadow(0 0 8px rgba(157,108,255,.4));}
          50%{filter:drop-shadow(0 0 18px rgba(157,108,255,.75));}
        }
        @keyframes txLuFadeOut{to{opacity:0;}}

        /* star glints on logo */
        .tx-g{
          position:absolute;border-radius:50%;opacity:0;
          background:radial-gradient(circle,rgba(255,255,255,1) 0%,rgba(200,170,255,.7) 40%,rgba(157,108,255,0) 75%);
          mix-blend-mode:screen;
          animation:txGlintPop .3s ease forwards,txGlintTwinkle 1.8s ease-in-out infinite;
        }
        .tx-g1{width:10px;height:10px;left:76%;top:26%;animation-delay:5.25s,5.55s;}
        .tx-g2{width:7px;height:7px;left:87%;top:45%;animation-delay:5.45s,5.75s;}
        @keyframes txGlintPop{0%{opacity:0;transform:scale(0);}100%{opacity:1;transform:scale(1);}}
        @keyframes txGlintTwinkle{0%,100%{opacity:.55;}50%{opacity:1;}}

        /* THREXA wordmark — projects from logo's right side */
        .tx-lu-word{
          width:388px;flex-shrink:0;
          clip-path:inset(0 100% 0 0);opacity:0;
          animation:txWordProject .7s cubic-bezier(.3,0,.2,1) 6.2s forwards,
                    txLuFadeOut .7s ease ${T_SCENE_FADE}s forwards;
        }
        .tx-lu-word img{width:100%;display:block;}
        @keyframes txWordProject{
          0%{clip-path:inset(0 100% 0 0);opacity:.9;}
          100%{clip-path:inset(0 0% 0 0);opacity:1;}
        }

        /* light streak that runs across as THREXA is projected */
        .tx-lu-streak{
          position:absolute;left:50%;top:47vh;z-index:21;
          width:14px;height:32px;margin-top:-16px;
          /* starts at wordmark left edge: icon_half(70px) + gap(18px) = 88px from center */
          transform:translate(81px,-50%);
          background:linear-gradient(90deg,rgba(255,255,255,0),rgba(220,200,255,.92),rgba(255,255,255,0));
          filter:blur(3px);opacity:0;
          animation:txStreakMove .7s cubic-bezier(.3,0,.2,1) 6.2s forwards;
        }
        @keyframes txStreakMove{
          0%{opacity:1;transform:translate(81px,-50%);}
          92%{opacity:1;}
          100%{opacity:0;transform:translate(calc(81px + 388px),-50%);}
        }

        /* Skip button */
        .tx-skip{
          position:fixed;top:22px;right:26px;z-index:30;
          background:rgba(255,255,255,.06);color:#9a9cad;
          border:1px solid rgba(255,255,255,.12);border-radius:999px;
          font-size:12px;padding:7px 16px;cursor:pointer;
          backdrop-filter:blur(6px);
          transition:color .2s,border-color .2s,background .2s;
          opacity:0;animation:txFadeIn .5s ease 1s forwards;
        }
        .tx-skip:hover{color:#fff;border-color:rgba(157,108,255,.5);background:rgba(157,108,255,.12);}

        @media(prefers-reduced-motion:reduce){
          .tx-lu,.tx-lu-icon,.tx-lu-word,.tx-scene,.tx-sunrise{animation:none!important;opacity:0!important;}
          .lg-brand-hidden,.lg-card-hidden{opacity:1!important;transform:none!important;}
          .lg-ci{opacity:1!important;transform:none!important;animation:none!important;}
        }
      `}</style>
    </div>
  );
}
