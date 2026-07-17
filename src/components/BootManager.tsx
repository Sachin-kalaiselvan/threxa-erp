import { useEffect, useState } from "react";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/* ─────────────────────────────────────────────────────────────────
   BOOT MANAGER — Threxa's three emotional states, post-auth half.

   State 1 (First Impression) lives in Login.tsx: the cinematic,
   played once ever. This component owns States 2 and 3:

   State 2 — DAILY BOOT (first login of the day, ~2.6s)
     Black → emblem fades in → one pulse → soft light sweeps the
     logo → wordmark → "Initializing Workspace…" → the six engines
     check themselves in sequence → "Workspace Ready" → dashboard.
     The OS checks itself. Not a marketing replay.

   State 3 — QUICK BOOT (every other login, <1s)
     Logo → 300ms pulse → dashboard. Productivity first.

   Motion language: SYSTEM motion. Fast. Mechanical. Purposeful.
   No flourish, nothing bounces, small movements, hard easings.

   Overrides: ?boot=daily / ?boot=quick force a mode for demos.
   Click anywhere skips. Reduced-motion users boot instantly.
───────────────────────────────────────────────────────────────── */

const DATE_KEY = "threxa_boot_date";

const MODULES = [
  "CRM Engine",
  "Inventory Engine",
  "Finance Engine",
  "HR Engine",
  "Automation Engine",
  "AI Core",
];

type Mode = "daily" | "quick" | "none";

function decideMode(): Mode {
  const p = new URLSearchParams(window.location.search);
  const forced = p.get("boot");
  if (forced === "daily" || forced === "quick") return forced;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  const today = new Date().toDateString();
  return localStorage.getItem(DATE_KEY) === today ? "quick" : "daily";
}

export default function BootManager({ children }: { children: React.ReactNode }) {
  const [mode] = useState<Mode>(decideMode);
  const [booting, setBooting] = useState(mode !== "none");

  useEffect(() => {
    if (!booting) return;
    localStorage.setItem(DATE_KEY, new Date().toDateString());
    const t = window.setTimeout(
      () => setBooting(false),
      mode === "daily" ? 3050 : 900
    );
    return () => clearTimeout(t);
  }, [booting, mode]);

  return (
    <>
      {/* the app is always mounted; on reveal it rises 12px into place
          (UI motion: subtle, eased, magnetic — never bouncy) */}
      <div className={booting ? "bm-app bm-app-hidden" : "bm-app bm-app-reveal"}>
        {children}
      </div>

      {booting && (
        <div className={`bm-overlay bm-${mode}`} onClick={() => setBooting(false)}>
          <div className="bm-center">

            <div className="bm-logo-row">
              <div className="bm-icon-wrap">
                <img src={threxaIcon} className="bm-icon" alt="" />
                <div className="bm-sweep" />
              </div>
              {mode === "daily" && (
                <img src={threxaWordmark} className="bm-word" alt="THREXA" />
              )}
            </div>

            {mode === "daily" && (
              <div className="bm-panel">
                <p className="bm-init">Initializing Workspace…</p>
                <div className="bm-modules">
                  {MODULES.map((m, i) => (
                    <div
                      className="bm-mod"
                      key={m}
                      style={{ animationDelay: `${(1.02 + i * 0.15).toFixed(2)}s` }}
                    >
                      <span className="bm-check">✓</span>
                      <span className="bm-mod-name">{m}</span>
                    </div>
                  ))}
                </div>
                <p className="bm-ready">Workspace Ready</p>
              </div>
            )}
          </div>

          <style>{`
            /* ── app reveal (UI motion: 12px, eased, no bounce) ── */
            .bm-app-hidden{ opacity:0; }
            .bm-app-reveal{
              animation:bmAppRise .45s cubic-bezier(.25,.1,.25,1) both;
            }
            @keyframes bmAppRise{
              from{ opacity:0; transform:translateY(12px); }
              to  { opacity:1; transform:none; }
            }

            /* ── overlay ── */
            .bm-overlay{
              position:fixed; inset:0; z-index:100;
              background:#0A0B11;
              display:flex; align-items:center; justify-content:center;
              cursor:default;
            }
            .bm-daily{ animation:bmOverlayOut .4s ease 2.55s forwards; }
            .bm-quick{ animation:bmOverlayOut .3s ease .55s forwards; }
            @keyframes bmOverlayOut{ to{ opacity:0; pointer-events:none; } }

            .bm-center{
              display:flex; flex-direction:column; align-items:center;
            }

            /* ── logo row ── */
            .bm-logo-row{
              display:flex; align-items:center; gap:12px;
            }
            .bm-icon-wrap{
              position:relative; width:56px; height:56px;
              overflow:hidden; border-radius:12px;
            }
            .bm-icon{
              width:100%; height:100%; object-fit:contain; display:block;
              opacity:0;
              animation:
                bmFadeIn .22s ease .05s forwards,
                bmPulse  .32s ease-in-out .32s 1;
            }
            @keyframes bmFadeIn{ to{opacity:1;} }
            /* ONE pulse. System motion — mechanical, not decorative. */
            @keyframes bmPulse{
              0%,100%{ transform:scale(1); }
              50%    { transform:scale(1.045); }
            }

            /* soft blue light travels across the logo */
            .bm-sweep{
              position:absolute; top:0; bottom:0; left:-40%;
              width:34%;
              background:linear-gradient(100deg,
                transparent 0%,
                rgba(140,170,255,.22) 45%,
                rgba(170,195,255,.30) 50%,
                rgba(140,170,255,.22) 55%,
                transparent 100%);
              transform:skewX(-12deg);
              opacity:0;
              animation:bmSweep .5s cubic-bezier(.4,0,.4,1) .5s forwards;
            }
            @keyframes bmSweep{
              0%  { left:-40%; opacity:0; }
              15% { opacity:1; }
              85% { opacity:1; }
              100%{ left:110%; opacity:0; }
            }

            .bm-word{
              width:132px; display:block;
              opacity:0;
              animation:bmWordIn .28s cubic-bezier(.25,.1,.25,1) .68s forwards;
            }
            @keyframes bmWordIn{
              from{ opacity:0; transform:translateX(-6px); }
              to  { opacity:1; transform:none; }
            }

            /* quick mode: icon only, centered, done */
            .bm-quick .bm-icon-wrap{ width:64px; height:64px; }

            /* ── daily panel ── */
            .bm-panel{
              margin-top:34px;
              display:flex; flex-direction:column; align-items:center;
              min-width:220px;
            }
            .bm-init{
              margin:0 0 18px;
              font-size:12px; letter-spacing:.14em; text-transform:uppercase;
              color:rgba(255,255,255,.34);
              opacity:0;
              animation:bmFadeIn .2s ease .88s forwards;
            }
            .bm-modules{
              display:flex; flex-direction:column; gap:7px;
              font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
              font-size:12.5px;
            }
            .bm-mod{
              display:flex; align-items:center; gap:10px;
              color:rgba(255,255,255,.55);
              opacity:0;
              /* per-module delay set inline; system motion: fast, 6px, eased */
              animation:bmModIn .18s cubic-bezier(.25,.1,.25,1) forwards;
            }
            @keyframes bmModIn{
              from{ opacity:0; transform:translateY(6px); }
              to  { opacity:1; transform:none; }
            }
            .bm-check{
              color:#7C9CFF; font-weight:600; width:14px; text-align:center;
            }
            .bm-mod-name{ letter-spacing:.02em; }

            .bm-ready{
              margin:20px 0 0;
              font-size:12px; letter-spacing:.14em; text-transform:uppercase;
              color:rgba(140,170,255,.75);
              opacity:0;
              animation:bmFadeIn .25s ease 2.1s forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
