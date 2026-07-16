import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, Calculator, ClipboardList,
  Factory, Boxes, Wallet, ReceiptText, UserRound, CalendarCheck,
  BadgeIndianRupee, Truck, LogOut,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import threxaWordmark from "../assets/threxa-wordmark.png";

type Role = "owner" | "admin" | "production" | "dispatch" | "accounts" | "staff";

/* Navigation grouped by module. `roles` = who sees it.
   Note: this is UI-level hiding for a clean experience per role —
   real enforcement is added via RLS policies in the hardening phase. */
const sections: {
  title: string;
  items: { to: string; label: string; icon: any; roles: Role[] }[];
}[] = [
  {
    title: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["owner","admin","production","dispatch","accounts","staff"] }],
  },
  {
    title: "Sales & Documents",
    items: [
      { to: "/customers", label: "Customers", icon: Users, roles: ["owner","admin","accounts","staff"] },
      { to: "/products", label: "Box Specs", icon: Package, roles: ["owner","admin","production","staff"] },
      { to: "/quotations", label: "Quotation Calculator", icon: Calculator, roles: ["owner","admin","accounts"] },
      { to: "/invoices", label: "Invoices", icon: ReceiptText, roles: ["owner","admin","accounts"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/orders", label: "Orders", icon: ClipboardList, roles: ["owner","admin","production","dispatch","staff"] },
      { to: "/production", label: "Production", icon: Factory, roles: ["owner","admin","production"] },
      { to: "/inventory", label: "Reel Stock", icon: Boxes, roles: ["owner","admin","production"] },
      { to: "/dispatch", label: "Dispatch", icon: Truck, roles: ["owner","admin","dispatch"] },
    ],
  },
  {
    title: "Finance & People",
    items: [
      { to: "/cashbook", label: "Cash Book", icon: Wallet, roles: ["owner","admin","accounts"] },
      { to: "/employees", label: "Employees", icon: UserRound, roles: ["owner","admin"] },
      { to: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["owner","admin","production"] },
      { to: "/payroll", label: "Payroll", icon: BadgeIndianRupee, roles: ["owner","admin"] },
    ],
  },
];

export default function Layout() {
  const [role, setRole] = useState<Role>("owner");
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles").select("role, full_name").eq("id", data.user.id).single();
      if (profile) {
        setRole(profile.role as Role);
        setName(profile.full_name);
      }
    });
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-white/[.06] bg-white/[.015]">
        <div className="flex h-[60px] items-center gap-2 px-5">
          {/* this lockup sits exactly where the intro logo lands */}
          <img src={threxaIcon} alt="" className="w-[27px]" />
          <img src={threxaWordmark} alt="THREXA" className="w-[86px]" />
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {sections.map((section) => {
            const visible = section.items.filter((i) => i.roles.includes(role));
            if (visible.length === 0) return null;
            return (
              <div key={section.title} className="mb-3">
                <div className="px-5 pb-1.5 pt-2 text-[10px] font-medium uppercase tracking-wider text-[#6b6c7a]">
                  {section.title}
                </div>
                {visible.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `mx-2.5 mb-0.5 flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-[13px] ` +
                      (isActive
                        ? "bg-[rgba(157,108,255,.1)] text-white"
                        : "text-[#B9BAC5] hover:text-white")
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-white/[.06] p-3">
          {name && (
            <div className="mb-1 px-2 text-[11px] text-[#B9BAC5]">
              {name} · <span className="capitalize">{role}</span>
            </div>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-[#B9BAC5] hover:text-white"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
