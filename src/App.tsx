import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
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
import Demo from "./pages/Demo";

/* mobile */
import { MobileShell } from "./mobile/MobileShell";
import type { NavItem } from "./mobile/MobileShell";
import OwnerHome, { OwnerAlerts } from "./mobile/Owner";
import SupervisorHome from "./mobile/Supervisor";
import DriverHome from "./mobile/Driver";
import { LayoutDashboard, Bell, ClipboardList, Truck } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ROLES
   Set in Supabase -> Authentication -> Users -> user ->
   User Metadata:  { "role": "owner" }
   Accepted: admin | owner | supervisor | driver
   Missing metadata defaults to admin (full desktop ERP).
   ═══════════════════════════════════════════════════════════ */
export type Role = "admin" | "owner" | "supervisor" | "driver";

const roleOf = (s: Session | null): Role => {
  const r = s?.user?.user_metadata?.role;
  return r === "owner" || r === "supervisor" || r === "driver" || r === "admin" ? r : "admin";
};

const OWNER_NAV: NavItem[] = [
  { path: "/m/owner", label: "overview", icon: LayoutDashboard },
  { path: "/m/owner/alerts", label: "alerts", icon: Bell },
];
const SUPERVISOR_NAV: NavItem[] = [
  { path: "/m/supervisor", label: "jobCards", icon: ClipboardList },
];
const DRIVER_NAV: NavItem[] = [{ path: "/m/driver", label: "trips", icon: Truck }];

function NotConfigured() {
  return (
    <div className="min-h-screen bg-[#0A0B13] flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Threxa ERP</h1>
        <p className="text-gray-400 mb-6">Supabase has not been configured yet.</p>
        <p className="text-sm text-gray-500">Add these environment variables in Vercel:</p>
        <ul className="text-sm text-gray-400 mt-3 space-y-1">
          <li>VITE_SUPABASE_URL</li>
          <li>VITE_SUPABASE_ANON_KEY</li>
        </ul>
      </div>
    </div>
  );
}

/* Small-screen owners land on the phone view automatically. */
function useIsPhone() {
  const [phone, setPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const fn = (e: MediaQueryListEvent) => setPhone(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return phone;
}

function MobileRoutes({ role }: { role: Role }) {
  const loc = useLocation();

  if (role === "supervisor") {
    return (
      <MobileShell roleLabel="supervisor" nav={SUPERVISOR_NAV}>
        <SupervisorHome />
      </MobileShell>
    );
  }
  if (role === "driver") {
    return (
      <MobileShell roleLabel="driver" nav={DRIVER_NAV}>
        <DriverHome />
      </MobileShell>
    );
  }
  return (
    <MobileShell roleLabel="owner" nav={OWNER_NAV}>
      {loc.pathname === "/m/owner/alerts" ? <OwnerAlerts /> : <OwnerHome />}
    </MobileShell>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const isPhone = useIsPhone();

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  if (!isSupabaseConfigured) return <NotConfigured />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B13] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) return <Login />;

  const role = roleOf(session);

  /* Floor roles never see the desktop ERP. */
  if (role === "supervisor" || role === "driver") {
    const home = role === "supervisor" ? "/m/supervisor" : "/m/driver";
    return (
      <Routes>
        <Route path="/m/*" element={<MobileRoutes role={role} />} />
        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    );
  }

  /* Admin + owner: desktop ERP, plus /m for the phone view. */
  return (
    <Routes>
      <Route path="/m" element={<Navigate to="/m/owner" replace />} />
      <Route path="/m/*" element={<MobileRoutes role="owner" />} />
      <Route
        path="*"
        element={
          role === "owner" && isPhone ? (
            <Navigate to="/m/owner" replace />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
                <Route path="/demo" element={<Demo />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )
        }
      />
    </Routes>
  );
}
