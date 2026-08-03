/* ═══════════════════════════════════════════════════════════
   LANGUAGE PICKER · desktop
   Segmented control. Shares the same LangProvider state as the
   mobile header, so switching in one place switches everywhere.
   ═══════════════════════════════════════════════════════════ */
import { Languages } from "lucide-react";
import { T } from "../ui/system";
import { useLang } from "../i18n";
import type { Lang } from "../i18n";

const OPTIONS: { value: Lang; label: string; sub: string }[] = [
  { value: "en", label: "English", sub: "Default" },
  { value: "kn", label: "ಕನ್ನಡ", sub: "Kannada" },
];

export default function LanguagePicker() {
  const { lang, setLang } = useLang();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "13px 0",
        borderBottom: `1px solid ${T.lineSoft}`,
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start", minWidth: 0 }}>
        <Languages size={16} color={T.muted} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Language</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
            Applies to the shop-floor app and operator screens
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          background: T.card2,
          border: `1px solid ${T.line}`,
          borderRadius: 9,
          padding: 3,
          gap: 3,
          flexShrink: 0,
        }}
      >
        {OPTIONS.map((o) => {
          const on = lang === o.value;
          return (
            <button
              key={o.value}
              onClick={() => setLang(o.value)}
              title={o.sub}
              style={{
                padding: "7px 15px",
                fontSize: 12.5,
                fontWeight: on ? 600 : 500,
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: on ? T.accent : "transparent",
                color: on ? "#fff" : T.sub,
                transition: "background .12s, color .12s",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
