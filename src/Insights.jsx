import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", visible: 5, hidden: 2 },
  { day: "Tue", visible: 6, hidden: 3 },
  { day: "Wed", visible: 4, hidden: 4 },
  { day: "Thu", visible: 7, hidden: 2 },
  { day: "Fri", visible: 5, hidden: 3 },
  { day: "Sat", visible: 2, hidden: 4 },
  { day: "Sun", visible: 1, hidden: 3 },
]

export default function Insights() {
  return (
    <div style={{ width: "390px", backgroundColor: "#ffffff", minHeight: "100vh", padding: "24px 20px 100px", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1A1A2E", marginBottom: "6px" }}>Weekly Insights</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>Here's how your week looked, Priya.</p>

      {/* Burnout Alert Card */}
      <div style={{ backgroundColor: "#FCEBEB", border: "1px solid #F09595", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#A32D2D", margin: 0 }}>Burnout Risk: High</p>
        </div>
        <p style={{ fontSize: "13px", color: "#791F1F", margin: 0, lineHeight: "1.5" }}>
          Your workload has been above 70 for 5 days straight. Your hidden work is <strong>2x</strong> your visible work this week. Consider delegating or rescheduling tasks.
        </p>
      </div>

      {/* AI Insight */}
      <div style={{ backgroundColor: "#E6F1FB", border: "1px solid #85B7EB", borderRadius: "16px", padding: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px" }}>✨</span>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#0C447C", margin: 0 }}>AI Insight</p>
        </div>
        <p style={{ fontSize: "13px", color: "#185FA5", margin: 0, lineHeight: "1.5" }}>
          This week you did <strong>21.5 hours</strong> of visible work and <strong>18 hours</strong> of hidden work that was never counted. That hidden work is real — and it matters.
        </p>
      </div>

      {/* Chart */}
      <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#1A1A2E", marginBottom: "16px" }}>Visible vs Hidden work this week</h2>

      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#4A90D9" }}></div>
          <span style={{ fontSize: "12px", color: "#888" }}>Visible work</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#E8734A" }}></div>
          <span style={{ fontSize: "12px", color: "#888" }}>Hidden work</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={14} barGap={4}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", border: "none", fontSize: "12px" }}
            cursor={{ fill: "#F8FAFC" }}
          />
          <Bar dataKey="visible" fill="#4A90D9" radius={[6, 6, 0, 0]} name="Visible work" />
          <Bar dataKey="hidden" fill="#E8734A" radius={[6, 6, 0, 0]} name="Hidden work" />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "24px" }}>
        {[
          { label: "Total visible hours", value: "21.5h", color: "#4A90D9" },
          { label: "Total hidden hours", value: "18h", color: "#E8734A" },
          { label: "Busiest day", value: "Thursday", color: "#1A1A2E" },
          { label: "Hidden work ratio", value: "46%", color: "#D94A4A" },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "#F8FAFC", borderRadius: "12px", padding: "14px" }}>
            <p style={{ fontSize: "18px", fontWeight: "700", color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "#888", margin: 0, marginTop: "3px" }}>{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}