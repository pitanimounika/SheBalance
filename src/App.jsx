import { useState } from "react"
import Welcome from "./Welcome"
import Share from "./Share"

const C = {
  bg: "#13111F", card: "#1C1A2E", border: "#2A2740",
  purple: "#7C3AED", purpleLight: "#A78BFA", purpleDim: "#2D1F4E",
  text: "#F0EEFF", muted: "#8B8FA8",
  work:      { bg: "#1E1830", text: "#A78BFA", border: "#352B55" },
  home:      { bg: "#131E28", text: "#67E8F9", border: "#1A4A60" },
  childcare: { bg: "#131E13", text: "#86EFAC", border: "#1A4A1A" },
  emotional: { bg: "#1E1318", text: "#FCA5A5", border: "#5C1A1A" },
}

const getTimeOfDay = () => {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}

const timeLabel = { morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" }
const timeOrder = ["morning", "afternoon", "evening"]

export default function App() {
  const [screen, setScreen] = useState("Home")
  const [userName, setUserName] = useState("")
  const [tasks, setTasks] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [domain, setDomain] = useState("Work")
  const [duration, setDuration] = useState("")
  const [isHidden, setIsHidden] = useState(false)
  const [priority, setPriority] = useState("Normal")
  const [timeSlot, setTimeSlot] = useState(getTimeOfDay())

  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const domainColors = {
    Work: C.work, Home: C.home,
    Childcare: C.childcare, Emotional: C.emotional,
  }

  const getDurationMins = (d) => {
    if (!d) return 30
    const h = d.match(/(\d+)h/)
    const m = d.match(/(\d+)m/)
    return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0) || 30
  }

  const visibleMins = tasks.filter(t => !t.hidden).reduce((a, t) => a + getDurationMins(t.duration), 0)
  const hiddenMins  = tasks.filter(t =>  t.hidden).reduce((a, t) => a + getDurationMins(t.duration), 0)
  const totalMins   = visibleMins + hiddenMins
  const score       = tasks.length === 0 ? 0 : Math.min(100, Math.round((totalMins / 480) * 100))
  const hiddenCount = tasks.filter(t => t.hidden).length
  const urgentCount = tasks.filter(t => t.priority === "Urgent").length

  const getStatusColor = (s) => {
    if (s === 0) return C.muted
    if (s <= 30) return "#86EFAC"
    if (s <= 60) return "#FCD34D"
    if (s <= 80) return "#FB923C"
    return "#F87171"
  }

  const getStatusText = (s) => {
    if (s === 0)  return "Add your tasks to begin"
    if (s <= 30)  return "Balanced — you're doing great"
    if (s <= 60)  return "Moderate — stay on track"
    if (s <= 80)  return "High load — consider delegating"
    return "Overloaded — burnout risk!"
  }

  const getBurnout = (s) => {
    if (s <= 30) return { label: "Low",     color: "#86EFAC", bg: "#131E13", border: "#1A4A1A" }
    if (s <= 60) return { label: "Medium",  color: "#FCD34D", bg: "#1E1A10", border: "#5C4A10" }
    if (s <= 80) return { label: "High",    color: "#FB923C", bg: "#1E1310", border: "#6A2D10" }
    return             { label: "Critical", color: "#F87171", bg: "#1E1010", border: "#5C1A1A" }
  }

  const full    = Math.PI * 80
  const offset  = full * (1 - score / 100)
  const burnout = getBurnout(score)

  const addTask = () => {
    if (!title.trim()) return
    setTasks(prev => [...prev, {
      id: Date.now(), title, domain,
      duration: duration || "30m",
      hidden: isHidden, priority, timeSlot,
      assignee: null, shareStatus: "Todo",
    }])
    setTitle(""); setDomain("Work"); setDuration("")
    setIsHidden(false); setPriority("Normal")
    setTimeSlot(getTimeOfDay()); setShowForm(false)
  }

  const toggleUrgent = (id) =>
    setTasks(prev => prev.map(t => t.id === id
      ? { ...t, priority: t.priority === "Urgent" ? "Normal" : "Urgent" } : t))

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const handleDragStart = (id) => setDragId(id)
  const handleDragOver  = (e, id) => { e.preventDefault(); setDragOverId(id) }
  const handleDrop      = (e, targetId) => {
    e.preventDefault()
    if (dragId === targetId) { setDragId(null); setDragOverId(null); return }
    setTasks(prev => {
      const list = [...prev]
      const fromIdx = list.findIndex(t => t.id === dragId)
      const toIdx   = list.findIndex(t => t.id === targetId)
      const [moved] = list.splice(fromIdx, 1)
      list.splice(toIdx, 0, moved)
      return list
    })
    setDragId(null); setDragOverId(null)
  }
  const handleDragEnd = () => { setDragId(null); setDragOverId(null) }

  const tabs = [
    { label: "Home", icon: "⬡" },
    { label: "Tasks", icon: "✦" },
    { label: "Insights", icon: "◈" },
    { label: "Share", icon: "⊕" },
  ]

  const card = { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "16px" }

  const sortedForHome = [...tasks].sort((a, b) => {
    if (a.priority === "Urgent" && b.priority !== "Urgent") return -1
    if (b.priority === "Urgent" && a.priority !== "Urgent") return 1
    return timeOrder.indexOf(a.timeSlot) - timeOrder.indexOf(b.timeSlot)
  })

  if (!userName) return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <Welcome onStart={n => setUserName(n)} />
    </div>
  )

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "390px", backgroundColor: C.bg, minHeight: "100vh", fontFamily: "Plus Jakarta Sans, sans-serif", position: "relative" }}>

        {/* ── HOME ── */}
        {screen === "Home" && (
          <div style={{ padding: "28px 20px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0, letterSpacing: "0.1em", fontWeight: "600" }}>HIDDEN OVERLOAD SYSTEM</p>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: C.text, margin: 0, marginTop: "2px" }}>
                  She<span style={{ color: C.purple }}>Balance</span> · Hey {userName} 👋
                </h1>
              </div>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: C.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: C.purpleLight, fontSize: "13px", border: `1px solid ${C.purple}`, flexShrink: 0 }}>
                {userName.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Time of day banner */}
            <div style={{ backgroundColor: "#1E1830", border: "1px solid #352B55", borderRadius: "12px", padding: "10px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>{timeLabel[getTimeOfDay()].split(" ")[0]}</span>
              <p style={{ fontSize: "12px", color: C.purpleLight, margin: 0, fontWeight: "600" }}>
                Good {getTimeOfDay()}, {userName} — here's your day at a glance
              </p>
            </div>

            {/* Gauge */}
            <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px", background: "linear-gradient(145deg,#1C1A2E,#221830)" }}>
              <svg width="200" height="130" viewBox="0 0 200 130" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="60%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#F87171" />
                  </linearGradient>
                </defs>
                <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#2A2740" strokeWidth="14" strokeLinecap="round" />
                <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="url(#ag)" strokeWidth="14" strokeLinecap="round"
                  style={{ strokeDasharray: full, strokeDashoffset: offset, transition: "stroke-dashoffset 0.8s ease" }} />
                <text x="100" y="92" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="40" fontWeight="800" fill="#F0EEFF">{score}</text>
                <text x="100" y="114" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="10" fill="#8B8FA8" letterSpacing="2">WORKLOAD SCORE</text>
                <text x="18" y="126" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="10" fill="#4B5563">0</text>
                <text x="182" y="126" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="10" fill="#4B5563">100</text>
              </svg>
              <p style={{ fontSize: "13px", fontWeight: "600", color: getStatusColor(score), margin: 0, marginTop: "4px" }}>{getStatusText(score)}</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "VISIBLE", value: (visibleMins / 60).toFixed(1) + "h", color: C.purpleLight },
                { label: "HIDDEN",  value: (hiddenMins / 60).toFixed(1) + "h",  color: "#FCA5A5" },
                { label: "BURNOUT", value: burnout.label,                        color: burnout.color },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: "700", color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "10px", color: C.muted, margin: 0, marginTop: "3px", letterSpacing: "0.06em" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {urgentCount > 0 && (
              <div style={{ backgroundColor: "#1E1310", border: "1px solid #6A2D10", borderRadius: "14px", padding: "12px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>🔴</span>
                <p style={{ fontSize: "13px", color: "#FCA5A5", margin: 0, fontWeight: "600" }}>{urgentCount} urgent {urgentCount === 1 ? "task" : "tasks"} — needs attention now</p>
              </div>
            )}

            {hiddenCount > 0 && (
              <div style={{ backgroundColor: "#1E1830", border: "1px solid #4C1D95", borderRadius: "14px", padding: "12px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>👁</span>
                <p style={{ fontSize: "13px", color: C.purpleLight, margin: 0, fontWeight: "600" }}>{hiddenCount} hidden {hiddenCount === 1 ? "task" : "tasks"} · {hiddenMins} mins invisible labor</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0, letterSpacing: "0.05em" }}>TODAY'S TASKS</h2>
              {tasks.length > 0 && <span style={{ fontSize: "12px", color: C.muted }}>{tasks.length} total</span>}
            </div>

            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", ...card }}>
                <p style={{ fontSize: "28px", margin: 0 }}>📝</p>
                <p style={{ fontSize: "14px", color: C.muted, marginTop: "10px" }}>No tasks yet.</p>
                <p style={{ fontSize: "12px", color: "#4B5563", marginTop: "4px" }}>Go to Tasks tab to add your work.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {timeOrder.map(slot => {
                  const slotTasks = sortedForHome.filter(t => t.timeSlot === slot)
                  if (slotTasks.length === 0) return null
                  return (
                    <div key={slot}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, marginBottom: "8px", letterSpacing: "0.08em" }}>{timeLabel[slot].toUpperCase()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {slotTasks.map(task => (
                          <div key={task.id} style={{ backgroundColor: C.card, borderRadius: "14px", padding: "13px 14px", border: `1px solid ${task.priority === "Urgent" ? "#6A2D10" : task.hidden ? "#4C1D95" : C.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                              {task.priority === "Urgent" && <span style={{ fontSize: "10px" }}>🔴</span>}
                              <p style={{ fontSize: "14px", fontWeight: "500", color: C.text, margin: 0, flex: 1 }}>{task.title}</p>
                              <span style={{ fontSize: "12px", color: C.muted, flexShrink: 0 }}>{task.duration}</span>
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "11px", backgroundColor: domainColors[task.domain].bg, color: domainColors[task.domain].text, padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: `1px solid ${domainColors[task.domain].border}` }}>{task.domain}</span>
                              {task.hidden && <span style={{ fontSize: "11px", color: C.purpleLight, backgroundColor: "#1E1830", padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: "1px solid #2D1F4E" }}>👁 Hidden</span>}
                              {task.priority === "Urgent" && <span style={{ fontSize: "11px", color: "#FCA5A5", backgroundColor: "#1E1310", padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: "1px solid #6A2D10" }}>🔴 Urgent</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TASKS ── */}
        {screen === "Tasks" && (
          <div style={{ padding: "28px 20px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: C.text, margin: 0 }}>My Tasks</h1>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>{tasks.length} tasks · {hiddenCount} hidden · {urgentCount} urgent</p>
              </div>
              <button onClick={() => setShowForm(!showForm)}
                style={{ backgroundColor: C.purple, color: "#fff", border: "none", borderRadius: "12px", padding: "10px 16px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                + Add
              </button>
            </div>

            {showForm && (
              <div style={{ ...card, marginBottom: "16px", border: `1px solid ${C.purple}` }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "14px" }}>New Task</p>

                <input type="text" placeholder="What do you need to do?" value={title} onChange={e => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "11px 13px", borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: "14px", marginBottom: "12px", outline: "none", fontFamily: "Plus Jakarta Sans,sans-serif", backgroundColor: "#0E0C1A", color: C.text, boxSizing: "border-box" }} />

                <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", letterSpacing: "0.06em" }}>DOMAIN</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {["Work", "Home", "Childcare", "Emotional"].map(d => (
                    <button key={d} onClick={() => setDomain(d)}
                      style={{ padding: "7px 13px", borderRadius: "20px", border: `1px solid ${domain === d ? domainColors[d].border : C.border}`, cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: domain === d ? domainColors[d].bg : "transparent", color: domain === d ? domainColors[d].text : C.muted, transition: "all 0.2s" }}>
                      {d}
                    </button>
                  ))}
                </div>

                <input type="text" placeholder="Duration e.g. 30m or 2h" value={duration} onChange={e => setDuration(e.target.value)}
                  style={{ width: "100%", padding: "11px 13px", borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: "14px", marginBottom: "12px", outline: "none", fontFamily: "Plus Jakarta Sans,sans-serif", backgroundColor: "#0E0C1A", color: C.text, boxSizing: "border-box" }} />

                <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", letterSpacing: "0.06em" }}>TIME OF DAY</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {["morning", "afternoon", "evening"].map(slot => (
                    <button key={slot} onClick={() => setTimeSlot(slot)}
                      style={{ padding: "7px 13px", borderRadius: "20px", border: `1px solid ${timeSlot === slot ? C.purple : C.border}`, cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: timeSlot === slot ? C.purpleDim : "transparent", color: timeSlot === slot ? C.purpleLight : C.muted, transition: "all 0.2s" }}>
                      {timeLabel[slot]}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", letterSpacing: "0.06em" }}>PRIORITY</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  {["Normal", "Urgent"].map(p => (
                    <button key={p} onClick={() => setPriority(p)}
                      style={{ padding: "7px 16px", borderRadius: "20px", border: `1px solid ${priority === p ? (p === "Urgent" ? "#6A2D10" : C.purple) : C.border}`, cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: priority === p ? (p === "Urgent" ? "#1E1310" : C.purpleDim) : "transparent", color: priority === p ? (p === "Urgent" ? "#FCA5A5" : C.purpleLight) : C.muted }}>
                      {p === "Urgent" ? "🔴 Urgent" : "Normal"}
                    </button>
                  ))}
                </div>

                <div onClick={() => setIsHidden(!isHidden)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isHidden ? "#1E1830" : "transparent", border: `1px solid ${isHidden ? C.purple : C.border}`, borderRadius: "12px", padding: "12px 14px", marginBottom: "14px", cursor: "pointer", transition: "all 0.3s" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: isHidden ? C.purpleLight : C.text, margin: 0 }}>👁 Hidden work</p>
                    <p style={{ fontSize: "11px", color: isHidden ? "#7C3AED" : C.muted, margin: 0, marginTop: "2px" }}>Emotional, mental or invisible labor</p>
                  </div>
                  <div style={{ width: "44px", height: "24px", borderRadius: "12px", backgroundColor: isHidden ? C.purple : "#2A2740", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: "3px", left: isHidden ? "22px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.3s" }} />
                  </div>
                </div>

                <button onClick={addTask}
                  style={{ width: "100%", backgroundColor: C.purple, color: "#fff", border: "none", borderRadius: "12px", padding: "13px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                  Add Task
                </button>
              </div>
            )}

            {tasks.length > 1 && (
              <div style={{ backgroundColor: "#1E1830", border: "1px solid #2D1F4E", borderRadius: "10px", padding: "8px 12px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px" }}>⠿</span>
                <p style={{ fontSize: "11px", color: C.purpleLight, margin: 0 }}>Drag tasks to reprioritize your order</p>
              </div>
            )}

            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", ...card }}>
                <p style={{ fontSize: "28px", margin: 0 }}>✦</p>
                <p style={{ fontSize: "14px", color: C.muted, marginTop: "10px" }}>No tasks yet. Tap + Add to begin.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {timeOrder.map(slot => {
                  const slotTasks = tasks.filter(t => t.timeSlot === slot)
                  if (slotTasks.length === 0) return null
                  return (
                    <div key={slot}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, marginBottom: "8px", letterSpacing: "0.08em" }}>{timeLabel[slot].toUpperCase()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {slotTasks.map(task => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task.id)}
                            onDragOver={e => handleDragOver(e, task.id)}
                            onDrop={e => handleDrop(e, task.id)}
                            onDragEnd={handleDragEnd}
                            style={{
                              ...card,
                              border: `1px solid ${dragOverId === task.id ? C.purple : task.priority === "Urgent" ? "#6A2D10" : task.hidden ? "#4C1D95" : C.border}`,
                              opacity: dragId === task.id ? 0.4 : 1,
                              cursor: "grab",
                              transition: "opacity 0.2s, border-color 0.2s",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                  <span style={{ color: C.muted, fontSize: "14px", userSelect: "none" }}>⠿</span>
                                  {task.priority === "Urgent" && <span style={{ fontSize: "10px" }}>🔴</span>}
                                  <p style={{ fontSize: "14px", fontWeight: "500", color: C.text, margin: 0 }}>{task.title}</p>
                                </div>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                  <span style={{ fontSize: "11px", backgroundColor: domainColors[task.domain].bg, color: domainColors[task.domain].text, padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: `1px solid ${domainColors[task.domain].border}` }}>{task.domain}</span>
                                  {task.hidden && <span style={{ fontSize: "11px", color: C.purpleLight, backgroundColor: "#1E1830", padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: "1px solid #2D1F4E" }}>👁 Hidden</span>}
                                  <span style={{ fontSize: "11px", color: C.muted }}>{task.duration}</span>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "6px", marginLeft: "8px", flexShrink: 0 }}>
                                <button onClick={() => toggleUrgent(task.id)}
                                  style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", border: `1px solid ${task.priority === "Urgent" ? "#6A2D10" : C.border}`, backgroundColor: task.priority === "Urgent" ? "#1E1310" : "transparent", color: task.priority === "Urgent" ? "#FCA5A5" : C.muted, cursor: "pointer", fontWeight: "600" }}>
                                  {task.priority === "Urgent" ? "Urgent" : "! Urgent"}
                                </button>
                                <button onClick={() => deleteTask(task.id)}
                                  style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "8px", border: `1px solid ${C.border}`, backgroundColor: "transparent", color: C.muted, cursor: "pointer" }}>✕</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── INSIGHTS ── */}
        {screen === "Insights" && (
          <div style={{ padding: "28px 20px 100px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>Insights</h1>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "20px" }}>Your real workload breakdown, {userName}.</p>

            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", ...card }}>
                <p style={{ fontSize: "28px", margin: 0 }}>◈</p>
                <p style={{ fontSize: "14px", color: C.muted, marginTop: "10px" }}>Add tasks to see your insights.</p>
              </div>
            ) : (
              <>
                <div style={{ backgroundColor: burnout.bg, border: `1px solid ${burnout.border}`, borderRadius: "16px", padding: "16px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span>{score > 80 ? "🚨" : score > 60 ? "⚠️" : score > 30 ? "🟡" : "✅"}</span>
                    <p style={{ fontSize: "15px", fontWeight: "700", color: burnout.color, margin: 0 }}>Burnout Risk: {burnout.label}</p>
                  </div>
                  <p style={{ fontSize: "13px", color: burnout.color, margin: 0, lineHeight: "1.6", opacity: 0.85 }}>
                    Workload score is <strong>{score}/100</strong>. {tasks.length} tasks totalling {(totalMins / 60).toFixed(1)} hours today.
                  </p>
                </div>

                <div style={{ backgroundColor: "#1E1830", border: "1px solid #2D1F4E", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span>✨</span>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: C.purpleLight, margin: 0 }}>System Insight</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "#A78BFA", margin: 0, lineHeight: "1.6" }}>
                    {hiddenCount === 0
                      ? `You have ${tasks.length} tasks today. Mark emotional or mental tasks as Hidden Work to reveal your true load.`
                      : `You have ${hiddenCount} hidden work ${hiddenCount === 1 ? "task" : "tasks"} worth ${hiddenMins} mins that nobody else sees. SheBalance sees it. It counts.`
                    }
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {[
                    { label: "TOTAL TASKS",   value: tasks.length,                    color: C.purpleLight },
                    { label: "HIDDEN TASKS",  value: hiddenCount,                     color: "#FCA5A5" },
                    { label: "VISIBLE HOURS", value: (visibleMins / 60).toFixed(1) + "h", color: C.purpleLight },
                    { label: "HIDDEN HOURS",  value: (hiddenMins / 60).toFixed(1) + "h",  color: "#FCA5A5" },
                  ].map(s => (
                    <div key={s.label} style={{ ...card }}>
                      <p style={{ fontSize: "22px", fontWeight: "700", color: s.color, margin: 0 }}>{s.value}</p>
                      <p style={{ fontSize: "10px", color: C.muted, margin: 0, marginTop: "4px", letterSpacing: "0.06em" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, marginBottom: "12px", letterSpacing: "0.08em" }}>LOAD BY TIME OF DAY</p>
                {timeOrder.map(slot => {
                  const count = tasks.filter(t => t.timeSlot === slot).length
                  if (count === 0) return null
                  const pct = Math.round((count / tasks.length) * 100)
                  return (
                    <div key={slot} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: C.purpleLight }}>{timeLabel[slot]}</span>
                        <span style={{ fontSize: "12px", color: C.muted }}>{count} task{count > 1 ? "s" : ""} · {pct}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#2A2740", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", backgroundColor: C.purpleLight, borderRadius: "10px", transition: "width 0.6s ease", opacity: 0.7 }} />
                      </div>
                    </div>
                  )
                })}

                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, marginBottom: "12px", marginTop: "20px", letterSpacing: "0.08em" }}>LOAD BY DOMAIN</p>
                {["Work", "Home", "Childcare", "Emotional"].map(d => {
                  const count = tasks.filter(t => t.domain === d).length
                  if (count === 0) return null
                  const pct = Math.round((count / tasks.length) * 100)
                  return (
                    <div key={d} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: domainColors[d].text }}>{d}</span>
                        <span style={{ fontSize: "12px", color: C.muted }}>{count} task{count > 1 ? "s" : ""} · {pct}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#2A2740", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", backgroundColor: domainColors[d].text, borderRadius: "10px", transition: "width 0.6s ease", opacity: 0.8 }} />
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* ── SHARE ── */}
        {screen === "Share" && <Share tasks={tasks} setTasks={setTasks} />}

        {/* ── BOTTOM NAV ── */}
        <div style={{ position: "fixed", bottom: 0, width: "390px", backgroundColor: "#100E1C", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "12px 0 20px" }}>
          {tabs.map(tab => (
            <div key={tab.label} onClick={() => setScreen(tab.label)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <span style={{ fontSize: "18px", color: tab.label === screen ? C.purple : C.muted }}>{tab.icon}</span>
              <span style={{ fontSize: "10px", color: tab.label === screen ? C.purpleLight : C.muted, fontWeight: tab.label === screen ? "700" : "400", letterSpacing: "0.06em" }}>{tab.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
