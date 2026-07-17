import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Production from "./pages/Production";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Dispatch from "./pages/Dispatch";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import CashBook from "./pages/CashBook";

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

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (mounted) setSession(session);
      })
      .catch((error) => {
        console.error("Failed to get session:", error);
        if (mounted) setSession(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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

  if (!isSupabaseConfigured) {
    return <NotConfigured />;
  }

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
    <Layout>
      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/production" element={<Production />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/cashbook" element={<CashBook />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
