import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/**
 * Login — THE PORTAL OPENING
 * --------------------------
 * The original ThrexaIntro sequence, re-staged so it plays BEFORE
 * authentication. One continuous shot:
 *
 *  0.0-0.6   stars fade in over black
 *  0.6-1.2   Earth silhouette fades in (bottom, thin blue atmosphere)
 *  1.2-3.2   sunrise begins at the FAR LEFT edge of the planet and
 *            travels along the curved horizon toward center, leaving
 *            a faint purple energy trail on the limb behind it
 *  3.2-3.7   ARRIVAL — hold
 *  3.7-3.85  the whole horizon flashes
 *  3.85-4.25 the light collapses into one energy sphere above the limb
 *  4.25-4.55 the sphere pulses once
 *  4.55-5.3  THE BIRTH — the sphere dissolves as the official logo
 *            condenses out of the light (blur 14->0, scale 1.5->1)
 *  5.25-5.75 the two stars glint
 *  6.2-6.9   THREXA is projected from the logo's right side
 *            (clip-path reveal + leading light streak)
 *  7.4-8.2   THE PORTAL — logo + wordmark travel into the login card's
 *            brand position while the card materializes around them;
 *            the credential fields cascade open
 *  8.2+      interactive login
 *
 * Plays once per browser session. ?intro=1 always replays it.
 * A Skip button is available the whole time.
 */

const INTRO_KEY = "threxa_login_intro_done";
const T_TRAVEL_MS = 7400; // logo begins travelling into the card
const T_DONE_MS = 8300;   // card fully interactive

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // "intro" -> cinematic playing | "travel" -> logo flying into card | "done" -> interactive
  const [phase, setPhase] = useState<"intro" | "travel" | "done">(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") return "intro";
    return sessionStorage.getItem(INTRO_KEY) ? "done" : "intro";
  });

  const starWrapRef = useRef<HTMLDivElement>(null);
  const cityLightsRef = useRef<HTMLDivElement>(null);
  const cardIconRef = useRef<HTMLImageElement>(null);
  const cardWordRef = useRef<HTMLImageElement>(null);
  const flyIconRef = useRef<HTMLDivElement>(null);
  const flyWordRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // timeline driver
  useEffect(() => {
    if (phase !== "intro") return;

    const t1 = window.setTimeout(() => beginTravel(), T_TRAVEL_MS);
    const t2 = window.setTimeout(() => finish(), T_DONE_MS);
    timersRef.current = [t1, t2];
    return () => timersRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const beginTravel = () => {
    // measure where the card's real brand sits and aim the flying
    // logo/wordmark at those exact rects
    const icon = cardIconRef.current?.getBoundingClientRect();
    const word = cardWordRef.current?.getBoundingClientRect();
    const fi = flyIconRef.current;
    const fw = flyWordRef.current;
    if (icon && fi) {
      fi.style.setProperty("--tx", `${icon.left + icon.width / 2 - window.innerWidth / 2}px`);
      fi.style.setProperty("--ty", `${icon.top + icon.height / 2 - window.innerHeight * 0.45}px`);
      fi.style.setProperty("--ts", `${icon.width / 150}`);
    }
    if (word && fw) {
      fw.style.setProperty("--tx", `${word.left + word.width / 2 - (window.innerWidth / 2 + 92 + 110)}px`);
      fw.style.setProperty("--ty", `${word.top + word.height / 2 - window.innerHeight * 0.45}px`);
      fw.style.setProperty("--tw", `${word.width}px`);
    }
    setPhase("travel");
  };

  const finish = () => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setPhase("done");
  };

  const skip = () => {
    timersRef.current.forEach(clearTimeout);
    finish();
  };

  // starfield + city lights — identical technique to the original intro
  useEffect(() => {
    const wrap = starWrapRef.current;
    if (wrap) {
      wrap.innerHTML = "";
      for (let i = 0; i < 80; i++) {
        const s = document.createElement("div");
        s.className = "tx-star";
        const size = Math.random() * 2 + 0.5;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 72}%`;
        s.style.animationDelay = `${Math.random() * 3}s`;
        wrap.appendChild(s);
      }
    }
    const lights = cityLightsRef.current;
    if (lights) {
      lights.innerHTML = "";
      const R = 130;
      const addLight = (xVw: number, depthVw: number, bright: boolean) => {
        const drop = R - Math.sqrt(R * R - xVw * xVw);
        const d = document.createElement("div");
        d.className = "tx-city-light";
        const size = bright ? Math.random() * 1.6 + 1.1 : Math.random() * 1.1 + 0.6;
        d.style.width = `${size}px`;
        d.style.height = `${size}px`;
        const warm = Math.random() > 0.25;
        d.style.background = warm ? "rgba(255,205,130,.9)" : "rgba(220,230,255,.85)";
        d.style.boxShadow = warm ? "0 0 4px rgba(255,190,110,.7)" : "0 0 4px rgba(190,210,255,.6)";
        d.style.left = `calc(130vw + ${xVw}vw)`;
        d.style.top = `${drop + depthVw}vw`;
        d.style.animationDelay = `${Math.random() * 4}s`;
        lights.appendChild(d);
      };
      const clusters = [
        { x: -36, n: 16 }, { x: -28, n: 12 }, { x: -21, n: 10 },
        { x: -6, n: 18 }, { x: 1, n: 14 }, { x: 7, n: 10 },
        { x: 25, n: 16 }, { x: 33, n: 14 }, { x: 40, n: 10 },
        { x: -19, n: 6 }, { x: 15, n: 5 }, { x: 46, n: 5 },
      ];
      clusters.forEach((c) => {
        for (let i = 0; i < c.n; i++) {
          const spread = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
          addLight(c.x + spread * 7, 0.9 + Math.random() * 3.4, Math.random() > 0.6);
        }
      });
      for (let i = 0; i < 26; i++) {
        addLight(Math.random() * 92 - 46, 0.8 + Math.random() * 4, false);
      }
    }
  }, []);

  const signIn = async () => {
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  const cinematic = phase !== "done";
  const travelling = phase === "travel";

  return (
    <div className="lg-root">
      {/* ---- persistent space backdrop (stays after the intro) ---- */}
      <div className="lg-stars-static" ref={cinematic ? undefined : starWrapRef} />
      <div className="lg-earth-glow" />

      {/* ---- the login card — hidden until the portal opens ---- */}
      <div className={`lg-card ${phase === "done" ? "lg-card-open" : "lg-card-hidden"}`}>
        <div className="lg-brand">
          <img ref={cardIconRef} src={threxaIcon} alt="" className="lg-icon" />
          <img ref={cardWordRef} src={threxaWordmark} alt="THREXA" className="lg-wordmark" />
        </div>
        <p className="lg-tagline lg-cascade" style={{ "--i": 0 } as React.CSSProperties}>Manufacturing ERP</p>

        <div className="lg-fields">
          <label className="lg-label lg-cascade" style={{ "--i": 1 } as React.CSSProperties} htmlFor="lg-email">Email</label>
          <input
            id="lg-email"
            className="lg-input lg-cascade"
            style={{ "--i": 2 } as React.CSSProperties}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />

          <label className="lg-label lg-cascade" style={{ "--i": 3 } as React.CSSProperties} htmlFor="lg-password">Password</label>
          <input
            id="lg-password"
            className="lg-input lg-cascade"
            style={{ "--i": 4 } as React.CSSProperties}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />

          {error && <p className="lg-error">{error}</p>}

          <button className="lg-btn lg-cascade" style={{ "--i": 5 } as React.CSSProperties} onClick={signIn} disabled={busy}>
            {busy ? (
              <span className="lg-btn-busy">
                <span className="lg-spinner" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <p className="lg-footnote lg-cascade" style={{ "--i": 6 } as React.CSSProperties}>
          Accounts are created by the administrator.
        </p>
      </div>

      <p className={`lg-credit ${phase === "done" ? "lg-credit-show" : ""}`}>
        Threxa ERP · Smart Packaging Solutions
      </p>

      {/* ================= THE CONTINUOUS SHOT ================= */}
      {cinematic && (
        <>
          <div className={`tx-scene ${travelling ? "tx-scene-dim" : ""}`}>
            <div className="tx-starfield" ref={starWrapRef} />
            <div className="tx-earth">
              <div className="tx-continents">
                <svg viewBox="0 0 1000 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="txLandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(58,92,74,.34)" />
                      <stop offset="100%" stopColor="rgba(30,52,48,.10)" />
                    </linearGradient>
                    <linearGradient id="txLandGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(78,86,60,.30)" />
                      <stop offset="100%" stopColor="rgba(40,48,38,.08)" />
                    </linearGradient>
                  </defs>
                  <g className="tx-landmass">
                    <path fill="url(#txLandGrad)" d="M60,52 C110,34 170,30 226,44 C270,55 300,80 292,108 C280,140 220,152 160,146 C100,140 48,120 44,92 C41,72 44,58 60,52 Z" />
                    <path fill="url(#txLandGrad2)" d="M360,40 C420,24 500,26 552,46 C596,63 610,92 588,116 C560,146 480,154 416,142 C368,133 336,110 336,84 C336,62 342,46 360,40 Z" />
                    <path fill="url(#txLandGrad)" d="M545,110 C570,104 600,110 612,126 C622,140 610,152 588,154 C562,156 540,146 536,132 C533,121 536,113 545,110 Z" />
                    <path fill="url(#txLandGrad2)" d="M700,50 C760,32 840,34 896,54 C936,69 950,96 930,120 C904,150 820,158 756,146 C706,136 676,112 678,86 C679,66 686,55 700,50 Z" />
                    <ellipse fill="url(#txLandGrad)" cx="310" cy="120" rx="20" ry="8" />
                    <ellipse fill="url(#txLandGrad2)" cx="650" cy="128" rx="16" ry="6" />
                    <ellipse fill="url(#txLandGrad)" cx="965" cy="110" rx="18" ry="7" />
                  </g>
                </svg>
              </div>
              <div ref={cityLightsRef} />
            </div>
            <div className="tx-trail" />
            <div className="tx-horizon-flash" />
            <div className="tx-sunrise">
              <div className="tx-sun-bloom" />
              <div className="tx-sun-streak" />
              <div className="tx-sun-halo" />
              <div className="tx-sun-core" />
            </div>
            <div className="tx-energy-sphere" />
          </div>

          {/* the official logo — born from the sphere, then flies INTO the card */}
          <div ref={flyIconRef} className={`tx-logo-icon ${travelling ? "tx-fly" : ""}`}>
            <img src={threxaIcon} alt="Threxa" />
            <div className="tx-star-glint tx-g1" />
            <div className="tx-star-glint tx-g2" />
          </div>

          <div className="tx-word-streak" />
          <div ref={flyWordRef} className={`tx-wordmark ${travelling ? "tx-fly" : ""}`}>
            <img src={threxaWordmark} alt="THREXA" />
          </div>

          <button className="tx-skip" onClick={skip}>Skip ›</button>
        </>
      )}

      <style>{`
        .lg-root{
          position:fixed; inset:0; background:#05060A;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }

        /* ---------- persistent backdrop ---------- */
        .lg-stars-static{ position:absolute; inset:0; }
        .lg-root .tx-star{ position:absolute; background:#fff; border-radius:50%; opacity:.5;
          animation: txTwinkle 3.4s ease-in-out infinite; }
        @keyframes txTwinkle{ 0%,100%{opacity:.12;} 50%{opacity:.75;} }

        .lg-earth-glow{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%, rgba(16,42,88,.9) 0%, rgba(7,16,40,.92) 45%, rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.55),
            0 -8px 34px rgba(95,145,255,.3),
            0 -30px 120px rgba(60,100,230,.15),
            inset 0 6px 70px rgba(80,140,255,.2);
        }

        /* ---------- the card ---------- */
        .lg-card{
          position:relative; z-index:5; width:380px; max-width:calc(100vw - 40px);
          background: rgba(11,12,20,.82);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px;
          padding:40px 36px 28px;
          backdrop-filter: blur(14px);
          box-shadow:
            0 0 0 1px rgba(157,108,255,.06),
            0 24px 70px rgba(0,0,0,.55),
            0 0 90px rgba(139,92,246,.08);
        }
        /* hidden but laid out — the flying logo measures its brand rects */
        .lg-card-hidden{ opacity:0; pointer-events:none; }
        .lg-card-open{ animation: lgCardIn .55s cubic-bezier(.3,0,.2,1) both; }
        @keyframes lgCardIn{
          from{ opacity:0; transform:scale(.965); box-shadow:0 0 0 1px rgba(157,108,255,.35), 0 0 120px rgba(139,92,246,.25); }
          to{ opacity:1; transform:scale(1); }
        }
        /* fields cascade open after the portal forms */
        .lg-card-open .lg-cascade{
          opacity:0;
          animation: lgRise .45s cubic-bezier(.3,0,.2,1) forwards;
          animation-delay: calc(.18s + var(--i) * .07s);
        }
        @keyframes lgRise{ from{ opacity:0; transform:translateY(9px); } to{ opacity:1; transform:none; } }

        .lg-brand{ display:flex; align-items:center; justify-content:center; gap:11px; }
        .lg-icon{ width:40px; height:40px; object-fit:contain;
          filter: drop-shadow(0 0 10px rgba(157,108,255,.45)); }
        .lg-wordmark{ width:128px; display:block; }
        /* brand fades in as the flying logo lands on it */
        .lg-card-hidden .lg-brand{ opacity:0; }
        .lg-card-open .lg-brand{ opacity:1; transition:opacity .25s ease; }

        .lg-tagline{
          margin:10px 0 28px; text-align:center;
          font-size:11px; letter-spacing:.28em; text-transform:uppercase;
          color:#8b8d9e;
        }
        .lg-fields{ display:flex; flex-direction:column; }
        .lg-label{ font-size:11px; color:#9a9cad; margin:0 0 6px 2px; letter-spacing:.04em; }
        .lg-input{
          background:#12131d; border:1px solid rgba(255,255,255,.09); border-radius:10px;
          color:#fff; font-size:14px; padding:11px 14px; margin-bottom:16px;
          outline:none; width:100%;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .lg-input::placeholder{ color:#585a6b; }
        .lg-input:focus{
          border-color: rgba(157,108,255,.55); background:#151625;
          box-shadow: 0 0 0 3px rgba(139,92,246,.13);
        }
        .lg-error{
          margin:-6px 0 14px; font-size:12px; color:#f87171;
          background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.22);
          border-radius:8px; padding:8px 12px;
        }
        .lg-btn{
          background: linear-gradient(135deg, #7C5CFF 0%, #5B7CFA 100%);
          color:#fff; font-size:14px; font-weight:600;
          border:none; border-radius:10px; padding:12px 14px; cursor:pointer; width:100%;
          transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
          box-shadow: 0 6px 22px rgba(124,92,255,.28);
        }
        .lg-btn:hover:not(:disabled){
          filter:brightness(1.08); box-shadow: 0 8px 30px rgba(124,92,255,.4);
          transform: translateY(-1px);
        }
        .lg-btn:active:not(:disabled){ transform: translateY(0); }
        .lg-btn:disabled{ opacity:.6; cursor:not-allowed; }
        .lg-btn-busy{ display:inline-flex; align-items:center; gap:9px; justify-content:center; }
        .lg-spinner{
          width:14px; height:14px; border-radius:50%;
          border:2px solid rgba(255,255,255,.35); border-top-color:#fff;
          animation: lgSpin .7s linear infinite;
        }
        @keyframes lgSpin{ to{ transform:rotate(360deg); } }
        .lg-footnote{ margin:22px 0 0; text-align:center; font-size:11px; color:#6b6d7e; }
        .lg-credit{
          position:absolute; bottom:26px; left:0; right:0; text-align:center;
          font-size:11px; color:#4c4e5e; letter-spacing:.06em; opacity:0;
        }
        .lg-credit-show{ opacity:1; transition:opacity .6s ease .5s; }

        /* ================= THE CONTINUOUS SHOT ================= */
        .tx-scene{ position:fixed; inset:0; z-index:10; background:#05060A; }
        .tx-scene-dim{ animation: txSceneFadeOut .7s ease .1s forwards; }
        @keyframes txSceneFadeOut{ to{ opacity:0; pointer-events:none; } }

        .tx-starfield{ position:absolute; inset:0; opacity:0; animation: txFadeIn .6s ease forwards; }
        @keyframes txFadeIn{ to{ opacity:1; } }

        .tx-earth{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw; margin-left:-130vw;
          border-radius:50%;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%, rgba(16,42,88,.9) 0%, rgba(7,16,40,.92) 45%, rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.6),
            0 -8px 34px rgba(95,145,255,.3),
            0 -30px 120px rgba(60,100,230,.15),
            inset 0 6px 70px rgba(80,140,255,.2);
          opacity:0; animation: txFadeIn .6s ease .6s forwards;
          overflow:hidden;
        }
        .tx-continents{ position:absolute; left:80vw; top:0; width:100vw; height:16vw; }
        .tx-continents svg{ width:100%; height:100%; display:block; }
        .tx-landmass{ filter: blur(3px); }
        .tx-earth .tx-city-light{ position:absolute; border-radius:50%; animation: txCityTwinkle 4s ease-in-out infinite; }
        @keyframes txCityTwinkle{ 0%,100%{ opacity:.35; } 50%{ opacity:.85; } }

        .tx-trail{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw; margin-left:-130vw;
          border-radius:50%;
          box-shadow: 0 -1px 0 rgba(157,108,255,.85), 0 -4px 16px rgba(139,92,246,.4);
          clip-path: inset(-40px 100% 90% 0);
          opacity:0;
          animation: txTrailGrow 2s cubic-bezier(.45,0,.25,1) 1.2s forwards, txTrailFade .4s ease 3.85s forwards;
        }
        @keyframes txTrailGrow{
          0%{ opacity:0; clip-path: inset(-40px 100% 90% 0); }
          12%{ opacity:.9; }
          100%{ opacity:.9; clip-path: inset(-40px 50% 90% 0); }
        }
        @keyframes txTrailFade{ to{ opacity:0; } }

        .tx-sunrise{
          position:absolute; left:50%; top:78vh; width:0; height:0;
          opacity:0;
          animation: txSunriseTravel 2s cubic-bezier(.4,.05,.3,1) 1.2s forwards,
                     txSunriseBreathe .65s ease-in-out 3.2s 1,
                     txSunriseCollapse .4s cubic-bezier(.6,0,.8,1) 3.85s forwards;
        }
        .tx-sun-core{
          position:absolute; left:-13px; top:-13px; width:26px; height:26px; border-radius:50%;
          background: radial-gradient(circle, #ffffff 0%, #fff8ec 55%, rgba(255,240,215,0) 100%);
          box-shadow: 0 0 10px 3px rgba(255,255,255,.95), 0 0 30px 10px rgba(255,235,200,.6);
          mix-blend-mode:screen;
        }
        .tx-sun-halo{
          position:absolute; left:-80px; top:-80px; width:160px; height:160px; border-radius:50%;
          background: radial-gradient(circle, rgba(255,236,205,.75) 0%, rgba(255,214,165,.32) 42%, rgba(255,200,150,0) 72%);
          mix-blend-mode:screen;
        }
        .tx-sun-bloom{
          position:absolute; left:-230px; top:-230px; width:460px; height:460px; border-radius:50%;
          background: radial-gradient(circle, rgba(200,180,255,.22) 0%, rgba(150,130,255,.12) 45%, rgba(140,120,255,0) 75%);
          mix-blend-mode:screen;
        }
        .tx-sun-streak{
          position:absolute; left:-280px; top:-1.5px; width:560px; height:3px;
          background: linear-gradient(90deg, rgba(255,240,220,0) 0%, rgba(255,244,228,.85) 50%, rgba(255,240,220,0) 100%);
          filter: blur(1.5px); mix-blend-mode:screen;
        }
        @keyframes txSunriseTravel{
          0%   { transform: translate(-44vw, 7.66vw) scale(.16); opacity:0; }
          8%   { opacity:.55; }
          18%  { transform: translate(-36vw, 5.07vw) scale(.3);  opacity:.7; }
          36%  { transform: translate(-28vw, 3.04vw) scale(.45); opacity:.8; }
          54%  { transform: translate(-20vw, 1.55vw) scale(.6);  opacity:.88; }
          72%  { transform: translate(-13vw, 0.65vw) scale(.75); opacity:.94; }
          88%  { transform: translate(-6vw, 0.14vw) scale(.9);   opacity:.98; }
          100% { transform: translate(0vw, 0vw) scale(1); opacity:1; }
        }
        @keyframes txSunriseBreathe{ 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(0,0) scale(1.05); } }
        @keyframes txSunriseCollapse{
          0%{ transform: translate(0,0) scale(1); }
          100%{ transform: translate(0,-33vh) scale(.10); opacity:1; }
        }

        .tx-horizon-flash{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw; margin-left:-130vw;
          border-radius:50%;
          box-shadow: 0 -3px 34px rgba(200,190,255,.55), 0 -14px 110px rgba(140,150,255,.35);
          opacity:0;
          animation: txFlash .35s ease 3.68s 1;
        }
        @keyframes txFlash{ 0%{opacity:0;} 40%{opacity:1;} 100%{opacity:0;} }

        .tx-energy-sphere{
          position:absolute; left:50%; top:45vh; width:56px; height:56px; margin-left:-28px; margin-top:-28px;
          border-radius:50%;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,175,255,.85) 35%, rgba(139,92,246,.4) 60%, rgba(139,92,246,0) 80%);
          box-shadow: 0 0 14px 4px rgba(255,255,255,.7), 0 0 44px 14px rgba(157,108,255,.4);
          mix-blend-mode:screen;
          opacity:0;
          animation:
            txSphereIn .12s ease 4.22s forwards,
            txSpherePulse .3s ease-in-out 4.3s 1,
            txSphereBirth .75s cubic-bezier(.4,0,.2,1) 4.55s forwards;
        }
        @keyframes txSphereIn{ to{ opacity:1; } }
        @keyframes txSpherePulse{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.35); } }
        @keyframes txSphereBirth{
          0%{ transform:scale(1); opacity:1; }
          60%{ transform:scale(3.4); opacity:.55; filter:blur(8px); }
          100%{ transform:scale(5.2); opacity:0; filter:blur(14px); }
        }

        /* THE OFFICIAL LOGO — born from the light at 4.55s */
        .tx-logo-icon{
          position:fixed; left:50%; top:45vh; width:150px; height:150px; z-index:20;
          margin-left:-75px; margin-top:-75px;
          opacity:0; transform:scale(1.5); filter:blur(14px);
          animation:
            txLogoBirth .75s cubic-bezier(.4,0,.2,1) 4.55s forwards,
            txLogoPulse 2.6s ease-in-out 6.2s infinite;
        }
        @keyframes txLogoBirth{
          0%{ opacity:0; transform:scale(1.5); filter:blur(14px); }
          35%{ opacity:.6; }
          100%{ opacity:1; transform:scale(1); filter:blur(0px); }
        }
        @keyframes txLogoPulse{
          0%,100%{ filter: drop-shadow(0 0 7px rgba(157,108,255,.4)); }
          50%{ filter: drop-shadow(0 0 15px rgba(157,108,255,.7)); }
        }
        .tx-logo-icon img{ width:100%; height:100%; object-fit:contain; display:block; }

        /* travel INTO the card's brand position (vars set at runtime) */
        .tx-logo-icon.tx-fly{
          animation: txIconToCard .8s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes txIconToCard{
          to{ transform: translate(var(--tx,0), var(--ty,0)) scale(var(--ts,.27)); opacity:0; }
        }

        .tx-star-glint{ position:absolute; width:10px; height:10px; opacity:0; mix-blend-mode:screen;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,170,255,.7) 40%, rgba(157,108,255,0) 75%);
          border-radius:50%; filter: blur(.5px);
          animation: txGlintPop .3s ease forwards, txGlintTwinkle 1.7s ease-in-out infinite; }
        .tx-star-glint.tx-g1{ left:76%; top:27%; animation-delay:5.25s, 5.55s; }
        .tx-star-glint.tx-g2{ left:87%; top:45%; width:7px; height:7px; animation-delay:5.45s, 5.75s; }
        @keyframes txGlintPop{ 0%{ opacity:0; transform:scale(0);} 100%{ opacity:1; transform:scale(1);} }
        @keyframes txGlintTwinkle{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }

        /* THREXA — projected from the logo's right side at 6.2s */
        .tx-wordmark{
          position:fixed; left:50%; top:45vh; z-index:20; width:220px;
          transform: translateY(-50%) translate(92px, 0);
          clip-path: inset(0 100% 0 0); opacity:0;
          animation: txWordProject .7s cubic-bezier(.3,0,.2,1) 6.2s forwards;
        }
        @keyframes txWordProject{
          0%{ clip-path: inset(0 100% 0 0); opacity:.9; }
          100%{ clip-path: inset(0 0% 0 0); opacity:1; }
        }
        .tx-wordmark.tx-fly{
          animation: txWordToCard .8s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes txWordToCard{
          0%{ clip-path: inset(0 0% 0 0); opacity:1; }
          100%{ clip-path: inset(0 0% 0 0);
            transform: translateY(-50%) translate(calc(92px + var(--tx,0px)), var(--ty,0px));
            width: var(--tw,128px); opacity:0; }
        }
        .tx-wordmark img{ width:100%; display:block; }

        .tx-word-streak{
          position:fixed; left:50%; top:45vh; z-index:21; width:14px; height:34px; margin-top:-17px;
          transform: translate(92px,0);
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(220,200,255,.9), rgba(255,255,255,0));
          filter: blur(3px); opacity:0; mix-blend-mode:screen;
          animation: txStreakMove .7s cubic-bezier(.3,0,.2,1) 6.2s forwards;
        }
        @keyframes txStreakMove{
          0%{ opacity:1; transform: translate(92px,0); }
          92%{ opacity:1; }
          100%{ opacity:0; transform: translate(310px,0); }
        }

        .tx-skip{
          position:fixed; top:22px; right:26px; z-index:30;
          background:rgba(255,255,255,.06); color:#9a9cad;
          border:1px solid rgba(255,255,255,.12); border-radius:999px;
          font-size:12px; padding:7px 16px; cursor:pointer;
          backdrop-filter: blur(6px);
          transition: color .2s ease, border-color .2s ease, background .2s ease;
          opacity:0; animation: txFadeIn .5s ease 1s forwards;
        }
        .tx-skip:hover{ color:#fff; border-color:rgba(157,108,255,.5); background:rgba(157,108,255,.12); }
      `}</style>
    </div>
  );
}
