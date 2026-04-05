const C = {
  bg: "#13111F", card: "#1C1A2E", border: "#2A2740",
  purple: "#7C3AED", purpleLight: "#A78BFA", purpleDim: "#2D1F4E",
  text: "#F0EEFF", muted: "#8B8FA8",
}

const domainColors = {
  Work:      { bg: "#1E1830", text: "#A78BFA", border: "#352B55" },
  Home:      { bg: "#131E28", text: "#67E8F9", border: "#1A4A60" },
  Childcare: { bg: "#131E13", text: "#86EFAC", border: "#1A4A1A" },
  Emotional: { bg: "#1E1318", text: "#FCA5A5", border: "#5C1A1A" },
}

const columns = ["Todo", "InProgress", "Done"]
const colLabels = { Todo: "To Do", InProgress: "In Progress", Done: "Done" }
const colDot    = { Todo: C.muted, InProgress: "#FCD34D", Done: "#86EFAC" }
const colBorder = { Todo: C.border, InProgress: "#713F12", Done: "#14532D" }

export default function Share({ tasks, setTasks }) {
  // tasks from App — we mutate assignee & shareStatus via setTasks

  const assignTask = (id, assignee) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignee } : t))

  const moveTask = (id, direction) => {
    const order = ["Todo", "InProgress", "Done"]
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const idx  = order.indexOf(t.shareStatus)
      const next = order[idx + direction]
      return next ? { ...t, shareStatus: next } : t
    }))
  }

  // Only tasks that have been assigned show in kanban
  const assignedTasks   = tasks.filter(t => t.assignee !== null)
  const unassignedTasks = tasks.filter(t => t.assignee === null)

  const youCount     = assignedTasks.filter(t => t.assignee === "You").length
  const partnerCount = assignedTasks.filter(t => t.assignee === "Partner").length
  const total        = assignedTasks.length
  const youPct       = total === 0 ? 50 : Math.round((youCount / total) * 100)
  const partnerPct   = 100 - youPct

  return (
    <div style={{ padding: "28px 20px 100px", fontFamily: "Plus Jakarta Sans, sans-serif", backgroundColor: C.bg, minHeight: "100vh" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>Shared Weekly Plan</h1>
      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "20px" }}>Assign your tasks and track them together</p>

      {/* Unassigned tasks — assign from here */}
      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", backgroundColor: C.card, border: `1px dashed ${C.border}`, borderRadius: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "28px", margin: 0 }}>⚖️</p>
          <p style={{ fontSize: "14px", color: C.muted, marginTop: "10px" }}>No tasks yet.</p>
          <p style={{ fontSize: "12px", color: "#4B5563", marginTop: "4px" }}>Add tasks in the Tasks tab first, then assign them here.</p>
        </div>
      ) : (
        <>
          {unassignedTasks.length > 0 && (
            <div style={{ backgroundColor: C.card, border: `1px solid ${C.purple}`, borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, marginBottom: "4px" }}>📋 Assign tasks to your plan</p>
              <p style={{ fontSize: "11px", color: C.muted, marginBottom: "14px" }}>{unassignedTasks.length} task{unassignedTasks.length !== 1 ? "s" : ""} waiting to be assigned</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {unassignedTasks.map(task => (
                  <div key={task.id} style={{ backgroundColor: "#0E0C1A", borderRadius: "12px", padding: "12px 14px", border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      {task.priority === "Urgent" && <span style={{ fontSize: "10px" }}>🔴</span>}
                      <p style={{ fontSize: "13px", fontWeight: "600", color: C.text, margin: 0, flex: 1 }}>{task.title}</p>
                      <span style={{ fontSize: "11px", backgroundColor: domainColors[task.domain].bg, color: domainColors[task.domain].text, padding: "2px 8px", borderRadius: "20px", fontWeight: "600", border: `1px solid ${domainColors[task.domain].border}`, flexShrink: 0 }}>{task.domain}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => assignTask(task.id, "You")}
                        style={{ flex: 1, padding: "7px", borderRadius: "8px", border: `1px solid ${C.purple}`, cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: C.purpleDim, color: C.purpleLight }}>
                        Assign to me
                      </button>
                      <button onClick={() => assignTask(task.id, "Partner")}
                        style={{ flex: 1, padding: "7px", borderRadius: "8px", border: "1px solid #14532D", cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: "#0F1A0F", color: "#86EFAC" }}>
                        Assign to partner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fairness score — only if tasks are assigned */}
          {total > 0 && (
            <>
              <div style={{ backgroundColor: "#1E1830", border: "1px solid #2D1F4E", borderRadius: "14px", padding: "12px 16px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: C.purpleLight, margin: 0 }}>📅 This week · {total} task{total !== 1 ? "s" : ""} assigned</p>
                <p style={{ fontSize: "12px", color: "#7C3AED", margin: 0, marginTop: "3px" }}>You: {youCount} · Partner: {partnerCount}</p>
              </div>

              <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, marginBottom: "14px", letterSpacing: "0.08em" }}>WORKLOAD FAIRNESS SCORE</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "8px", backgroundColor: C.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: C.purpleLight, border: `1px solid ${C.purple}` }}>YO</div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>You</span>
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: youPct > 60 ? "#F87171" : "#86EFAC" }}>{youPct}%</span>
                </div>

                <div style={{ height: "8px", backgroundColor: "#1E1B2E", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
                  <div style={{ height: "100%", width: youPct + "%", background: youPct > 60 ? "linear-gradient(90deg,#7C3AED,#F87171)" : "linear-gradient(90deg,#7C3AED,#86EFAC)", borderRadius: "10px", transition: "width 0.8s ease" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "8px", backgroundColor: "#0F1A0F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#86EFAC", border: "1px solid #14532D" }}>PA</div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>Partner</span>
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: "#86EFAC" }}>{partnerPct}%</span>
                </div>

                {youPct > 60 && (
                  <div style={{ marginTop: "12px", backgroundColor: "#1A100F", border: "1px solid #7F1D1D", borderRadius: "10px", padding: "10px 12px" }}>
                    <p style={{ fontSize: "12px", color: "#FCA5A5", margin: 0, lineHeight: "1.5" }}>⚠️ You're carrying more than your fair share. Consider reassigning some tasks to your partner.</p>
                  </div>
                )}
                {youPct <= 60 && youPct >= 40 && (
                  <div style={{ marginTop: "12px", backgroundColor: "#0F1A0F", border: "1px solid #14532D", borderRadius: "10px", padding: "10px 12px" }}>
                    <p style={{ fontSize: "12px", color: "#86EFAC", margin: 0 }}>✅ Workload is fairly balanced this week.</p>
                  </div>
                )}
              </div>

              {/* Kanban */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {columns.map(col => {
                  const colTasks = assignedTasks.filter(t => t.shareStatus === col)
                  return (
                    <div key={col}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colDot[col] }} />
                        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: 0 }}>{colLabels[col]}</p>
                        <span style={{ fontSize: "11px", color: C.muted }}>({colTasks.length})</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {colTasks.map(task => (
                          <div key={task.id} style={{ backgroundColor: C.card, borderRadius: "12px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${colBorder[col]}` }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                {task.priority === "Urgent" && <span style={{ fontSize: "10px" }}>🔴</span>}
                                <p style={{ fontSize: "13px", fontWeight: "500", color: C.text, margin: 0 }}>{task.title}</p>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px" }}>
                                <div style={{ width: "20px", height: "20px", borderRadius: "6px", backgroundColor: task.assignee === "You" ? C.purpleDim : "#0F1A0F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: task.assignee === "You" ? C.purpleLight : "#86EFAC", border: `1px solid ${task.assignee === "You" ? C.purple : "#14532D"}` }}>
                                  {task.assignee === "You" ? "Y" : "P"}
                                </div>
                                <span style={{ fontSize: "11px", color: C.muted }}>{task.assignee} · {task.duration}</span>
                                <span style={{ fontSize: "11px", backgroundColor: domainColors[task.domain].bg, color: domainColors[task.domain].text, padding: "1px 6px", borderRadius: "20px", fontWeight: "600", border: `1px solid ${domainColors[task.domain].border}` }}>{task.domain}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "8px" }}>
                              {col !== "Todo" && (
                                <button onClick={() => moveTask(task.id, -1)}
                                  style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px", border: `1px solid ${C.border}`, backgroundColor: "transparent", color: C.muted, cursor: "pointer" }}>←</button>
                              )}
                              {col !== "Done" && (
                                <button onClick={() => moveTask(task.id, 1)}
                                  style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px", border: `1px solid ${C.border}`, backgroundColor: "transparent", color: C.purpleLight, cursor: "pointer" }}>→</button>
                              )}
                            </div>
                          </div>
                        ))}
                        {colTasks.length === 0 && (
                          <div style={{ padding: "16px", textAlign: "center", border: `1px dashed ${C.border}`, borderRadius: "12px" }}>
                            <p style={{ fontSize: "12px", color: "#4B5563", margin: 0 }}>No tasks here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
