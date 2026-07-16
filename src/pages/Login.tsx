import { useState } from "react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="card w-[360px] p-8">
        <div className="mb-7 flex items-center justify-center gap-2.5">
          <img src={threxaIcon} alt="" className="w-[34px]" />
          <img src={threxaWordmark} alt="THREXA" className="w-[110px]" />
        </div>
        <div className="space-y-3">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button className="btn w-full" onClick={signIn} disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <p className="mt-5 text-center text-[11px] text-[#B9BAC5]">
          Accounts are created by the administrator in Supabase.
        </p>
      </div>
    </div>
  );
}
