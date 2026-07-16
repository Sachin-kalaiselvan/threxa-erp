import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

/**
 * Login — shares the ThrexaIntro space language so login -> intro ->
 * dashboard reads as one continuous world: same #05060A void, same
 * starfield, same purple-blue Earth limb glow along the bottom edge.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const starWrapRef = useRef<HTMLDivElement>(null);

  // lightweight starfield — same visual language as ThrexaIntro
  useEffect(() => {
    const wrap = starWrapRef.current;
    if (!wrap) return;
    wrap.innerHTML = "";
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("div");
      s.className = "lg-star";
      const size = Math.random() * 2 + 0.5;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 82}%`;
      s.style.animationDelay = `${Math.random() * 3}s`;
      wrap.appendChild(s);
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

  return (
    <div className="lg-root">
      {/* space backdrop */}
      <div className="lg-stars" ref={starWrapRef} />
      <div className="lg-earth-glow" />
      <div className="lg-nebula" />

      {/* card */}
      <div className="lg-card">
        <div className="lg-brand">
          <img src={threxaIcon} alt="" className="lg-icon" />
          <img src={threxaWordmark} alt="THREXA" className="lg-wordmark" />
        </div>
        <p className="lg-tagline">Manufacturing ERP</p>

        <div className="lg-fields">
          <label className="lg-label" htmlFor="lg-email">Email</label>
          <input
            id="lg-email"
            className="lg-input"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />

          <label className="lg-label" htmlFor="lg-password">Password</label>
          <input
            id="lg-password"
            className="lg-input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />

          {error && <p className="lg-error">{error}</p>}

          <button className="lg-btn" onClick={signIn} disabled={busy}>
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

        <p className="lg-footnote">
          Accounts are created by the administrator.
        </p>
      </div>

      <p className="lg-credit">Threxa ERP · Smart Packaging Solutions</p>

      <style>{`
        .lg-root{
          position:fixed; inset:0; background:#05060A;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden; font-family:inherit;
        }

        /* starfield */
        .lg-stars{ position:absolute; inset:0; }
        .lg-star{ position:absolute; background:#fff; border-radius:50%; opacity:.4;
          animation: lgTwinkle 3.6s ease-in-out infinite; }
        @keyframes lgTwinkle{ 0%,100%{opacity:.1;} 50%{opacity:.7;} }

        /* Earth limb glow along the bottom — echoes the intro's horizon */
        .lg-earth-glow{
          position:absolute; left:50%; bottom:-252vw; width:260vw; height:260vw;
          margin-left:-130vw; border-radius:50%;
          background:
            radial-gradient(ellipse 92% 15% at 50% 0%, rgba(16,42,88,.9) 0%, rgba(7,16,40,.92) 45%, rgba(2,4,12,1) 100%),
            #020309;
          box-shadow:
            0 -2px 0 rgba(150,195,255,.5),
            0 -8px 34px rgba(95,145,255,.28),
            0 -30px 120px rgba(60,100,230,.14);
        }

        /* soft purple nebula behind the card */
        .lg-nebula{
          position:absolute; left:50%; top:50%; width:640px; height:640px;
          transform:translate(-50%,-52%);
          background: radial-gradient(circle, rgba(139,92,246,.14) 0%, rgba(139,92,246,.05) 45%, rgba(139,92,246,0) 72%);
          pointer-events:none;
        }

        /* card */
        .lg-card{
          position:relative; width:380px; max-width:calc(100vw - 40px);
          background: rgba(11,12,20,.82);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px;
          padding:40px 36px 28px;
          backdrop-filter: blur(14px);
          box-shadow:
            0 0 0 1px rgba(157,108,255,.06),
            0 24px 70px rgba(0,0,0,.55),
            0 0 90px rgba(139,92,246,.08);
          animation: lgCardIn .55s cubic-bezier(.3,0,.2,1) both;
        }
        @keyframes lgCardIn{
          from{ opacity:0; transform:translateY(14px) scale(.98); }
          to{ opacity:1; transform:translateY(0) scale(1); }
        }

        .lg-brand{ display:flex; align-items:center; justify-content:center; gap:11px; }
        .lg-icon{ width:40px; height:40px; object-fit:contain;
          filter: drop-shadow(0 0 10px rgba(157,108,255,.45)); }
        .lg-wordmark{ width:128px; display:block; }

        .lg-tagline{
          margin:10px 0 28px; text-align:center;
          font-size:11px; letter-spacing:.28em; text-transform:uppercase;
          color:#8b8d9e;
        }

        .lg-fields{ display:flex; flex-direction:column; }
        .lg-label{
          font-size:11px; color:#9a9cad; margin:0 0 6px 2px;
          letter-spacing:.04em;
        }
        .lg-input{
          background:#12131d;
          border:1px solid rgba(255,255,255,.09);
          border-radius:10px;
          color:#fff; font-size:14px;
          padding:11px 14px; margin-bottom:16px;
          outline:none; width:100%;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .lg-input::placeholder{ color:#585a6b; }
        .lg-input:focus{
          border-color: rgba(157,108,255,.55);
          background:#151625;
          box-shadow: 0 0 0 3px rgba(139,92,246,.13);
        }

        .lg-error{
          margin:-6px 0 14px; font-size:12px; color:#f87171;
          background:rgba(248,113,113,.08);
          border:1px solid rgba(248,113,113,.22);
          border-radius:8px; padding:8px 12px;
        }

        .lg-btn{
          position:relative;
          background: linear-gradient(135deg, #7C5CFF 0%, #5B7CFA 100%);
          color:#fff; font-size:14px; font-weight:600;
          border:none; border-radius:10px;
          padding:12px 14px; cursor:pointer; width:100%;
          transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
          box-shadow: 0 6px 22px rgba(124,92,255,.28);
        }
        .lg-btn:hover:not(:disabled){
          filter:brightness(1.08);
          box-shadow: 0 8px 30px rgba(124,92,255,.4);
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

        .lg-footnote{
          margin:22px 0 0; text-align:center;
          font-size:11px; color:#6b6d7e;
        }

        .lg-credit{
          position:absolute; bottom:26px; left:0; right:0;
          text-align:center; font-size:11px; color:#4c4e5e;
          letter-spacing:.06em;
        }

        @media (prefers-reduced-motion: reduce){
          .lg-star{ animation:none; }
          .lg-card{ animation:none; }
        }
      `}</style>
    </div>
  );
}
