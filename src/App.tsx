import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import ThrexaIntro from "./components/ThrexaIntro";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Quotations from "./pages/Quotations";
import Orders from "./pages/Orders";
import Production from "./pages/Production";
import Inventory from "./pages/Inventory";
import CashBook from "./pages/CashBook";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Dispatch from "./pages/Dispatch";
import Invoices from "./pages/Invoices";

/* Portal flow: the cinematic intro wraps EVERYTHING, so on first visit
   it plays over the login page — the client watches Threxa boot, then
   signs in. It plays once per browser session (sessionStorage-gated)
   and is skipped for prefers-reduced-motion. */

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <ThrexaIntro logoTarget={{ top: 18, left: 20 }}>
      {!session ? (
        <Login />
      ) : (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/production" element={<Production />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/cashbook" element={<CashBook />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </ThrexaIntro>
  );
}
