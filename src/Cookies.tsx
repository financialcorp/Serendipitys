import React from "react";

const Cookies = () => {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem", background: "#f9edf0", minHeight: "100vh", fontFamily: "Manrope, sans-serif", color: "#1f1a18" }}>

      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 mb-10 rounded-full transition-all"
        style={{ background: "rgba(201,162,39,0.12)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)", backdropFilter: "blur(10px)" }}
        onMouseOver={(e) => { e.currentTarget.style.background = "rgba(201,162,39,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.background = "rgba(201,162,39,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        ← Back to home
      </button>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 mb-4 rounded-full" style={{ background: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}>
          📋 Legal
        </div>
        <h1 className="text-4xl font-serif font-bold mb-3" style={{ color: "#1f1a18" }}>Cookies Policy</h1>
        <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
          We use cookies to improve your browsing experience and deliver content that actually matters to you.
        </p>
      </div>

      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)", margin: "2rem 0" }} />

      <section className="mb-8">
        <div className="flex items-start gap-4">
          <div style={{ fontSize: "1.5rem" }}>🍪</div>
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#1f1a18" }}>What are cookies?</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
              Cookies are small text files stored on your device when you visit a website. They help us understand how users interact with our site and allow us to improve our services over time.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div style={{ fontSize: "1.5rem" }}>⚙️</div>
          <h2 className="text-lg font-semibold" style={{ color: "#1f1a18" }}>How we use cookies</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { icon: "📊", label: "Analyze traffic and site performance" },
            { icon: "💾", label: "Remember your preferences" },
            { icon: "✨", label: "Enhance your experience" },
          ].map(({ icon, label }) => (
            <div key={label} className="p-4 rounded-xl" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", transition: "all 0.3s" }}>
              <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{icon}</div>
              <p className="text-sm leading-relaxed" style={{ color: "#1f1a18" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 p-6 rounded-2xl" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
        <div className="flex items-start gap-4">
          <div style={{ fontSize: "1.5rem" }}>🛡️</div>
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#1f1a18" }}>Managing cookies</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(31,26,24,0.7)" }}>
              You can disable cookies at any time through your browser settings. Keep in mind that some parts of the site may not function as intended if cookies are turned off.
            </p>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)", margin: "2rem 0" }} />

      <section className="p-6 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.04) 100%)", border: "1px solid rgba(201,162,39,0.25)" }}>
        <div className="flex items-start gap-4">
          <div style={{ fontSize: "1.5rem" }}>📧</div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c9a227", marginBottom: "0.5rem" }}>Have questions?</p>
            <p className="text-base font-semibold" style={{ color: "#1f1a18" }}>info@serendipityyacht.net</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Cookies;