import { useEffect } from "react";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Orders from "./pages/Orders";
import Dispatch from "./pages/Dispatch";
import Reports from "./pages/Reports";

// If Supabase is not configured, show error
if (!supabase) {
  function NotConfigured() {
    return (
      <div className="min-h-screen bg-[#0A0B13] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Threxa ERP</h1>

          <p className="text-gray-400 mb-6">
            Supabase has not been configured yet.
          </p>

          <p className="text-sm text-gray-500">
            Add these environment variables in Vercel:
          </p>
          <ul className="text-sm text-gray-400 mt-3 space-y-1">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    );
  }

  export default NotConfigured;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const {
          data: { session },
        } = await supabase!.auth.getSession();

        if (mounted) {
          setSession(session);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getSession();

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B13] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/dispatch" element={<Dispatch />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}
