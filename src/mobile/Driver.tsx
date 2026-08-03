/* ═══════════════════════════════════════════════════════════
   THREXA MOBILE · DRIVER
   Today's trips. Start trip → deliver → attach POD photo.
   Photo capture uses the native camera via <input capture>.
   ═══════════════════════════════════════════════════════════ */
import { useState, useRef } from "react";
import { M, MCard, MBadge, MBtn, SectionTitle } from "./MobileShell";
import { useLang } from "../i18n";
import type { TKey } from "../i18n";
import { Truck, Camera, Check, MapPin } from "lucide-react";

type TripStatus = "Pending" | "In Transit" | "Delivered";

interface Trip {
  id: string;
  challan: string;
  customer: string;
  address: string;
  qty: string;
  vehicle: string;
  time: string;
  status: TripStatus;
  pod?: string;
}

const SEED: Trip[] = [
  { id: "1", challan: "CH-4809", customer: "FreshMart Retail", address: "Peenya Industrial Area, Phase 2, Bengaluru", qty: "1,800 boxes", vehicle: "KA03LM9012", time: "13:30", status: "In Transit" },
  { id: "2", challan: "CH-4810", customer: "Bright Retail Chain", address: "Bommasandra Industrial Area, Bengaluru", qty: "2,400 boxes", vehicle: "KA03LM9012", time: "15:00", status: "Pending" },
  { id: "3", challan: "CH-4811", customer: "Super Pack Industries", address: "Jigani Link Road, Anekal Taluk", qty: "1,500 boxes", vehicle: "KA03LM9012", time: "17:00", status: "Pending" },
  { id: "4", challan: "CH-4804", customer: "Rajesh Enterprises", address: "Dabaspet Industrial Area, Nelamangala", qty: "500 boxes", vehicle: "KA03LM9012", time: "10:20", status: "Delivered" },
];

const SC: Record<TripStatus, string> = {
  Pending: M.amber,
  "In Transit": M.blue,
  Delivered: M.green,
};

export default function DriverHome() {
  const { t } = useLang();
  const [trips, setTrips] = useState<Trip[]>(SEED);

  const setStatus = (id: string, status: TripStatus) => {
    setTrips((p) => p.map((tr) => (tr.id === id ? { ...tr, status } : tr)));
    /* TODO: supabase.from("dispatch").update({ status }).eq("id", id) */
  };

  const setPod = (id: string, dataUrl: string) => {
    setTrips((p) => p.map((tr) => (tr.id === id ? { ...tr, pod: dataUrl } : tr)));
    /* TODO: upload to supabase.storage.from("pod").upload(...) then store the path */
  };

  const active = trips.filter((tr) => tr.status !== "Delivered");
  const done = trips.filter((tr) => tr.status === "Delivered");

  return (
    <>
      <SectionTitle>{t("trips")}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {active.map((tr) => (
          <TripCard key={tr.id} trip={tr} onStatus={setStatus} onPod={setPod} />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <SectionTitle>{t("Delivered")}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {done.map((tr) => (
              <TripCard key={tr.id} trip={tr} onStatus={setStatus} onPod={setPod} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function TripCard({
  trip,
  onStatus,
  onPod,
}: {
  trip: Trip;
  onStatus: (id: string, s: TripStatus) => void;
  onPod: (id: string, d: string) => void;
}) {
  const { t } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPod(trip.id, String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <MCard pad={14}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: M.text }}>{trip.customer}</div>
          <div style={{ fontSize: 11, color: M.muted, marginTop: 3 }}>
            {t("challan")} {trip.challan} · {trip.time}
          </div>
        </div>
        <MBadge label={t(trip.status as TKey)} color={SC[trip.status]} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 7,
          alignItems: "flex-start",
          margin: "11px 0 9px",
          fontSize: 12,
          color: M.sub,
          lineHeight: 1.45,
        }}
      >
        <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
        {trip.address}
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          fontSize: 11,
          color: M.muted,
          paddingBottom: 12,
          borderBottom: `1px solid ${M.line}`,
        }}
      >
        <span>
          {t("qty")}: {trip.qty}
        </span>
        <span>
          {t("vehicle")}: {trip.vehicle}
        </span>
      </div>

      {trip.pod && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: M.muted, marginBottom: 6 }}>{t("pod")}</div>
          <img
            src={trip.pod}
            alt="POD"
            style={{
              width: "100%",
              maxHeight: 180,
              objectFit: "cover",
              borderRadius: 9,
              border: `1px solid ${M.line}`,
            }}
          />
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pickPhoto}
        style={{ display: "none" }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {trip.status === "Pending" && (
          <MBtn full variant="primary" onClick={() => onStatus(trip.id, "In Transit")}>
            <Truck size={14} /> {t("markInTransit")}
          </MBtn>
        )}
        {trip.status !== "Delivered" && (
          <>
            <MBtn full onClick={() => fileRef.current?.click()}>
              <Camera size={14} /> {trip.pod ? t("photoAttached") : t("takePhoto")}
            </MBtn>
            <MBtn
              full
              variant="success"
              disabled={!trip.pod}
              onClick={() => onStatus(trip.id, "Delivered")}
            >
              <Check size={14} /> {t("markDelivered")}
            </MBtn>
          </>
        )}
      </div>
    </MCard>
  );
}
