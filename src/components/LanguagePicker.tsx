/* ═══════════════════════════════════════════════════════════
   LANGUAGE PICKER · desktop
   Dropdown, driven by LANGUAGES in src/i18n. Add a language
   there and it appears here automatically.
   ═══════════════════════════════════════════════════════════ */
import { Languages, ChevronDown } from "lucide-react";
import { T } from "../ui/system";
import { useLang, LANGUAGES } from "../i18n";
import type { Lang } from "../i18n";

export default function LanguagePicker() {
  const { lang, setLang, t } = useLang();

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
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{t("language")}</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{t("languageHelp")}</div>
        </div>
      </div>

      <div style={{ position: "relative", flexShrink: 0 }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            background: T.card2,
            border: `1px solid ${T.line}`,
            borderRadius: 8,
            color: T.text,
            fontSize: 13,
            fontWeight: 500,
            padding: "9px 34px 9px 13px",
            minWidth: 168,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value} style={{ background: T.card, color: T.text }}>
              {l.value === "en" ? l.label : `${l.label} · ${l.english}`}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          color={T.muted}
          style={{
            position: "absolute",
            right: 11,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
