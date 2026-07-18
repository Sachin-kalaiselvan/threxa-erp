import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   THREXA LOADING EXPERIENCE — follows the 12-frame storyboard
   1 deep space          →  2-4 sunrise travels L→center
   5 light compresses    →  6 orbit ring draws itself
   7 X builds inside     →  8-9 stars appear
   10 logo complete      →  11 THREXA emerges
   12 initializing checklist → fade to app
   Pure CSS/SVG. No filters on huge surfaces. Plays once/session.
   ═══════════════════════════════════════════════════════════════ */

const ITEMS = [
  "AI Core Online",
  "Secure Connection",
  "ERP Modules",
  "Data Sync",
  "Automation Ready",
];

export default function IntroOverlay() {
  const [show, setShow] = useState(
    () =>
      !sessionStorage.getItem("threxa_intro_seen") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [gone, setGone] = useState(!show);

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("threxa_intro_seen", "1");
    const t = setTimeout(() => setShow(false), 8600);
    return () => clearTimeout(t);
  }, [show]);

  useEffect(() => {
    if (!show && !gone) {
      const t = setTimeout(() => setGone(true), 700);
      return () => clearTimeout(t);
    }
  }, [show, gone]);

  if (gone) return null;

  return (
    <div className={`ti-root ${!show ? "ti-exit" : ""}`}>
      <button className="ti-skip" onClick={() => setShow(false)}>Skip ›</button>

      {/* 1 · star field (cheap: two repeating radial-gradient layers) */}
      <div className="ti-stars" />
      <div className="ti-stars ti-stars2" />

      {/* horizon glow strip at the bottom (frames 2-4 backdrop) */}
      <div className="ti-horizon" />

      {/* 2-5 · sun: travels left → center, then compresses */}
      <div className="ti-sun">
        <div className="ti-sun-core" />
        <div className="ti-sun-halo" />
      </div>

      {/* 6-10 · logo forge */}
      <div className="ti-logo">
        <svg viewBox="0 0 200 200" width="150" height="150">
          <defs>
            <linearGradient id="tiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F6BFF" />
              <stop offset="55%" stopColor="#7B3CFF" />
              <stop offset="100%" stopColor="#B14BFF" />
            </linearGradient>
          </defs>
          {/* orbit ring draws itself */}
          <ellipse
            className="ti-orbit"
            cx="100" cy="100" rx="86" ry="60"
            transform="rotate(-24 100 100)"
            fill="none" stroke="url(#tiGrad)" strokeWidth="7" strokeLinecap="round"
          />
          {/* X builds inside — two strokes */}
          <line className="ti-x1" x1="64" y1="60" x2="136" y2="140"
            stroke="url(#tiGrad)" strokeWidth="20" strokeLinecap="round" />
          <line className="ti-x2" x1="136" y1="60" x2="64" y2="140"
            stroke="url(#tiGrad)" strokeWidth="20" strokeLinecap="round" />
          {/* stars appear */}
          <path className="ti-star ti-starA"
            d="M172 52 l4.5 11 11 4.5 -11 4.5 -4.5 11 -4.5 -11 -11 -4.5 11 -4.5 Z"
            fill="#C9A8FF" />
          <path className="ti-star ti-starB"
            d="M186 92 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z"
            fill="#9D6CFF" />
        </svg>

        {/* 11 · wordmark emerges */}
        <div className="ti-word">THREXA</div>
      </div>

      {/* 12 · initializing checklist */}
      <div className="ti-init">
        <div className="ti-init-row">
          <span>Initializing Workspace…</span>
          <span className="ti-pct" />
        </div>
        <div className="ti-bar"><div className="ti-bar-fill" /></div>
        <ul>
          {ITEMS.map((it, i) => (
            <li key={it} style={{ animationDelay: `${6.4 + i * 0.32}s` }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="6" fill="rgba(139,92,246,.25)" />
                <path d="M3.4 6.2 5.2 8 8.8 4.2" stroke="#B79CFF" strokeWidth="1.6"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {it}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .ti-root{
          position:fixed; inset:0; z-index:9999; overflow:hidden;
          background:radial-gradient(120% 90% at 50% 118%,
            #141032 0%, #0B0A1A 42%, #06060E 100%);
          display:flex; align-items:center; justify-content:center;
          transition:opacity .65s ease;
        }
        .ti-exit{ opacity:0; pointer-events:none; }

        .ti-skip{
          position:absolute; top:20px; right:24px; z-index:5;
          padding:6px 14px; border-radius:999px; font-size:12px;
          color:#8A8CA3; background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08); cursor:pointer;
        }
        .ti-skip:hover{ color:#E7E8F0; }

        /* ── stars: pure CSS, zero JS ── */
        .ti-stars{
          position:absolute; inset:0; opacity:0;
          background-image:
            radial-gradient(1.4px 1.4px at 12% 22%, rgba(255,255,255,.8) 40%, transparent 41%),
            radial-gradient(1px 1px    at 34% 12%, rgba(255,255,255,.6) 40%, transparent 41%),
            radial-gradient(1.6px 1.6px at 58% 30%, rgba(255,255,255,.7) 40%, transparent 41%),
            radial-gradient(1px 1px    at 76% 16%, rgba(255,255,255,.55) 40%, transparent 41%),
            radial-gradient(1.2px 1.2px at 90% 34%, rgba(255,255,255,.7) 40%, transparent 41%),
            radial-gradient(1px 1px    at 22% 48%, rgba(255,255,255,.5) 40%, transparent 41%),
            radial-gradient(1.3px 1.3px at 46% 55%, rgba(255,255,255,.6) 40%, transparent 41%),
            radial-gradient(1px 1px    at 68% 44%, rgba(255,255,255,.5) 40%, transparent 41%);
          animation:tiFade .9s ease .1s forwards, tiTwinkle 3.4s ease-in-out 1s infinite;
        }
        .ti-stars2{
          background-image:
            radial-gradient(1px 1px    at 8% 64%,  rgba(200,190,255,.5) 40%, transparent 41%),
            radial-gradient(1.4px 1.4px at 28% 74%, rgba(200,190,255,.6) 40%, transparent 41%),
            radial-gradient(1px 1px    at 52% 68%, rgba(255,255,255,.45) 40%, transparent 41%),
            radial-gradient(1.2px 1.2px at 82% 60%, rgba(200,190,255,.55) 40%, transparent 41%),
            radial-gradient(1px 1px    at 94% 78%, rgba(255,255,255,.4) 40%, transparent 41%);
          animation:tiFade .9s ease .3s forwards, tiTwinkle 4.1s ease-in-out 1.4s infinite reverse;
        }
        @keyframes tiTwinkle{ 0%,100%{opacity:1;} 50%{opacity:.55;} }

        /* ── horizon glow ── */
        .ti-horizon{
          position:absolute; left:-10%; right:-10%; bottom:-4vh; height:26vh;
          border-radius:50% 50% 0 0 / 100% 100% 0 0;
          background:radial-gradient(60% 100% at 50% 100%,
            rgba(123,60,255,.28) 0%, rgba(80,70,220,.12) 45%, transparent 75%);
          box-shadow:0 -1px 0 rgba(160,140,255,.35);
          opacity:0; animation:tiFade 1s ease .4s forwards;
          transform:translateZ(0);
        }

        /* ── sun travel (frames 2-5) ── */
        .ti-sun{
          position:absolute; left:50%; top:50%; width:0; height:0;
          will-change:transform,opacity; transform:translateZ(0);
          animation:
            tiSunTravel 2.1s cubic-bezier(.4,.05,.3,1) .7s forwards,
            tiSunCompress .5s cubic-bezier(.6,0,.85,1) 2.9s forwards;
          opacity:0;
        }
        .ti-sun-core{
          position:absolute; left:-11px; top:-11px; width:22px; height:22px;
          border-radius:50%;
          background:radial-gradient(circle,#fff 0%,#F3E8FF 50%,transparent 75%);
          box-shadow:0 0 14px 5px rgba(255,255,255,.85), 0 0 44px 16px rgba(178,140,255,.5);
        }
        .ti-sun-halo{
          position:absolute; left:-70px; top:-70px; width:140px; height:140px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(190,160,255,.4) 0%, transparent 70%);
        }
        @keyframes tiSunTravel{
          0%  { transform:translate(-46vw, 16vh) scale(.2); opacity:0; }
          12% { opacity:.75; }
          55% { transform:translate(-20vw, 5vh) scale(.6); opacity:.9; }
          100%{ transform:translate(0, 0) scale(1); opacity:1; }
        }
        @keyframes tiSunCompress{
          60% { transform:scale(1.35); opacity:1; }
          100%{ transform:scale(.05);  opacity:0; }
        }

        /* ── logo forge (frames 6-10) ── */
        .ti-logo{
          position:relative; z-index:2; text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:14px;
        }
        .ti-orbit{
          stroke-dasharray:465; stroke-dashoffset:465;
          animation:tiDraw .9s cubic-bezier(.5,0,.3,1) 3.35s forwards;
        }
        @keyframes tiDraw{ to{ stroke-dashoffset:0; } }

        .ti-x1,.ti-x2{
          stroke-dasharray:110; stroke-dashoffset:110;
        }
        .ti-x1{ animation:tiDraw .45s ease 4.25s forwards; }
        .ti-x2{ animation:tiDraw .45s ease 4.5s forwards; }

        .ti-star{ opacity:0; transform-origin:center; }
        .ti-starA{ animation:tiPop .5s cubic-bezier(.2,1.4,.4,1) 4.95s forwards; }
        .ti-starB{ animation:tiPop .5s cubic-bezier(.2,1.4,.4,1) 5.2s forwards; }
        @keyframes tiPop{
          0%{ opacity:0; transform:scale(0); }
          70%{ opacity:1; transform:scale(1.25); }
          100%{ opacity:1; transform:scale(1); }
        }

        /* ── wordmark (frame 11) ── */
        .ti-word{
          font-size:24px; font-weight:600; color:#EDEBFF;
          letter-spacing:.55em; padding-left:.55em;
          opacity:0; filter:blur(5px);
          animation:tiWord .8s ease 5.5s forwards;
        }
        @keyframes tiWord{
          to{ opacity:1; filter:blur(0); letter-spacing:.38em; }
        }

        /* ── init checklist (frame 12) ── */
        .ti-init{
          position:absolute; left:50%; bottom:9vh; transform:translateX(-50%);
          width:min(340px, 78vw); z-index:2;
          opacity:0; animation:tiFade .5s ease 6.2s forwards;
        }
        .ti-init-row{
          display:flex; justify-content:space-between; align-items:baseline;
          font-size:12px; color:#8A8CA3; margin-bottom:8px;
        }
        .ti-pct::after{
          content:""; animation:tiPct 2s steps(20) 6.3s forwards;
        }
        @keyframes tiPct{
          0%{content:"0%";} 25%{content:"27%";} 50%{content:"54%";}
          75%{content:"81%";} 100%{content:"100%";}
        }
        .ti-bar{
          height:3px; border-radius:99px; background:rgba(255,255,255,.07);
          overflow:hidden; margin-bottom:14px;
        }
        .ti-bar-fill{
          height:100%; width:0; border-radius:99px;
          background:linear-gradient(90deg,#4F6BFF,#8B5CF6,#B14BFF);
          animation:tiBar 2s cubic-bezier(.3,0,.3,1) 6.3s forwards;
        }
        @keyframes tiBar{ to{ width:100%; } }
        .ti-init ul{ list-style:none; margin:0; padding:0; }
        .ti-init li{
          display:flex; align-items:center; gap:8px;
          font-size:11.5px; color:#A7A9C0; padding:3px 0;
          opacity:0; transform:translateY(4px);
          animation:tiItem .35s ease forwards;
        }
        @keyframes tiItem{ to{ opacity:1; transform:translateY(0); } }

        @keyframes tiFade{ to{ opacity:1; } }
      `}</style>
    </div>
  );
}
