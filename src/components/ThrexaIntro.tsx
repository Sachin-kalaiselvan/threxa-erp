import { useEffect, useRef, useState } from "react";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/**
 * ThrexaIntro — ONE CONTINUOUS SHOT
 * ---------------------------------
 * The camera never cuts. Nothing is staged as separate frames.
 * The logo DOES NOT EXIST in the scene until it is born from the
 * energy sphere. Uses the official logo assets exactly — every
 * animation is opacity / transform / filter / clip-path applied to
 * the image, never a redraw.
 *
 * Continuous timeline (seconds from mount):
 *  0.0-0.6   stars fade in over black
 *  0.6-1.2   Earth silhouette fades in (bottom ~22%, thin atmosphere)
 *  1.2-3.2   sunrise begins at the FAR LEFT edge of the planet and
 *            travels along the curved horizon toward center, leaving
 *            a faint purple-blue energy trail on the limb behind it
 *  3.2-3.7   ARRIVAL — everything freezes, 500ms hold
 *  3.7-3.85  the entire horizon glows for a fraction of a second
 *  3.85-4.25 all light collapses inward into one energy sphere
 *            floating above the horizon
 *  4.25-4.55 the sphere pulses once, softly
 *  4.55-5.3  THE BIRTH — the sphere dissolves outward as the official
 *            logo condenses out of the light (blur 14->0, scale 1.5->1)
 *  5.25-5.65 the two stars glint last (additive light over the
 *            asset's real stars)
 *  5.65-6.4  hold — appreciate the logo, soft glow
 *  6.4-7.1   THREXA is projected from the RIGHT side of the logo
 *            (clip-path reveal + leading light streak — holographic)
 *  7.1-7.9   hold
 *  7.9-8.7   the logo travels to the top-left corner; energy trails
 *            sweep out and become the navbar + sidebar edges; the
 *            space scene fades, revealing the app underneath
 *  8.7+      your dashboard (children) finishes constructing
 *
 * The Earth persists for the whole shot. There is no checklist and
 * no progress bar — the flow is light -> energy -> identity -> OS.
 *
 * Usage:
 *   <ThrexaIntro logoTarget={{ top: 24, left: 32 }}>
 *     <Dashboard />
 *   </ThrexaIntro>
 *
 * Tip: stagger your dashboard's own entrance animations starting
 * around 8.6s after mount on first load (or read the exported
 * THREXA_INTRO_TOTAL_MS) so cards/charts/AI bar construct themselves
 * as the scene hands off.
 */

export const THREXA_INTRO_TOTAL_MS = 8900;

const STORAGE_KEY = "threxa_intro_played";
const T_TRAVEL = 7.9;
const T_REMOVE = 8.9;

interface LogoTarget {
  top: number;
  left: number;
}

interface ThrexaIntroProps {
  children: React.ReactNode;
  logoTarget?: LogoTarget;
  forcePlay?: boolean;
}

export default function ThrexaIntro({
  children,
  logoTarget = { top: 24, left: 32 },
  forcePlay = false,
}: ThrexaIntroProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);
  const starWrapRef = useRef<HTMLDivElement>(null);
  const cityLightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const alreadyPlayed = typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY);
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || (alreadyPlayed && !forcePlay)) {
      setShowIntro(false);
      return;
    }

    setShowIntro(true);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const removeTimer = setTimeout(() => setShowIntro(false), T_REMOVE * 1000);
    return () => clearTimeout(removeTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showIntro || !starWrapRef.current) return;
    const wrap = starWrapRef.current;
    wrap.innerHTML = "";
    for (let i = 0; i < 80; i++) {
      const s = document.createElement("div");
      s.className = "tx-star";
      const size = Math.random() * 2 + 0.5;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 72}%`; // keep stars above the Earth
      s.style.animationDelay = `${Math.random() * 3}s`;
      wrap.appendChild(s);
    }

    // city lights — clustered on the continents like real night-side Earth.
    // cluster x centers (vw offsets from screen center) sit inside the
    // continent shapes above. drop(x) = 130 - sqrt(130^2 - x^2) [vw]
    if (cityLightsRef.current) {
      const lights = cityLightsRef.current;
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
        { x: -36, n: 16 }, { x: -28, n: 12 }, { x: -21, n: 10 }, // western continent
        { x: -6, n: 18 }, { x: 1, n: 14 }, { x: 7, n: 10 },      // central landmass
        { x: 25, n: 16 }, { x: 33, n: 14 }, { x: 40, n: 10 },    // eastern continent
        { x: -19, n: 6 }, { x: 15, n: 5 }, { x: 46, n: 5 },      // islands / coasts
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
  }, [showIntro]);

  if (!mounted) return null;

  return (
    <>
      {children}

      {showIntro && (
        <>
          {/* one continuous shot: everything lives in a single scene */}
          <div className="tx-scene">
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

          <div className="tx-trace-h" style={{ top: `${logoTarget.top + 36}px` }} />
          <div className="tx-trace-v" style={{ left: `${logoTarget.left + 188}px` }} />

          {/* official logo — invisible until born from the sphere */}
          <div
            className="tx-logo-icon"
            style={
              {
                "--tx-target-top": `${logoTarget.top + 13}px`,
                "--tx-target-left": `${logoTarget.left + 13}px`,
              } as React.CSSProperties
            }
          >
            <img src={threxaIcon} alt="Threxa" />
            <div className="tx-star-glint tx-g1" />
            <div className="tx-star-glint tx-g2" />
          </div>

          <div className="tx-word-streak" />
          <div
            className="tx-wordmark"
            style={
              {
                "--tx-target-top": `${logoTarget.top + 13}px`,
                "--tx-target-left": `${logoTarget.left + 46}px`,
              } as React.CSSProperties
            }
          >
            <img src={threxaWordmark} alt="THREXA" />
          </div>
        </>
      )}

      <style>{`
        .tx-scene{ position:fixed; inset:0; z-index:10; background:#05060A;
          animation: txSceneFadeOut .6s ease 8.5s forwards; }
        @keyframes txSceneFadeOut{ to{ opacity:0; pointer-events:none; } }

        .tx-starfield{ position:absolute; inset:0; opacity:0; animation: txFadeIn .6s ease forwards; }
        .tx-scene .tx-star{ position:absolute; background:#fff; border-radius:50%; opacity:.5;
          animation: txTwinkle 3.4s ease-in-out infinite; }
        @keyframes txFadeIn{ to{ opacity:1; } }
        @keyframes txTwinkle{ 0%,100%{opacity:.12;} 50%{opacity:.75;} }

        /* Earth — persistent, bottom ~22%. Sized in vw so limb curvature is
           identical on every screen (radius = 130vw, matching the sunrise math).
           Reads as Earth: deep blue night side, BLUE atmospheric rim,
           faint continent mottling, sparse warm city lights. */
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
        /* continents — soft landmass silhouettes below the limb.
           wrapper spans the visible viewport (earth-local 80vw..180vw). */
        .tx-continents{
          position:absolute; left:80vw; top:0; width:100vw; height:16vw;
        }
        .tx-continents svg{ width:100%; height:100%; display:block; }
        .tx-landmass{ filter: blur(3px); }
        .tx-earth .tx-city-light{
          position:absolute; border-radius:50%;
          animation: txCityTwinkle 4s ease-in-out infinite;
        }
        @keyframes txCityTwinkle{ 0%,100%{ opacity:.35; } 50%{ opacity:.85; } }

        /* faint energy trail on the limb, revealed behind the travelling light */
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

        /* the travelling sunrise — layered cinematic composite.
           One wrapper carries the travel/collapse keyframes; four light
           layers ride inside: sharp core, warm halo, wide atmospheric
           bloom, thin anamorphic streak hugging the horizon. Sharp core
           + soft falloff reads "high-res" instead of a blurred blob.
           drop(x) = 130 - sqrt(130^2 - x^2) [vw], same math as the Earth. */
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
        /* the hold breathes very slightly so the freeze feels alive, not stuck */
        @keyframes txSunriseBreathe{ 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(0,0) scale(1.05); } }
        @keyframes txSunriseCollapse{
          0%{ transform: translate(0,0) scale(1); }
          100%{ transform: translate(0,-33vh) scale(.10); opacity:1; }
        }

        /* the entire horizon glows for a fraction of a second at arrival */
        .tx-horizon-flash{
          position:absolute; left:50%; top:78vh; width:260vw; height:260vw; margin-left:-130vw;
          border-radius:50%;
          box-shadow: 0 -3px 34px rgba(200,190,255,.55), 0 -14px 110px rgba(140,150,255,.35);
          opacity:0;
          animation: txFlash .35s ease 3.68s 1;
        }
        @keyframes txFlash{ 0%{opacity:0;} 40%{opacity:1;} 100%{opacity:0;} }

        /* the energy sphere — pulses once, then dissolves as the logo is born */
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

        /* THE OFFICIAL LOGO — nonexistent until 4.55s, then condenses from light */
        .tx-logo-icon{
          position:fixed; left:50%; top:45vh; width:150px; height:150px; z-index:20;
          margin-left:-75px; margin-top:-75px;
          opacity:0; transform:scale(1.5); filter:blur(14px);
          animation:
            txLogoBirth .75s cubic-bezier(.4,0,.2,1) 4.55s forwards,
            txLogoPulse 2.6s ease-in-out 6.2s infinite,
            txIconTravel .8s cubic-bezier(.4,0,.2,1) ${T_TRAVEL}s forwards,
            txIconHandoff .2s ease ${T_TRAVEL + 0.8}s forwards;
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
        @keyframes txIconTravel{
          to{ transform: translate(calc(var(--tx-target-left) - 50vw), calc(var(--tx-target-top) - 45vh)) scale(.19); }
        }
        @keyframes txIconHandoff{ to{ opacity:0; } }
        .tx-logo-icon img{ width:100%; height:100%; object-fit:contain; display:block; }

        /* the two stars glint LAST */
        .tx-star-glint{ position:absolute; width:10px; height:10px; opacity:0; mix-blend-mode:screen;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,170,255,.7) 40%, rgba(157,108,255,0) 75%);
          border-radius:50%; filter: blur(.5px);
          animation: txGlintPop .3s ease forwards, txGlintTwinkle 1.7s ease-in-out infinite; }
        .tx-star-glint.tx-g1{ left:76%; top:27%; animation-delay:5.25s, 5.55s; }
        .tx-star-glint.tx-g2{ left:87%; top:45%; width:7px; height:7px; animation-delay:5.45s, 5.75s; }
        @keyframes txGlintPop{ 0%{ opacity:0; transform:scale(0);} 100%{ opacity:1; transform:scale(1);} }
        @keyframes txGlintTwinkle{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }

        /* THREXA — holographically projected from the logo's right side */
        .tx-wordmark{
          position:fixed; left:50%; top:45vh; z-index:20; width:220px;
          transform: translateY(-50%) translate(92px, 0);
          clip-path: inset(0 100% 0 0); opacity:0;
          animation:
            txWordProject .7s cubic-bezier(.3,0,.2,1) 6.4s forwards,
            txWordTravel .8s cubic-bezier(.4,0,.2,1) ${T_TRAVEL}s forwards,
            txWordHandoff .2s ease ${T_TRAVEL + 0.8}s forwards;
        }
        @keyframes txWordProject{
          0%{ clip-path: inset(0 100% 0 0); opacity:.9; }
          100%{ clip-path: inset(0 0% 0 0); opacity:1; }
        }
        @keyframes txWordTravel{
          to{ transform: translateY(-50%) translate(calc(var(--tx-target-left) - 50vw), calc(var(--tx-target-top) - 45vh)); width:100px; }
        }
        @keyframes txWordHandoff{ to{ opacity:0; } }
        .tx-wordmark img{ width:100%; display:block; }

        .tx-word-streak{
          position:fixed; left:50%; top:45vh; z-index:21; width:14px; height:34px; margin-top:-17px;
          transform: translate(92px,0);
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(220,200,255,.9), rgba(255,255,255,0));
          filter: blur(3px); opacity:0; mix-blend-mode:screen;
          animation: txStreakMove .7s cubic-bezier(.3,0,.2,1) 6.4s forwards;
        }
        @keyframes txStreakMove{
          0%{ opacity:1; transform: translate(92px,0); }
          92%{ opacity:1; }
          100%{ opacity:0; transform: translate(310px,0); }
        }

        /* energy trails left by the moving logo -> navbar + sidebar */
        .tx-trace-h{ position:fixed; left:0; width:100vw; height:1px; z-index:15;
          background:linear-gradient(90deg, #9D6CFF, rgba(157,108,255,0)); transform-origin:left center;
          transform:scaleX(0); animation: txTraceH .5s ease 8.35s forwards; }
        @keyframes txTraceH{ to{ transform:scaleX(1); } }
        .tx-trace-v{ position:fixed; top:0; width:1px; height:100vh; z-index:15;
          background:linear-gradient(180deg, #9D6CFF, rgba(157,108,255,0)); transform-origin:top center;
          transform:scaleY(0); animation: txTraceV .5s ease 8.35s forwards; }
        @keyframes txTraceV{ to{ transform:scaleY(1); } }

        @media (prefers-reduced-motion: reduce){
          .tx-scene, .tx-logo-icon, .tx-wordmark, .tx-trace-h, .tx-trace-v, .tx-word-streak{ display:none; }
        }
      `}</style>
    </>
  );
}
