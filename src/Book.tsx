/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Book.tsx — Serendipity Yacht Charter (Enhanced)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ArrowUpRight, Check, Clock, Users,
  Anchor, Star, MapPin, Phone, Lock, CreditCard,
  Ship, Utensils, Shield, ChevronDown, Calendar,
  Waves, Wind,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CharterRate {
  id: string;
  name: string;
  price: string;
  numPrice: number;
  duration: string;
  nights: string;
  guests: string;
  highlights: string[];
  popular?: boolean;
  tag?: string;
  emoji?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CHARTER_RATES: CharterRate[] = [
  {
    id: "day-trip",
    name: "Day Trip",
    price: "$10,000",
    numPrice: 10000,
    duration: "10am – 6pm",
    nights: "0",
    guests: "Up to 12",
    tag: "Most Flexible",
    emoji: "☀️",
    highlights: [
      "2 Jet Skis included",
      "16' Nautica RIB tender",
      "Local beaches & islands",
      "Restaurant stops available",
    ],
  },
  {
    id: "weekend",
    name: "Weekend Getaway",
    price: "$20,000",
    numPrice: 20000,
    duration: "Fri noon – Sun 3pm",
    nights: "2",
    guests: "Up to 8",
    popular: true,
    tag: "Most Popular",
    emoji: "🌅",
    highlights: [
      "3 days / 2 nights",
      "4 private staterooms",
      "Sarasota to Tarpon Springs",
      "Full crew included",
    ],
  },
  {
    id: "full-week",
    name: "Full Week",
    price: "$35,000",
    numPrice: 35000,
    duration: "Mon noon – Sun 3pm",
    nights: "6",
    guests: "Up to 8",
    tag: "Best Value",
    emoji: "⚓",
    highlights: [
      "7 days / 6 nights",
      "4 private staterooms",
      "Key West to Destin range",
      "Full crew & private chef",
    ],
  },
];

const SPECIAL_RATES = [
  {
    id: "corporate",
    name: "Corporate Events",
    price: "$15,000",
    numPrice: 15000,
    emoji: "🏢",
    desc: "Up to 25 guests for cocktails & hors d'oeuvres. 6-hour cruise with waterfront restaurant catering.",
  },
  {
    id: "birthday",
    name: "Birthdays & Anniversaries",
    price: "$7,500",
    numPrice: 7500,
    emoji: "🎉",
    desc: "Up to 10 guests for a 6-hour sunset cruise with themed décor, cocktails & culinary choices.",
  },
  {
    id: "culinary",
    name: "Culinary & Wine Events",
    price: "$7,500",
    numPrice: 7500,
    emoji: "🍷",
    desc: "Private chef-prepared meal for up to 8 guests on a 6-hour dinner cruise.",
  },
  {
    id: "sunset",
    name: "Sunset Cruise",
    price: "Custom",
    numPrice: 0,
    emoji: "🌇",
    desc: "Tailored pricing for a romantic sunset on the Gulf Coast. Contact us for details.",
  },
];

const VESSEL_STATS = [
  { val: "94 ft", label: "Lazzara" },
  { val: "12", label: "Max Guests" },
  { val: "4", label: "Staterooms" },
  { val: "5.0★", label: "Rating" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function navigateToPayment(data: { name: string; email: string; eventType: string; amount: string }) {
  const params = new URLSearchParams(data);
  window.location.href = `/payment?${params.toString()}`;
}

// ─── Ocean Background ─────────────────────────────────────────────────────────
function OceanBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #fdf6ec 0%, #fef9e7 35%, #fdf2d0 70%, #fef5d4 100%)" }} />
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-20%", right: "-15%",
          width: 800, height: 800,
          borderRadius: "60% 40% 70% 30% / 40% 60% 30% 70%",
          background: "radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)",
          filter: "blur(50px)"
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        style={{
          position: "absolute", bottom: "-15%", left: "-10%",
          width: 700, height: 700,
          borderRadius: "40% 60% 30% 70%",
          background: "radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(201,162,39,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.025) 1px, transparent 1px)`,
        backgroundSize: "72px 72px"
      }} />
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ["Select Package", "Your Details", "Confirm & Pay"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div
              animate={{
                background: i < step ? "linear-gradient(135deg, #c9a227, #e0bb4a)" : i === step ? "transparent" : "rgba(201,162,39,0.06)",
                borderColor: i <= step ? "#c9a227" : "rgba(201,162,39,0.15)",
              }}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid",
                fontSize: 12, fontWeight: 800, color: i < step ? "#5a3a00" : i === step ? "#c9a227" : "#b8a660",
              }}
            >
              {i < step ? <Check size={16} style={{ color: "#5a3a00" }} /> : i + 1}
            </motion.div>
            <span style={{
              fontSize: 8, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase",
              marginTop: 6, whiteSpace: "nowrap",
              color: i <= step ? "#c9a227" : "#b8a660"
            }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <motion.div
              animate={{ background: i < step ? "linear-gradient(90deg, #c9a227, #c9a227)" : "rgba(201,162,39,0.1)" }}
              style={{ flex: 1, height: 2, margin: "0 10px", marginTop: -16, borderRadius: 2, transition: "background 0.5s" }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Rate Card ────────────────────────────────────────────────────────────────
function RateCard({ rate, selected, onSelect }: { rate: CharterRate; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -8, boxShadow: selected ? "0 25px 70px rgba(201,162,39,0.2)" : "0 15px 50px rgba(90,58,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: "relative", borderRadius: 24, overflow: "hidden", cursor: "pointer",
        background: selected
          ? "linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(255,255,255,0.97) 100%)"
          : "rgba(255,255,255,0.7)",
        border: selected ? "2.5px solid #c9a227" : "1.5px solid rgba(201,162,39,0.1)",
        backdropFilter: "blur(16px)",
        boxShadow: selected ? "0 20px 60px rgba(201,162,39,0.15)" : "0 4px 20px rgba(90,58,0,0.05)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Popular Banner */}
      {rate.popular && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "linear-gradient(90deg, #5a3a00, #c9a227)",
          textAlign: "center", padding: "7px 0",
          fontSize: 9, fontWeight: 800, letterSpacing: "2px",
          textTransform: "uppercase", color: "white",
        }}>
          ⭐ Most Popular
        </div>
      )}

      {!rate.popular && rate.tag && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          fontSize: 8, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 20,
          background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.15)",
          color: "#c9a227"
        }}>
          {rate.tag}
        </div>
      )}

      <div style={{ padding: "28px 24px", paddingTop: rate.popular ? 44 : 28 }}>
        {/* Emoji + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{rate.emoji}</span>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#5a3a00", lineHeight: 1.1 }}>
              {rate.name}
            </h3>
            {selected && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 10, color: "#c9a227", fontWeight: 700 }}>
                ✓ Selected
              </motion.span>
            )}
          </div>
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "#c9a227" }}>{rate.price}</span>
          <span style={{ fontSize: 11, color: "#b8a660" }}>/charter</span>
        </div>

        {/* Meta Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {[
            { icon: <Clock size={10} />, text: rate.duration },
            { icon: <Users size={10} />, text: rate.guests },
            ...(rate.nights !== "0" ? [{ icon: <Anchor size={10} />, text: `${rate.nights} nights` }] : []),
          ].map((chip, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 20, fontSize: 10,
              background: selected ? "rgba(201,162,39,0.08)" : "rgba(90,58,0,0.05)",
              color: selected ? "#c9a227" : "#7a6230", fontWeight: 600,
              border: `1px solid ${selected ? "rgba(201,162,39,0.15)" : "rgba(90,58,0,0.06)"}`,
            }}>
              {chip.icon} {chip.text}
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rate.highlights.map((h, j) => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 6,
                background: selected ? "rgba(201,162,39,0.12)" : "rgba(90,58,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Check size={10} style={{ color: selected ? "#c9a227" : "#b8a660" }} />
              </div>
              <span style={{ fontSize: 11, color: "#7a6230" }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Special Rate Card ────────────────────────────────────────────────────────
function SpecialRateCard({ rate, selected, onSelect }: { rate: typeof SPECIAL_RATES[0]; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      whileHover={{ x: 4 }}
      style={{
        padding: "16px 18px", borderRadius: 16, cursor: "pointer",
        background: selected ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.5)",
        border: selected ? "2px solid rgba(201,162,39,0.3)" : "1.5px solid rgba(201,162,39,0.08)",
        transition: "all 0.25s ease",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
          <span style={{ fontSize: 22, lineHeight: 1.2, flexShrink: 0 }}>{rate.emoji}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              {selected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ width: 16, height: 16, borderRadius: 5, background: "#c9a227", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={9} style={{ color: "white" }} />
                </motion.div>
              )}
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#5a3a00" }}>{rate.name}</h4>
            </div>
            <p style={{ fontSize: 10, color: "#8a7840", lineHeight: 1.6 }}>{rate.desc}</p>
          </div>
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800,
          color: selected ? "#c9a227" : "#c9a227", flexShrink: 0
        }}>
          {rate.price}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Input Style Helper ───────────────────────────────────────────────────────
function useInputStyle(focused: string | null) {
  return (fieldName: string): React.CSSProperties => ({
    width: "100%",
    background: focused === fieldName ? "white" : "rgba(255,255,255,0.8)",
    border: focused === fieldName ? "2px solid #c9a227" : "1.5px solid rgba(201,162,39,0.15)",
    borderRadius: 12, padding: "12px 16px", fontSize: 13,
    color: "#5a3a00", outline: "none", transition: "all 0.2s ease",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
    boxShadow: focused === fieldName ? "0 0 0 4px rgba(201,162,39,0.08)" : "none",
  });
}

const labelStyle: React.CSSProperties = {
  fontSize: 9, fontWeight: 800, letterSpacing: "1.5px",
  textTransform: "uppercase", color: "#7a6230", display: "block", marginBottom: 6,
};

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ width: 24, height: 2, background: "linear-gradient(90deg, #c9a227, transparent)", borderRadius: 2 }} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "#c9a227" }}>{text}</span>
    </div>
  );
}

// ─── Main Book Page ───────────────────────────────────────────────────────────
export default function BookPage() {
  const [step, setStep] = useState(0);
  const [preselectedNote, setPreselectedNote] = useState<string | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [showSpecial, setShowSpecial] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = useInputStyle(focusedField);

  const allRates = [
    ...CHARTER_RATES.map((r) => ({ ...r, isSpecial: false })),
    ...SPECIAL_RATES.map((r) => ({
      ...r, isSpecial: true, duration: "", nights: "0", guests: "", highlights: [],
    })),
  ];

  const selected = allRates.find((r) => r.id === selectedRateId) ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("destination");
    const route = params.get("route");
    if (dest) setPreselectedNote(`Added to charter: ${dest}`);
    else if (route) setPreselectedNote(`Selected route: ${route}`);
  }, []);

  const handleProceedToDetails = () => {
    if (!selectedRateId) return;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigateToPayment({
        name: `${firstName} ${lastName}`, email,
        eventType: selected?.name ?? "Charter",
        amount: (selected as CharterRate)?.numPrice ? String((selected as CharterRate).numPrice) : "0",
      });
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#5a3a00", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #b8a660; }
        select option { color: #5a3a00; background: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.2); border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(4) hue-rotate(5deg); cursor: pointer; }
      `}</style>

      <OceanBackground />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "relative", zIndex: 50, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 40px",
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(201,162,39,0.08)",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <img src="assets/site-logo.png" alt="Serendipity" style={{ height: 42, width: "auto" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#8a7840", textDecoration: "none", fontWeight: 500 }}>
            <ChevronLeft size={14} /> Back to Site
          </a>
          <a href="/reservation" style={{
            padding: "8px 18px", borderRadius: 50,
            border: "1.5px solid rgba(201,162,39,0.2)", color: "#c9a227",
            fontSize: 11, fontWeight: 800, textDecoration: "none", letterSpacing: "0.5px",
            textTransform: "uppercase", transition: "all 0.2s",
          }}>
            Inquire Instead
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>
        <div style={{ position: "relative", height: 360 }}>
          <video
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            src="assets/attract_video.mp4" autoPlay muted loop playsInline
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(90,58,0,0.3) 0%, rgba(90,58,0,0.5) 50%, rgba(240,247,255,0.85) 100%)" }} />

          {/* Hero Content */}
          <div style={{ position: "absolute", bottom: 80, left: 48 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 1.5, background: "#c9a227" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#f0c94a" }}>
                  Saint Petersburg, FL
                </span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 50, fontWeight: 800, lineHeight: 1.1, color: "white", marginBottom: 10 }}>
                Book Your Charter<br />
                <em style={{ color: "#f0c94a", fontStyle: "italic" }}>Experience</em>
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", maxWidth: 360, lineHeight: 1.7 }}>
                Select your package, fill your details, and proceed to secure payment.
              </p>
            </motion.div>
          </div>

          {/* Vessel Stats */}
          <div style={{
            position: "absolute", bottom: 24, right: 40,
            display: "flex", gap: 0,
            background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
            borderRadius: 16, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 8px 30px rgba(90,58,0,0.12)",
          }}>
            {VESSEL_STATS.map((s, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "12px 20px",
                borderRight: i < VESSEL_STATS.length - 1 ? "1px solid rgba(201,162,39,0.08)" : "none",
              }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, color: "#c9a227" }}>{s.val}</span>
                <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "1.2px", color: "#8a7840", marginTop: 2, fontWeight: 700 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "50px 28px 80px" }}>

        {preselectedNote && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 20, padding: "12px 18px", borderRadius: 12,
              background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)",
              fontSize: 12, color: "#c9a227", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Anchor size={14} /> {preselectedNote}
          </motion.div>
        )}

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">

          {/* ─── STEP 0: Select Package ─── */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ marginBottom: 32 }}>
                <SectionLabel text="Charter Packages" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#5a3a00", marginBottom: 8 }}>
                  Choose Your Package
                </h2>
                <p style={{ fontSize: 13, color: "#8a7840", lineHeight: 1.7 }}>
                  Select a charter type to continue. All rates include Captain and crew.
                </p>
              </div>

              {/* Rate Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
                {CHARTER_RATES.map((rate) => (
                  <RateCard key={rate.id} rate={rate} selected={selectedRateId === rate.id} onSelect={() => setSelectedRateId(rate.id)} />
                ))}
              </div>

              {/* Special Events Accordion */}
              <div style={{
                borderRadius: 20, overflow: "hidden", marginBottom: 32,
                border: "1.5px solid rgba(201,162,39,0.1)",
                background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)",
              }}>
                <button
                  onClick={() => setShowSpecial((p) => !p)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.05))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(201,162,39,0.2)",
                    }}>
                      <Star size={18} style={{ color: "#c9a227" }} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#5a3a00" }}>
                        Special Events & Occasions
                      </h3>
                      <p style={{ fontSize: 10, color: "#b8a660", marginTop: 2 }}>Corporate, celebrations & culinary experiences</p>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: showSpecial ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={18} style={{ color: "#b8a660" }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showSpecial && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }} style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {SPECIAL_RATES.map((r) => (
                          <SpecialRateCard key={r.id} rate={r} selected={selectedRateId === r.id} onSelect={() => setSelectedRateId(r.id)} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Continue CTA */}
              <motion.div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 24px", borderRadius: 18,
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                  border: "1.5px solid rgba(201,162,39,0.1)",
                  boxShadow: "0 8px 30px rgba(90,58,0,0.06)",
                }}
              >
                <div>
                  {selected ? (
                    <>
                      <p style={{ fontSize: 10, color: "#b8a660", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 3 }}>Selected</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#5a3a00", fontWeight: 700 }}>
                        {selected.name} — <span style={{ color: "#c9a227" }}>{selected.price}</span>
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: "#b8a660" }}>← Select a package above to continue</p>
                  )}
                </div>
                <motion.button
                  onClick={handleProceedToDetails}
                  disabled={!selectedRateId}
                  whileHover={selectedRateId ? { scale: 1.03, y: -2 } : {}}
                  whileTap={selectedRateId ? { scale: 0.97 } : {}}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "14px 26px", borderRadius: 14,
                    background: selectedRateId ? "linear-gradient(135deg, #5a3a00, #c9a227)" : "rgba(201,162,39,0.1)",
                    color: selectedRateId ? "white" : "#b8a660",
                    border: "none", cursor: selectedRateId ? "pointer" : "not-allowed",
                    fontSize: 13, fontWeight: 800, letterSpacing: "0.3px",
                    boxShadow: selectedRateId ? "0 8px 30px rgba(90,58,0,0.25)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Continue to Details <ArrowUpRight size={16} />
                </motion.button>
              </motion.div>

              <p style={{ textAlign: "center", fontSize: 10, color: "#b8a660", marginTop: 14 }}>
                * Rates include captain and crew. Fuel, food & gratuity not included.
              </p>
            </motion.div>
          )}

          {/* ─── STEP 1: Your Details ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <SectionLabel text="Your Information" />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#5a3a00" }}>Your Details</h2>
                </div>
                <button
                  onClick={() => setStep(0)}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#b8a660", background: "none", border: "none", cursor: "pointer", marginTop: 6 }}
                >
                  <ChevronLeft size={14} /> Back
                </button>
              </div>

              {/* Package Recap */}
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", borderRadius: 16, marginBottom: 28,
                    background: "rgba(201,162,39,0.05)", border: "1.5px solid rgba(201,162,39,0.15)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26 }}>{(selected as CharterRate).emoji}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 14, color: "#5a3a00" }}>{selected.name}</p>
                      <p style={{ fontSize: 10, color: "#8a7840", marginTop: 2 }}>
                        {(selected as CharterRate).duration || "Custom"} · {(selected as CharterRate).guests || "Contact for details"}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#c9a227" }}>{selected.price}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleProceedToPayment}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {/* First Name */}
                  <div>
                    <label style={labelStyle}>First Name <span style={{ color: "#c9a227" }}>*</span></label>
                    <input
                      required type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField("firstName")} onBlur={() => setFocusedField(null)}
                      placeholder="John"
                      style={inputStyle("firstName")}
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label style={labelStyle}>Last Name <span style={{ color: "#c9a227" }}>*</span></label>
                    <input
                      required type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setFocusedField("lastName")} onBlur={() => setFocusedField(null)}
                      placeholder="Doe"
                      style={inputStyle("lastName")}
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: "#c9a227" }}>*</span></label>
                    <input
                      required type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      placeholder="john@example.com"
                      style={inputStyle("email")}
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                      placeholder="(555) 000-0000"
                      style={inputStyle("phone")}
                    />
                  </div>
                  {/* Date */}
                  <div>
                    <label style={labelStyle}>Preferred Date</label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="book-preferred-date" type="date" value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        onFocus={() => setFocusedField("date")} onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("date"), colorScheme: "light", paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => { const el = document.getElementById("book-preferred-date") as HTMLInputElement; el?.showPicker?.(); }}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
                      >
                        <Calendar size={15} style={{ color: "#c9a227" }} />
                      </button>
                    </div>
                  </div>
                  {/* Guest Count */}
                  <div>
                    <label style={labelStyle}>Number of Guests</label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={guestCount} onChange={(e) => setGuestCount(e.target.value)}
                        onFocus={() => setFocusedField("guests")} onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("guests"), appearance: "none", cursor: "pointer", paddingRight: 36 }}
                      >
                        <option value="">Select guests</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#b8a660", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Special Requests / Notes</label>
                  <textarea
                    rows={3} value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                    placeholder="Dietary needs, special occasions, destination preferences…"
                    style={{ ...inputStyle("message"), resize: "none", lineHeight: 1.6 }}
                  />
                </div>

                {/* CTA */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 22px", borderRadius: 16,
                  background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(201,162,39,0.1)",
                }}>
                  <div>
                    {selected && (
                      <>
                        <p style={{ fontSize: 10, color: "#b8a660", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 3 }}>Package</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#5a3a00", fontWeight: 700 }}>
                          {selected.name} — <span style={{ color: "#c9a227" }}>{selected.price}</span>
                        </p>
                      </>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!firstName || !lastName || !email}
                    whileHover={firstName && lastName && email ? { scale: 1.03, y: -2 } : {}}
                    whileTap={firstName && lastName && email ? { scale: 0.97 } : {}}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "14px 24px", borderRadius: 14,
                      background: firstName && lastName && email ? "linear-gradient(135deg, #5a3a00, #c9a227)" : "rgba(201,162,39,0.08)",
                      color: firstName && lastName && email ? "white" : "#b8a660",
                      border: "none", cursor: firstName && lastName && email ? "pointer" : "not-allowed",
                      fontSize: 13, fontWeight: 800,
                      boxShadow: firstName && lastName && email ? "0 8px 30px rgba(90,58,0,0.22)" : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    Continue to Review <ArrowUpRight size={16} />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ─── STEP 2: Confirm & Pay ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                <div>
                  <SectionLabel text="Review Order" />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: "#5a3a00" }}>Confirm & Pay</h2>
                </div>
                <button
                  onClick={() => setStep(1)}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#b8a660", background: "none", border: "none", cursor: "pointer", marginTop: 6 }}
                >
                  <ChevronLeft size={14} /> Back
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Order Summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#b8a660" }}>Order Summary</h3>

                  {/* Charter Info */}
                  <div style={{
                    padding: "20px 22px", borderRadius: 20,
                    background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(201,162,39,0.1)",
                    backdropFilter: "blur(16px)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid rgba(201,162,39,0.08)" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,162,39,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 22 }}>{(selected as CharterRate)?.emoji || "⚓"}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 14, color: "#5a3a00" }}>{selected?.name}</p>
                        <p style={{ fontSize: 10, color: "#8a7840", marginTop: 2 }}>Serendipity — 94' Lazzara</p>
                      </div>
                    </div>

                    {[
                      { label: "Guest", value: `${firstName} ${lastName}` },
                      { label: "Email", value: email },
                      { label: "Date", value: preferredDate || "TBD" },
                      { label: "Guests", value: guestCount ? `${guestCount} guests` : "TBD" },
                      { label: "Duration", value: (selected as CharterRate)?.duration || "Custom" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
                        <span style={{ color: "#b8a660", fontWeight: 600 }}>{row.label}</span>
                        <span style={{ color: "#5a3a00", fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div style={{
                    padding: "20px 22px", borderRadius: 20,
                    background: "linear-gradient(135deg, rgba(201,162,39,0.06), rgba(255,255,255,0.9))",
                    border: "1.5px solid rgba(201,162,39,0.2)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                      <span style={{ color: "#8a7840", fontWeight: 600 }}>Charter Base Rate</span>
                      <span style={{ fontWeight: 800, color: "#5a3a00" }}>{selected?.price}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 14, color: "#b8a660" }}>
                      <span>CC Surcharge (2.5%)</span>
                      <span>
                        {(selected as CharterRate)?.numPrice ? `+$${((selected as CharterRate).numPrice * 0.025).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "At checkout"}
                      </span>
                    </div>
                    <div style={{ paddingTop: 14, borderTop: "1px solid rgba(201,162,39,0.15)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#8a7840" }}>Total (with CC)</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#c9a227" }}>
                        {(selected as CharterRate)?.numPrice
                          ? `$${((selected as CharterRate).numPrice * 1.025).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : selected?.price}
                      </span>
                    </div>
                    <p style={{ fontSize: 9, color: "#c8b870", marginTop: 8 }}>
                      💡 No surcharge for ACH (eCheck) payments
                    </p>
                  </div>

                  {/* Highlights */}
                  {"highlights" in (selected ?? {}) && (selected as CharterRate).highlights?.length > 0 && (
                    <div style={{
                      padding: "16px 20px", borderRadius: 16,
                      background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,162,39,0.08)",
                    }}>
                      <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#b8a660", marginBottom: 12 }}>Included</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(selected as CharterRate).highlights.map((h, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#7a6230" }}>
                            <Check size={12} style={{ color: "#c9a227", flexShrink: 0 }} /> {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#b8a660" }}>Payment</h3>

                  <div style={{
                    padding: "24px 22px", borderRadius: 20,
                    background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(201,162,39,0.1)",
                    backdropFilter: "blur(16px)",
                  }}>
                    <p style={{ fontSize: 13, color: "#8a7840", lineHeight: 1.8, marginBottom: 20 }}>
                      You'll be directed to our secure payment page where you can pay by credit card or ACH (eCheck). ACH has no surcharge.
                    </p>

                    {[
                      "256-bit SSL encrypted",
                      "PCI DSS compliant",
                      "Credit card & ACH accepted",
                      "Confirmation within 24 hours",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8a7840", marginBottom: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(201,162,39,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Shield size={11} style={{ color: "#c9a227" }} />
                        </div>
                        {item}
                      </div>
                    ))}

                    <motion.button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "16px 0", marginTop: 22, borderRadius: 14, border: "none",
                        background: loading ? "#b8a660" : "linear-gradient(135deg, #5a3a00 0%, #c9a227 100%)",
                        color: "white", fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: loading ? "none" : "0 10px 35px rgba(90,58,0,0.28)",
                        transition: "all 0.3s",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }}
                          />
                          Preparing Payment…
                        </>
                      ) : (
                        <><CreditCard size={16} /> Proceed to Secure Payment</>
                      )}
                    </motion.button>

                    <p style={{ textAlign: "center", fontSize: 9, color: "#c8b870", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Lock size={9} /> Secured by 256-bit SSL encryption
                    </p>
                  </div>

                  {/* Contact */}
                  <div style={{
                    padding: "18px 20px", borderRadius: 18,
                    background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(201,162,39,0.08)",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#b8a660", marginBottom: 12 }}>Questions? Call Us</p>
                    {[
                      { name: "Capt. Jake", tel: "4124182968", display: "412-418-2968" },
                      { name: "Manager Bryon", tel: "7276449653", display: "727-644-9653" },
                    ].map((c, i) => (
                      <a key={i} href={`tel:${c.tel}`} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        fontSize: 12, color: "#7a6230", textDecoration: "none", fontWeight: 500,
                        marginBottom: i === 0 ? 8 : 0, transition: "color 0.2s",
                      }}>
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(201,162,39,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Phone size={11} style={{ color: "#c9a227" }} />
                        </div>
                        {c.name}: {c.display}
                      </a>
                    ))}
                  </div>

                  {/* Location */}
                  <div style={{
                    padding: "16px 20px", borderRadius: 16,
                    background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,162,39,0.08)",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#b8a660", marginBottom: 10 }}>Location</p>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#7a6230" }}>
                      <MapPin size={13} style={{ color: "#c9a227", marginTop: 1, flexShrink: 0 }} />
                      <a href="https://maps.google.com/?q=Maximo+Marina,+St+Petersburg,+FL" target="_blank" rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none", lineHeight: 1.7 }}>
                        Maximo Marina<br />
                        3701 50 Ave S., Saint Petersburg, FL
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 10, borderTop: "1px solid rgba(201,162,39,0.08)",
        padding: "24px 40px", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 10, color: "#b8a660", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
            © 2025 Serendipity Yacht Charter. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ label: "Inquire", href: "/reservation" }, { label: "Home", href: "/" }].map((l, i) => (
              <a key={i} href={l.href} style={{ fontSize: 10, color: "#b8a660", textDecoration: "none", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
