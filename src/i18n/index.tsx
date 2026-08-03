/* ═══════════════════════════════════════════════════════════
   THREXA ERP · LANGUAGE (English / ಕನ್ನಡ)
   Wrap the app in <LangProvider>. Call useLang() anywhere.
   Add a key to BOTH dictionaries or TypeScript will complain.
   ═══════════════════════════════════════════════════════════ */
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "kn";

const EN = {
  /* shell */
  owner: "Owner",
  supervisor: "Supervisor",
  driver: "Driver",
  signOut: "Sign out",
  today: "Today",
  refresh: "Refresh",
  language: "ಕನ್ನಡ",

  /* owner */
  overview: "Overview",
  alerts: "Alerts",
  revenueToday: "Revenue today",
  revenueMonth: "This month",
  inProduction: "In production",
  pendingDispatch: "Pending dispatch",
  outstanding: "Outstanding",
  ordersToday: "Orders today",
  liveFloor: "Live floor",
  recentOrders: "Recent orders",
  noAlerts: "Nothing needs your attention.",
  running: "Running",
  idle: "Idle",
  maintenance: "Maintenance",

  /* supervisor */
  jobCards: "Job cards",
  start: "Start",
  pause: "Pause",
  complete: "Complete",
  qtyDone: "Quantity done",
  machine: "Machine",
  target: "Target",
  produced: "Produced",
  update: "Update",
  saved: "Saved",

  /* driver */
  trips: "Trips",
  markInTransit: "Start trip",
  markDelivered: "Mark delivered",
  vehicle: "Vehicle",
  challan: "Challan",
  customer: "Customer",
  qty: "Quantity",
  pod: "Proof of delivery",
  takePhoto: "Take photo",
  photoAttached: "Photo attached",

  /* status */
  Pending: "Pending",
  "In Transit": "In transit",
  Dispatched: "Dispatched",
  Delivered: "Delivered",
  "Not started": "Not started",
  Running: "Running",
  Paused: "Paused",
  Completed: "Completed",
};

const KN: Record<keyof typeof EN, string> = {
  owner: "ಮಾಲೀಕ",
  supervisor: "ಮೇಲ್ವಿಚಾರಕ",
  driver: "ಚಾಲಕ",
  signOut: "ಹೊರಬನ್ನಿ",
  today: "ಇಂದು",
  refresh: "ರಿಫ್ರೆಶ್",
  language: "English",

  overview: "ಸಾರಾಂಶ",
  alerts: "ಎಚ್ಚರಿಕೆಗಳು",
  revenueToday: "ಇಂದಿನ ಆದಾಯ",
  revenueMonth: "ಈ ತಿಂಗಳು",
  inProduction: "ಉತ್ಪಾದನೆಯಲ್ಲಿ",
  pendingDispatch: "ರವಾನೆ ಬಾಕಿ",
  outstanding: "ಬಾಕಿ ಹಣ",
  ordersToday: "ಇಂದಿನ ಆರ್ಡರ್",
  liveFloor: "ಕಾರ್ಖಾನೆ ಸ್ಥಿತಿ",
  recentOrders: "ಇತ್ತೀಚಿನ ಆರ್ಡರ್",
  noAlerts: "ಗಮನ ಅಗತ್ಯವಿಲ್ಲ.",
  running: "ಚಾಲನೆಯಲ್ಲಿದೆ",
  idle: "ನಿಷ್ಕ್ರಿಯ",
  maintenance: "ದುರಸ್ತಿ",

  jobCards: "ಜಾಬ್ ಕಾರ್ಡ್",
  start: "ಪ್ರಾರಂಭಿಸಿ",
  pause: "ವಿರಾಮ",
  complete: "ಪೂರ್ಣಗೊಳಿಸಿ",
  qtyDone: "ಮುಗಿದ ಪ್ರಮಾಣ",
  machine: "ಯಂತ್ರ",
  target: "ಗುರಿ",
  produced: "ಉತ್ಪಾದಿಸಿದ್ದು",
  update: "ನವೀಕರಿಸಿ",
  saved: "ಉಳಿಸಲಾಗಿದೆ",

  trips: "ಪ್ರಯಾಣಗಳು",
  markInTransit: "ಪ್ರಯಾಣ ಪ್ರಾರಂಭ",
  markDelivered: "ತಲುಪಿಸಲಾಗಿದೆ",
  vehicle: "ವಾಹನ",
  challan: "ಚಲನ್",
  customer: "ಗ್ರಾಹಕ",
  qty: "ಪ್ರಮಾಣ",
  pod: "ತಲುಪಿಸಿದ ಪುರಾವೆ",
  takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
  photoAttached: "ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ",

  Pending: "ಬಾಕಿ",
  "In Transit": "ಸಾಗಣೆಯಲ್ಲಿ",
  Dispatched: "ರವಾನಿಸಲಾಗಿದೆ",
  Delivered: "ತಲುಪಿಸಲಾಗಿದೆ",
  "Not started": "ಪ್ರಾರಂಭವಾಗಿಲ್ಲ",
  Running: "ಚಾಲನೆಯಲ್ಲಿದೆ",
  Paused: "ವಿರಾಮದಲ್ಲಿ",
  Completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
};

export type TKey = keyof typeof EN;

const DICT: Record<Lang, Record<TKey, string>> = { en: EN, kn: KN };

const STORE_KEY = "threxa.lang";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: TKey) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
  t: (k) => EN[k],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORE_KEY);
    return saved === "kn" ? "kn" : "en";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch {
      /* private mode — ignore */
    }
    document.documentElement.lang = lang === "kn" ? "kn" : "en";
  }, [lang]);

  const value: LangCtx = {
    lang,
    setLang: setLangState,
    toggle: () => setLangState((p) => (p === "en" ? "kn" : "en")),
    t: (k: TKey) => DICT[lang][k] ?? EN[k],
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
