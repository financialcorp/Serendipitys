/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Reservation Page — Serendipity Yacht Charter (Enhanced)
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Users, Clock, Anchor, Check, ArrowUpRight, Phone,
  MapPin, Lock, Star, ChevronLeft, Utensils, Wifi,
  Shield, Waves, Wind, ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TabType { id: "day" | "overnight"; label: string; }

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: TabType[] = [
  { id: "day", label: "Single Day" },
  { id: "overnight", label: "Multi-Day" },
];

const DAY_CHARTERS = [
  { hours: "4 Hours", time: "Sat/Sun 10am – 2pm", price: "$2,500", desc: "Perfect for birthdays & sunset cruises" },
  { hours: "6 Hours", time: "Sat/Sun 10am – 4pm", price: "$3,500", desc: "Island hopping & beach days" },
  { hours: "10 Hours", time: "Sat/Sun 8am – 6pm", price: "$7,500", desc: "Full-day luxury experience", popular: true },
];

const OVERNIGHT_CHARTERS = [
  { days: "2 Days", nights: "1 Night", price: "$10,000", perNight: "$10,000/night" },
  { days: "3 Days", nights: "2 Nights", price: "$20,000", perNight: "$10,000/night" },
  { days: "5 Days", nights: "4 Nights", price: "$30,000", perNight: "$7,500/night", popular: true },
  { days: "6 Days", nights: "5 Nights", price: "$35,000", perNight: "$7,000/night" },
  { days: "7 Days", nights: "6 Nights", price: "$38,000", perNight: "$6,300/night" },
];

const CREW_OPTIONS = [
  { label: "Crew Member", price: "$250/day", icon: "⚓" },
  { label: "Bartender", price: "$200/day", icon: "🍸" },
  { label: "Private Chef", price: "Negotiated directly", icon: "👨‍🍳" },
];

const CHARTER_POLICIES = [
  "All fees including fuel shown at checkout",
  "Max outer speed: 12 knots",
  "Max capacity: 12 guests (13 total with crew)",
  "Crew gratuity (recommended) approx 15–25%",
  "Special events may require higher minimum",
];

const VESSEL_IMAGES = [
  "assets/occasion1.png",
  "assets/occasion2.png",
  "assets/occasion3.png",
  "assets/occasion4.png",
];

const AMENITIES = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Utensils, label: "Full Galley" },
  { icon: Shield, label: "Licensed Captain" },
  { icon: Users, label: "Pro Crew" },
  { icon: Anchor, label: "Water Sports" },
  { icon: Star, label: "5-Star Service" },
  { icon: Waves, label: "Gulf Access" },
  { icon: Wind, label: "Air Conditioned" },
];

function getInitialImageIndex(): number {
  try {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("img") ?? "0", 10);
    return isNaN(idx) || idx < 0 || idx >= VESSEL_IMAGES.length ? 0 : idx;
  } catch { return 0; }
}

function getInitialVesselName(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("vessel") ?? "";
  } catch { return ""; }
}

// ─── Floating Orb Background ──────────────────────────────────────────────────
function OceanBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #fdf6ec 0%, #fef9e7 30%, #fdf2d0 70%, #fef5d4 100%)"
      }} />
      {/* Animated wave blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-15%", right: "-10%",
          width: 700, height: 700, borderRadius: "60% 40% 70% 30% / 40% 60% 30% 70%",
          background: "radial-gradient(circle, rgba(201,162,39,0.07) 0%, rgba(201,162,39,0.02) 60%, transparent 80%)",
          filter: "blur(40px)"
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: 600, height: 600, borderRadius: "40% 60% 30% 70% / 60% 30% 70% 40%",
          background: "radial-gradient(circle, rgba(201,162,39,0.06) 0%, rgba(201,162,39,0.02) 60%, transparent 80%)",
          filter: "blur(50px)"
        }}
      />
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        style={{
          position: "absolute", top: "40%", left: "30%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />
    </div>
  );
}

// ─── Wave Divider ─────────────────────────────────────────────────────────────
function WaveDivider({ flip = false, color = "rgba(201,162,39,0.06)" }) {
  return (
    <div style={{ transform: flip ? "scaleY(-1)" : "none", lineHeight: 0, marginTop: -2 }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: 60 }}>
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill={color} />
      </svg>
    </div>
  );
}

// ─── Charter Rate Card ────────────────────────────────────────────────────────
function DayCharterCard({ r, i }: { r: typeof DAY_CHARTERS[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(201,162,39,0.12)" }}
      style={{
        position: "relative",
        padding: "20px 22px",
        borderRadius: 20,
        background: (r as any).popular
          ? "linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(255,255,255,0.95) 100%)"
          : "rgba(255,255,255,0.7)",
        border: (r as any).popular ? "2px solid rgba(201,162,39,0.4)" : "1.5px solid rgba(201,162,39,0.1)",
        backdropFilter: "blur(12px)",
        cursor: "default",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      {(r as any).popular && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "linear-gradient(135deg, #c9a227, #e0bb4a)",
          color: "#040d1a", fontSize: 9, fontWeight: 800,
          letterSpacing: "1.5px", textTransform: "uppercase",
          padding: "5px 14px", borderBottomLeftRadius: 12,
        }}>
          Best Value
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#5a3a00", marginBottom: 3 }}>{r.hours}</p>
          <p style={{ fontSize: 11, color: "#c9a227", fontWeight: 600, letterSpacing: "0.5px" }}>{r.time}</p>
          <p style={{ fontSize: 11, color: "#6b7d8a", marginTop: 4 }}>{r.desc}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#c9a227", lineHeight: 1 }}>{r.price}</p>
          <p style={{ fontSize: 9, color: "#aaa", marginTop: 3, textTransform: "uppercase", letterSpacing: "1px" }}>+ fuel</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Overnight Rate Row ───────────────────────────────────────────────────────
function OvernightRow({ r, i }: { r: typeof OVERNIGHT_CHARTERS[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ x: 6 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderRadius: 14,
        background: (r as any).popular ? "rgba(201,162,39,0.07)" : "rgba(201,162,39,0.04)",
        border: (r as any).popular ? "1.5px solid rgba(201,162,39,0.25)" : "1px solid rgba(201,162,39,0.08)",
        transition: "all 0.25s ease",
      }}
    >
      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: "#5a3a00" }}>{r.days} · {r.nights}</p>
        <p style={{ fontSize: 10, color: "#c9a227", marginTop: 2 }}>{r.perNight}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {(r as any).popular && (
          <span style={{
            fontSize: 8, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase",
            background: "rgba(201,162,39,0.15)", color: "#c9a227",
            padding: "3px 8px", borderRadius: 6
          }}>Popular</span>
        )}
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#c9a227" }}>{r.price}</p>
      </div>
    </motion.div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ width: 28, height: 2, background: "linear-gradient(90deg, #c9a227, transparent)", borderRadius: 2 }} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "#c9a227" }}>{text}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReservationPage() {
  const [activeTab, setActiveTab] = useState<"day" | "overnight">("day");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [crewOption, setCrewOption] = useState("");
  const [additionalReq, setAdditionalReq] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeImg, setActiveImg] = useState<number>(getInitialImageIndex);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const vesselName = getInitialVesselName();

  const inputStyle = (fieldName: string) => ({
    width: "100%", background: focusedField === fieldName ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.8)",
    border: focusedField === fieldName ? "2px solid #c9a227" : "1.5px solid rgba(201,162,39,0.15)",
    borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#5a3a00",
    outline: "none", transition: "all 0.2s ease", boxSizing: "border-box" as const,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: focusedField === fieldName ? "0 0 0 4px rgba(201,162,39,0.08)" : "none",
  });

  const labelStyle = {
    fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" as const,
    color: "#7a6230", display: "block", marginBottom: 6,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4500);
    }, 1400);
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#5a3a00", position: "relative" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #b8a660; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        select option { color: #5a3a00; background: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.2); border-radius: 10px; }
      `}</style>

      <OceanBackground />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "relative", zIndex: 50, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "16px 40px",
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,162,39,0.08)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="assets/site-logo.png" alt="Serendipity" style={{ height: 44, width: "auto" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500,
            color: "#8a7840", textDecoration: "none", transition: "color 0.2s"
          }}>
            <ChevronLeft size={15} /> Back
          </a>
          <a href="#reservation-form" style={{
            background: "linear-gradient(135deg, #c9a227, #b8911f)",
            color: "white", padding: "9px 22px", borderRadius: 50,
            fontSize: 12, fontWeight: 700, textDecoration: "none",
            letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(201,162,39,0.3)",
            transition: "all 0.2s ease",
          }}>
            Reserve Now
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>
        <div style={{ position: "relative", height: 440 }}>
          <video
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            src="assets/attract_video.mp4" autoPlay muted loop playsInline
          />
          {/* Multi-layer overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(240,247,255,0.2) 0%, rgba(90,58,0,0.45) 50%, rgba(240,247,255,0.85) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(90,58,0,0.3) 0%, transparent 60%)" }} />

          {/* Hero Text */}
          <div style={{ position: "absolute", bottom: 80, left: 48 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 1.5, background: "#c9a227" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#c9a227" }}>
                  Saint Petersburg, Florida
                </span>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 800,
                lineHeight: 1.1, color: "white", marginBottom: 12, textShadow: "0 2px 20px rgba(90,58,0,0.3)"
              }}>
                Reserve Your<br />
                <em style={{ color: "#f0c94a", fontStyle: "italic" }}>
                  {vesselName || "Luxury Voyage"}
                </em>
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", maxWidth: 380, lineHeight: 1.7 }}>
                Set sail aboard the Serendipity Motor Yacht — tailored for elegance, comfort, and unforgettable memories.
              </p>
            </motion.div>
          </div>

          {/* Image Thumbnail Strip */}
          <div style={{ position: "absolute", bottom: 20, right: 32, display: "flex", gap: 8 }}>
            {VESSEL_IMAGES.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveImg(i)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 72, height: 50, borderRadius: 10, overflow: "hidden",
                  border: activeImg === i ? "2.5px solid #c9a227" : "2px solid rgba(255,255,255,0.2)",
                  opacity: activeImg === i ? 1 : 0.6, cursor: "pointer", padding: 0,
                  transition: "all 0.3s ease", background: "none",
                  boxShadow: activeImg === i ? "0 0 20px rgba(201,162,39,0.4)" : "none",
                }}
              >
                <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active vessel image display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: "none", zIndex: -1,
            }}
          />
        </AnimatePresence>
      </div>

      <WaveDivider />

      {/* ── AMENITIES STRIP ── */}
      <div style={{
        position: "relative", zIndex: 10, background: "rgba(90,58,0,0.96)",
        padding: "18px 40px", overflow: "hidden",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {AMENITIES.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 50,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500,
              }}
            >
              <a.icon size={13} style={{ color: "#c9a227" }} />
              {a.label}
            </motion.div>
          ))}
        </div>
      </div>

      <WaveDivider flip color="rgba(90,58,0,0.96)" />

      {/* ── MAIN LAYOUT ── */}
      <div style={{
        position: "relative", zIndex: 10, maxWidth: 1280,
        margin: "0 auto", padding: "60px 32px",
        display: "grid", gridTemplateColumns: "1fr 400px", gap: 60,
      }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Section Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Charter Pricing" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 800, color: "#5a3a00", lineHeight: 1.15, marginBottom: 10 }}>
              Choose Your<br /><em style={{ color: "#c9a227", fontStyle: "italic" }}>Perfect Charter</em>
            </h2>
            <p style={{ fontSize: 14, color: "#8a7840", maxWidth: 480, lineHeight: 1.75, marginBottom: 40 }}>
              All rates include the vessel, Captain, and Mate. Additional expenses apply for food, beverages, fuel, and dockage.
            </p>
          </motion.div>

          {/* ── DAY CHARTERS ── */}
          <div style={{
            padding: "32px 28px", borderRadius: 24,
            background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(201,162,39,0.1)",
            marginBottom: 24,
            boxShadow: "0 8px 40px rgba(90,58,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(201,162,39,0.15)"
              }}>
                <Clock size={18} style={{ color: "#c9a227" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#5a3a00" }}>Day Charters</h3>
                <p style={{ fontSize: 11, color: "#a89550" }}>Saturday & Sunday departures</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {DAY_CHARTERS.map((r, i) => <DayCharterCard key={i} r={r} i={i} />)}
            </div>
          </div>

          {/* ── OVERNIGHT CHARTERS ── */}
          <div style={{
            padding: "32px 28px", borderRadius: 24,
            background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(201,162,39,0.1)",
            marginBottom: 24,
            boxShadow: "0 8px 40px rgba(90,58,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(201,162,39,0.2)"
              }}>
                <Anchor size={18} style={{ color: "#c9a227" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#5a3a00" }}>Overnight Charters</h3>
                <p style={{ fontSize: 11, color: "#a89550" }}>Multi-day voyages & escapes</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {OVERNIGHT_CHARTERS.map((r, i) => <OvernightRow key={i} r={r} i={i} />)}
            </div>
          </div>

          {/* ── CREW & POLICIES ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
            {/* Crew Options */}
            <div style={{
              padding: "28px 24px", borderRadius: 24,
              background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(201,162,39,0.1)",
              boxShadow: "0 8px 40px rgba(90,58,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(201,162,39,0.08)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Users size={16} style={{ color: "#c9a227" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#5a3a00" }}>Crew Add-ons</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CREW_OPTIONS.map((c, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 14px", borderRadius: 12,
                    background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.08)"
                  }}>
                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#5a3a00" }}>{c.label}</p>
                      <p style={{ fontSize: 10, color: "#c9a227" }}>{c.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charter Policies */}
            <div style={{
              padding: "28px 24px", borderRadius: 24,
              background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(201,162,39,0.1)",
              boxShadow: "0 8px 40px rgba(90,58,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(201,162,39,0.08)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Shield size={16} style={{ color: "#c9a227" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#5a3a00" }}>Policies</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CHARTER_POLICIES.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11, color: "#7a6230", lineHeight: 1.5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9a227", marginTop: 5, flexShrink: 0, opacity: 0.6 }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── VOYAGE CTA BANNER ── */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
              padding: "40px 44px", borderRadius: 28,
              background: "linear-gradient(135deg, #5a3a00 0%, #b8911f 50%, #c9a227 100%)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
              boxShadow: "0 20px 60px rgba(90,58,0,0.25)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -40, right: 120, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div style={{ position: "absolute", bottom: -30, right: 40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to Set Sail?</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 10 }}>
                Your Voyage<br /><em style={{ color: "#f0c94a" }}>Awaits</em>
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 360, lineHeight: 1.7 }}>
                From sunrise cruises to weeklong escapes — every charter is tailored to you.
              </p>
            </div>
            <motion.a
              href="#reservation-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
                padding: "16px 28px", borderRadius: 16,
                background: "linear-gradient(135deg, #c9a227, #e0bb4a)",
                color: "#5a3a00", fontWeight: 800, fontSize: 13,
                textDecoration: "none", boxShadow: "0 8px 30px rgba(201,162,39,0.4)",
                letterSpacing: "0.3px",
              }}
            >
              Reserve Now <ArrowUpRight size={16} />
            </motion.a>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Reservation Form ── */}
        <div id="reservation-form" style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{
              borderRadius: 28, overflow: "hidden",
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(30px)",
              border: "1.5px solid rgba(201,162,39,0.12)",
              boxShadow: "0 30px 80px rgba(90,58,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
          >
            {/* Form Header */}
            <div style={{
              padding: "28px 28px 24px",
              background: "linear-gradient(135deg, #5a3a00 0%, #b8911f 100%)",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(201,162,39,0.12)" }} />
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Begin Your Journey</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: "white" }}>
                Start Your Reservation
              </h2>
              {vesselName ? (
                <p style={{ fontSize: 11, color: "#f0c94a", marginTop: 4, fontWeight: 600 }}>
                  Inquiring about: {vesselName}
                </p>
              ) : (
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                  We'll confirm your booking within 24 hours
                </p>
              )}
            </div>

            {/* Tab Toggle */}
            <div style={{ display: "flex", background: "rgba(201,162,39,0.05)", borderBottom: "1px solid rgba(201,162,39,0.08)" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setDuration(""); }}
                  style={{
                    flex: 1, padding: "13px 0", fontSize: 10, fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "1.2px",
                    background: "none", border: "none", cursor: "pointer",
                    color: activeTab === tab.id ? "#c9a227" : "#b8a660",
                    borderBottom: activeTab === tab.id ? "2.5px solid #c9a227" : "2.5px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} style={{ padding: "24px 24px 20px" }}>

              {vesselName && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", marginBottom: 16, borderRadius: 10,
                  background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)"
                }}>
                  <Anchor size={13} style={{ color: "#c9a227" }} />
                  <span style={{ fontSize: 10, color: "#c9a227", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Selected: {vesselName}
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  required type="text" value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  style={inputStyle("name")}
                />
              </div>

              {/* Phone & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                    placeholder="(555) 000-0000"
                    style={inputStyle("phone")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email <span style={{ color: "#c9a227" }}>*</span></label>
                  <input
                    required type="email" value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                    placeholder="you@email.com"
                    style={inputStyle("email")}
                  />
                </div>
              </div>

              {/* Date & Duration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <input
                    type="date" value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onFocus={() => setFocusedField("date")} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("date"), colorScheme: "light" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{activeTab === "day" ? "Duration" : "Package"}</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={duration} onChange={(e) => setDuration(e.target.value)}
                      onFocus={() => setFocusedField("duration")} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("duration"), appearance: "none", cursor: "pointer", paddingRight: 32 }}
                    >
                      <option value="">Select…</option>
                      {activeTab === "day" ? (
                        <>
                          <option value="4">4 Hours — $2,500</option>
                          <option value="6">6 Hours — $3,500</option>
                          <option value="10">10 Hours — $7,500</option>
                        </>
                      ) : (
                        <>
                          <option value="2d1n">2 Days / 1 Night — $10,000</option>
                          <option value="3d2n">3 Days / 2 Nights — $20,000</option>
                          <option value="5d4n">5 Days / 4 Nights — $30,000</option>
                          <option value="6d5n">6 Days / 5 Nights — $35,000</option>
                          <option value="7d6n">7 Days / 6 Nights — $38,000</option>
                        </>
                      )}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#b8a660", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>

              {/* Crew Option */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Crew Add-ons</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={crewOption} onChange={(e) => setCrewOption(e.target.value)}
                    onFocus={() => setFocusedField("crew")} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("crew"), appearance: "none", cursor: "pointer", paddingRight: 32 }}
                  >
                    <option value="">Select crew option…</option>
                    <option value="crew">Crew Member — $250/day</option>
                    <option value="bartender">Bartender — $200/day</option>
                    <option value="chef">Private Chef — Negotiated directly</option>
                    <option value="full">Full Crew Package</option>
                  </select>
                  <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#b8a660", pointerEvents: "none" }} />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Special Requests</label>
                <textarea
                  rows={3} value={additionalReq}
                  onChange={(e) => setAdditionalReq(e.target.value)}
                  onFocus={() => setFocusedField("notes")} onBlur={() => setFocusedField(null)}
                  placeholder="Special occasions, dietary needs, destination wishes…"
                  style={{
                    ...inputStyle("notes"), resize: "none" as const,
                    lineHeight: 1.6
                  }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%", padding: "15px 0",
                  background: loading ? "#b8a660" : "linear-gradient(135deg, #c9a227 0%, #b8911f 100%)",
                  color: "white", border: "none", borderRadius: 14,
                  fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 8px 30px rgba(201,162,39,0.35)",
                  transition: "background 0.3s, box-shadow 0.3s",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }}
                    />
                    Submitting Request…
                  </>
                ) : (
                  <> Request My Charter <ArrowUpRight size={16} /> </>
                )}
              </motion.button>

              <p style={{ textAlign: "center", fontSize: 10, color: "#b8a660", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Lock size={10} /> Secured with 256-bit SSL encryption
              </p>
            </form>

            {/* Contact Strip */}
            <div style={{ padding: "18px 24px 22px", borderTop: "1px solid rgba(201,162,39,0.08)", background: "rgba(201,162,39,0.02)" }}>
              <p style={{ fontSize: 9, color: "#b8a660", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 800, marginBottom: 12 }}>Prefer to talk?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Capt. Jake", tel: "4124182968", display: "412-418-2968" },
                  { name: "Manager Bryon", tel: "7276449653", display: "727-644-9653" },
                ].map((c, i) => (
                  <a key={i} href={`tel:${c.tel}`} style={{
                    display: "flex", alignItems: "center", gap: 8, fontSize: 12,
                    color: "#7a6230", textDecoration: "none", fontWeight: 500,
                    transition: "color 0.2s",
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(201,162,39,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Phone size={11} style={{ color: "#c9a227" }} />
                    </div>
                    {c.name}: {c.display}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, display: "flex", alignItems: "center", gap: 16,
              padding: "16px 24px", borderRadius: 20,
              background: "rgba(90,58,0,0.95)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,162,39,0.3)",
              boxShadow: "0 20px 60px rgba(90,58,0,0.4)",
              minWidth: 320,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              style={{
                width: 42, height: 42, borderRadius: 12,
                background: "rgba(16,185,129,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={20} style={{ color: "#10b981" }} />
            </motion.div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "white", marginBottom: 2 }}>Request Submitted! 🎉</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>We'll reach out within 24 hours.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 10, marginTop: 40,
        borderTop: "1px solid rgba(201,162,39,0.08)",
        padding: "28px 40px",
        background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 10, color: "#b8a660", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
            © 2025 Serendipity Yacht Charter. All Rights Reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8a7840" }}>
            <MapPin size={12} style={{ color: "#c9a227" }} />
            Maximo Marina, 3701 50 Ave S., Saint Petersburg, FL 33371
          </div>
        </div>
      </footer>
    </div>
  );
}
