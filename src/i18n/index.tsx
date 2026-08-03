/* ═══════════════════════════════════════════════════════════
   THREXA ERP · LANGUAGE
   English · ಕನ್ನಡ · हिंदी · தமிழ்

   TO ADD A LANGUAGE:
   1. add the code to `Lang`
   2. add an entry to LANGUAGES (shows up in the dropdown)
   3. add a dictionary object and register it in DICT
   TypeScript will list every key you missed.
   ═══════════════════════════════════════════════════════════ */
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "kn" | "hi" | "ta";

export const LANGUAGES: { value: Lang; label: string; english: string }[] = [
  { value: "en", label: "English", english: "English" },
  { value: "kn", label: "ಕನ್ನಡ", english: "Kannada" },
  { value: "hi", label: "हिंदी", english: "Hindi" },
  { value: "ta", label: "தமிழ்", english: "Tamil" },
];

const EN = {
  /* ── shell / roles ── */
  owner: "Owner",
  supervisor: "Supervisor",
  driver: "Driver",
  admin: "Admin",
  signOut: "Sign out",
  today: "Today",
  refresh: "Refresh",
  language: "Language",
  settings: "Settings",
  profile: "Profile",
  notifications: "Notifications",
  markAllRead: "Mark all read",
  saveChanges: "Save changes",

  /* ── desktop sidebar ── */
  navDashboard: "Dashboard",
  navCustomers: "Customers",
  navOrders: "Orders",
  navProduction: "Production",
  navQuotations: "Quotations",
  navInvoices: "Invoices",
  navDispatch: "Dispatch",
  navProducts: "Products",
  navInventory: "Inventory",
  navEmployees: "Employees",
  navAttendance: "Attendance",
  navPayroll: "Payroll",
  navCashBook: "Cash Book",

  /* ── desktop dashboard ── */
  goodMorning: "Good Morning",
  goodAfternoon: "Good Afternoon",
  goodEvening: "Good Evening",
  morningShift: "Morning Shift",
  eveningShift: "Evening Shift",
  nightShift: "Night Shift",
  prodTimeline: "Today's Production Timeline",
  needsAttention: "Needs Attention",
  todayWorkOrders: "Today's Work Orders",
  machineStatus: "Machine Status",
  lowStockMaterials: "Low Stock Materials",
  dispatchSchedule: "Dispatch Schedule",
  cashPosition: "Cash Position",
  recentActivity: "Recent Activity",

  /* ── settings modal ── */
  settingsSubtitle: "Language and notification preferences",
  languageHelp: "Applies to the shop-floor app and operator screens",
  operationalAlerts: "Operational alerts",
  operationalAlertsSub: "Machine faults, delayed dispatches",
  lowStockWarnings: "Low stock warnings",
  lowStockWarningsSub: "Notify when reels fall below reorder level",
  dailyDigest: "Daily email digest",
  dailyDigestSub: "Production summary at 8:00 PM",

  /* ── mobile: owner ── */
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

  /* ── mobile: supervisor ── */
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

  /* ── mobile: driver ── */
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

  /* ── statuses ── */
  Pending: "Pending",
  "In Transit": "In transit",
  Dispatched: "Dispatched",
  Delivered: "Delivered",
  "Not started": "Not started",
  Running: "Running",
  Paused: "Paused",
  Completed: "Completed",
};

export type TKey = keyof typeof EN;

const KN: Record<TKey, string> = {
  owner: "ಮಾಲೀಕ",
  supervisor: "ಮೇಲ್ವಿಚಾರಕ",
  driver: "ಚಾಲಕ",
  admin: "ನಿರ್ವಾಹಕ",
  signOut: "ಹೊರಬನ್ನಿ",
  today: "ಇಂದು",
  refresh: "ರಿಫ್ರೆಶ್",
  language: "ಭಾಷೆ",
  settings: "ಸಂಯೋಜನೆ",
  profile: "ಪ್ರೊಫೈಲ್",
  notifications: "ಅಧಿಸೂಚನೆಗಳು",
  markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ",
  saveChanges: "ಉಳಿಸಿ",

  navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  navCustomers: "ಗ್ರಾಹಕರು",
  navOrders: "ಆರ್ಡರ್‌ಗಳು",
  navProduction: "ಉತ್ಪಾದನೆ",
  navQuotations: "ಕೊಟೇಶನ್",
  navInvoices: "ಇನ್‌ವಾಯ್ಸ್",
  navDispatch: "ರವಾನೆ",
  navProducts: "ಉತ್ಪನ್ನಗಳು",
  navInventory: "ದಾಸ್ತಾನು",
  navEmployees: "ಉದ್ಯೋಗಿಗಳು",
  navAttendance: "ಹಾಜರಾತಿ",
  navPayroll: "ವೇತನ",
  navCashBook: "ನಗದು ಪುಸ್ತಕ",

  goodMorning: "ಶುಭೋದಯ",
  goodAfternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
  goodEvening: "ಶುಭ ಸಂಜೆ",
  morningShift: "ಬೆಳಗಿನ ಪಾಳಿ",
  eveningShift: "ಸಂಜೆ ಪಾಳಿ",
  nightShift: "ರಾತ್ರಿ ಪಾಳಿ",
  prodTimeline: "ಇಂದಿನ ಉತ್ಪಾದನಾ ವೇಳಾಪಟ್ಟಿ",
  needsAttention: "ಗಮನ ಅಗತ್ಯ",
  todayWorkOrders: "ಇಂದಿನ ಕೆಲಸದ ಆದೇಶಗಳು",
  machineStatus: "ಯಂತ್ರಗಳ ಸ್ಥಿತಿ",
  lowStockMaterials: "ಕಡಿಮೆ ದಾಸ್ತಾನು ಸಾಮಗ್ರಿ",
  dispatchSchedule: "ರವಾನೆ ವೇಳಾಪಟ್ಟಿ",
  cashPosition: "ನಗದು ಸ್ಥಿತಿ",
  recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",

  settingsSubtitle: "ಭಾಷೆ ಮತ್ತು ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು",
  languageHelp: "ಕಾರ್ಖಾನೆ ಆ್ಯಪ್ ಮತ್ತು ಆಪರೇಟರ್ ಪರದೆಗಳಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ",
  operationalAlerts: "ಕಾರ್ಯಾಚರಣೆ ಎಚ್ಚರಿಕೆಗಳು",
  operationalAlertsSub: "ಯಂತ್ರ ದೋಷ, ವಿಳಂಬವಾದ ರವಾನೆ",
  lowStockWarnings: "ಕಡಿಮೆ ದಾಸ್ತಾನು ಎಚ್ಚರಿಕೆ",
  lowStockWarningsSub: "ರೀಲ್ ಮಿತಿಗಿಂತ ಕಡಿಮೆಯಾದಾಗ ತಿಳಿಸಿ",
  dailyDigest: "ದೈನಂದಿನ ಇಮೇಲ್ ಸಾರಾಂಶ",
  dailyDigestSub: "ರಾತ್ರಿ 8:00ಕ್ಕೆ ಉತ್ಪಾದನಾ ಸಾರಾಂಶ",

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

const HI: Record<TKey, string> = {
  owner: "मालिक",
  supervisor: "सुपरवाइज़र",
  driver: "ड्राइवर",
  admin: "एडमिन",
  signOut: "साइन आउट",
  today: "आज",
  refresh: "रिफ्रेश",
  language: "भाषा",
  settings: "सेटिंग्स",
  profile: "प्रोफ़ाइल",
  notifications: "सूचनाएँ",
  markAllRead: "सभी पढ़ा हुआ चिह्नित करें",
  saveChanges: "सहेजें",

  navDashboard: "डैशबोर्ड",
  navCustomers: "ग्राहक",
  navOrders: "ऑर्डर",
  navProduction: "उत्पादन",
  navQuotations: "कोटेशन",
  navInvoices: "इनवॉइस",
  navDispatch: "डिस्पैच",
  navProducts: "उत्पाद",
  navInventory: "स्टॉक",
  navEmployees: "कर्मचारी",
  navAttendance: "हाज़िरी",
  navPayroll: "वेतन",
  navCashBook: "कैश बुक",

  goodMorning: "सुप्रभात",
  goodAfternoon: "नमस्कार",
  goodEvening: "शुभ संध्या",
  morningShift: "सुबह की शिफ्ट",
  eveningShift: "शाम की शिफ्ट",
  nightShift: "रात की शिफ्ट",
  prodTimeline: "आज का उत्पादन शेड्यूल",
  needsAttention: "ध्यान देने योग्य",
  todayWorkOrders: "आज के वर्क ऑर्डर",
  machineStatus: "मशीन स्थिति",
  lowStockMaterials: "कम स्टॉक सामग्री",
  dispatchSchedule: "डिस्पैच शेड्यूल",
  cashPosition: "नकद स्थिति",
  recentActivity: "हाल की गतिविधि",

  settingsSubtitle: "भाषा और सूचना सेटिंग्स",
  languageHelp: "फ़ैक्टरी ऐप और ऑपरेटर स्क्रीन पर लागू",
  operationalAlerts: "संचालन अलर्ट",
  operationalAlertsSub: "मशीन खराबी, देरी से डिस्पैच",
  lowStockWarnings: "कम स्टॉक चेतावनी",
  lowStockWarningsSub: "रील तय सीमा से कम होने पर सूचित करें",
  dailyDigest: "दैनिक ईमेल सारांश",
  dailyDigestSub: "रात 8:00 बजे उत्पादन सारांश",

  overview: "अवलोकन",
  alerts: "अलर्ट",
  revenueToday: "आज की आय",
  revenueMonth: "इस महीने",
  inProduction: "उत्पादन में",
  pendingDispatch: "डिस्पैच बाकी",
  outstanding: "बकाया",
  ordersToday: "आज के ऑर्डर",
  liveFloor: "फ़ैक्टरी स्थिति",
  recentOrders: "हाल के ऑर्डर",
  noAlerts: "कोई ध्यान देने योग्य बात नहीं।",
  running: "चालू",
  idle: "बंद",
  maintenance: "मरम्मत",

  jobCards: "जॉब कार्ड",
  start: "शुरू करें",
  pause: "रोकें",
  complete: "पूरा करें",
  qtyDone: "पूरी हुई मात्रा",
  machine: "मशीन",
  target: "लक्ष्य",
  produced: "उत्पादित",
  update: "अपडेट",
  saved: "सहेजा गया",

  trips: "ट्रिप",
  markInTransit: "ट्रिप शुरू करें",
  markDelivered: "डिलीवर हुआ",
  vehicle: "वाहन",
  challan: "चालान",
  customer: "ग्राहक",
  qty: "मात्रा",
  pod: "डिलीवरी प्रमाण",
  takePhoto: "फ़ोटो लें",
  photoAttached: "फ़ोटो जुड़ी",

  Pending: "बाकी",
  "In Transit": "रास्ते में",
  Dispatched: "डिस्पैच हुआ",
  Delivered: "डिलीवर हुआ",
  "Not started": "शुरू नहीं हुआ",
  Running: "चालू",
  Paused: "रुका हुआ",
  Completed: "पूरा हुआ",
};

const TA: Record<TKey, string> = {
  owner: "உரிமையாளர்",
  supervisor: "மேற்பார்வையாளர்",
  driver: "ஓட்டுநர்",
  admin: "நிர்வாகி",
  signOut: "வெளியேறு",
  today: "இன்று",
  refresh: "புதுப்பி",
  language: "மொழி",
  settings: "அமைப்புகள்",
  profile: "சுயவிவரம்",
  notifications: "அறிவிப்புகள்",
  markAllRead: "அனைத்தையும் படித்ததாகக் குறி",
  saveChanges: "சேமி",

  navDashboard: "டாஷ்போர்டு",
  navCustomers: "வாடிக்கையாளர்கள்",
  navOrders: "ஆர்டர்கள்",
  navProduction: "உற்பத்தி",
  navQuotations: "விலைப்புள்ளி",
  navInvoices: "விலைப்பட்டியல்",
  navDispatch: "அனுப்புதல்",
  navProducts: "பொருட்கள்",
  navInventory: "இருப்பு",
  navEmployees: "ஊழியர்கள்",
  navAttendance: "வருகை",
  navPayroll: "ஊதியம்",
  navCashBook: "பணப் புத்தகம்",

  goodMorning: "காலை வணக்கம்",
  goodAfternoon: "மதிய வணக்கம்",
  goodEvening: "மாலை வணக்கம்",
  morningShift: "காலை ஷிப்ட்",
  eveningShift: "மாலை ஷிப்ட்",
  nightShift: "இரவு ஷிப்ட்",
  prodTimeline: "இன்றைய உற்பத்தி அட்டவணை",
  needsAttention: "கவனம் தேவை",
  todayWorkOrders: "இன்றைய பணி ஆணைகள்",
  machineStatus: "இயந்திர நிலை",
  lowStockMaterials: "குறைந்த இருப்புப் பொருட்கள்",
  dispatchSchedule: "அனுப்பும் அட்டவணை",
  cashPosition: "பணநிலை",
  recentActivity: "சமீபத்திய செயல்பாடு",

  settingsSubtitle: "மொழி மற்றும் அறிவிப்பு அமைப்புகள்",
  languageHelp: "தொழிற்சாலை செயலி மற்றும் ஆபரேட்டர் திரைகளுக்குப் பொருந்தும்",
  operationalAlerts: "செயல்பாட்டு எச்சரிக்கைகள்",
  operationalAlertsSub: "இயந்திரக் கோளாறு, தாமதமான அனுப்புதல்",
  lowStockWarnings: "குறைந்த இருப்பு எச்சரிக்கை",
  lowStockWarningsSub: "ரீல் வரம்பை விடக் குறையும்போது அறிவி",
  dailyDigest: "தினசரி மின்னஞ்சல் சுருக்கம்",
  dailyDigestSub: "இரவு 8:00 மணிக்கு உற்பத்திச் சுருக்கம்",

  overview: "மேலோட்டம்",
  alerts: "எச்சரிக்கைகள்",
  revenueToday: "இன்றைய வருவாய்",
  revenueMonth: "இந்த மாதம்",
  inProduction: "உற்பத்தியில்",
  pendingDispatch: "அனுப்ப நிலுவை",
  outstanding: "நிலுவைத் தொகை",
  ordersToday: "இன்றைய ஆர்டர்கள்",
  liveFloor: "தொழிற்சாலை நிலை",
  recentOrders: "சமீபத்திய ஆர்டர்கள்",
  noAlerts: "கவனம் தேவைப்படுவது எதுவும் இல்லை.",
  running: "இயங்குகிறது",
  idle: "செயலற்ற",
  maintenance: "பராமரிப்பு",

  jobCards: "பணி அட்டைகள்",
  start: "தொடங்கு",
  pause: "இடைநிறுத்து",
  complete: "நிறைவு செய்",
  qtyDone: "முடிந்த அளவு",
  machine: "இயந்திரம்",
  target: "இலக்கு",
  produced: "உற்பத்தி",
  update: "புதுப்பி",
  saved: "சேமிக்கப்பட்டது",

  trips: "பயணங்கள்",
  markInTransit: "பயணம் தொடங்கு",
  markDelivered: "வழங்கப்பட்டது",
  vehicle: "வாகனம்",
  challan: "சலான்",
  customer: "வாடிக்கையாளர்",
  qty: "அளவு",
  pod: "வழங்கல் சான்று",
  takePhoto: "புகைப்படம் எடு",
  photoAttached: "புகைப்படம் இணைக்கப்பட்டது",

  Pending: "நிலுவையில்",
  "In Transit": "பயணத்தில்",
  Dispatched: "அனுப்பப்பட்டது",
  Delivered: "வழங்கப்பட்டது",
  "Not started": "தொடங்கவில்லை",
  Running: "இயங்குகிறது",
  Paused: "இடைநிறுத்தப்பட்டது",
  Completed: "நிறைவடைந்தது",
};

const DICT: Record<Lang, Record<TKey, string>> = { en: EN, kn: KN, hi: HI, ta: TA };

const STORE_KEY = "threxa.lang";
const isLang = (v: string | null): v is Lang =>
  v === "en" || v === "kn" || v === "hi" || v === "ta";

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
    return isLang(saved) ? saved : "en";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch {
      /* private mode — ignore */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LangCtx = {
    lang,
    setLang: setLangState,
    /* header quick-switch: cycles English <-> last non-English pick */
    toggle: () => setLangState((p) => (p === "en" ? "kn" : "en")),
    t: (k: TKey) => DICT[lang][k] ?? EN[k],
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
