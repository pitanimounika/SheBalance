import { useState } from "react"

export default function Welcome({ onStart }) {
  const [name, setName] = useState("")

  return (
    <div style={{ width: "390px", minHeight: "100vh", backgroundColor: "#13111F", fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#1E1830", border: "1px solid #352B55", borderRadius: "10px", padding: "6px 12px", marginBottom: "20px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#7C3AED" }} />
          <span style={{ fontSize: "11px", color: "#A78BFA", fontWeight: "700", letterSpacing: "0.1em" }}>HIDDEN OVERLOAD SYSTEM</span>
        </div>
        <h1 style={{ fontSize: "44px", fontWeight: "800", color: "#F0EEFF", margin: 0, lineHeight: "1.1" }}>
          She<span style={{ color: "#7C3AED" }}>Balance</span>
        </h1>
        <p style={{ fontSize: "14px", color: "#8B8FA8", margin: 0, marginTop: "8px" }}>Built for working women who carry it all.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
        {[
          { icon: "👁", title: "Hidden work made visible", desc: "Emotional & mental labor finally counted" },
          { icon: "📋", title: "Everything tracked clearly", desc: "Work, home, childcare — all in one place" },
          { icon: "⚡", title: "Shifting priorities managed", desc: "Mark urgent — list reorders instantly" },
          { icon: "📊", title: "Proper structure always", desc: "Workload score shows your real burden" },
          { icon: "⚖️", title: "Shared weekly plan", desc: "Tasks divided fairly with your partner" },
        ].map(f => (
          <div key={f.title} style={{ display: "flex", alignItems: "center", gap: "14px", backgroundColor: "#1C1A2E", border: "1px solid #2A2740", borderRadius: "12px", padding: "12px 14px" }}>
            <span style={{ fontSize: "20px", width: "32px", textAlign: "center", flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#F0EEFF", margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: "11px", color: "#8B8FA8", margin: 0, marginTop: "2px" }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", fontWeight: "700", color: "#A78BFA", marginBottom: "8px", letterSpacing: "0.08em" }}>YOUR NAME</p>
      <input
        type="text"
        placeholder="Enter your first name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && name.trim() && onStart(name.trim())}
        style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #352B55", fontSize: "15px", marginBottom: "12px", outline: "none", fontFamily: "Plus Jakarta Sans, sans-serif", backgroundColor: "#1C1A2E", color: "#F0EEFF" }}
      />
      <button
        onClick={() => { if (name.trim()) onStart(name.trim()) }}
        style={{ width: "100%", backgroundColor: name.trim() ? "#7C3AED" : "#1C1A2E", color: name.trim() ? "#fff" : "#4B5563", border: "1px solid", borderColor: name.trim() ? "#7C3AED" : "#2A2740", borderRadius: "12px", padding: "15px", fontSize: "15px", fontWeight: "700", cursor: name.trim() ? "pointer" : "default", transition: "all 0.3s" }}>
        Get started →
      </button>
      <p style={{ fontSize: "11px", color: "#4B5563", textAlign: "center", marginTop: "14px" }}>Private. Secure. Always yours.</p>
    </div>
  )
}
