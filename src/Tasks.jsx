import { useState } from "react"

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finish Q3 report", domain: "Work", duration: "2h", hidden: false },
    { id: 2, title: "School pickup 3pm", domain: "Childcare", duration: "1h", hidden: false },
    { id: 3, title: "Grocery run", domain: "Home", duration: "45m", hidden: false },
    { id: 4, title: "Call mom - she's stressed", domain: "Emotional", duration: "30m", hidden: true },
    { id: 5, title: "Plan weekend meals", domain: "Home", duration: "20m", hidden: true },
  ])

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [domain, setDomain] = useState("Work")
  const [duration, setDuration] = useState("")
  const [isHidden, setIsHidden] = useState(false)

  const domainColors = {
    Work: { bg: "#E6F1FB", text: "#0C447C" },
    Childcare: { bg: "#EAF3DE", text: "#27500A" },
    Home: { bg: "#FAEEDA", text: "#633806" },
    Emotional: { bg: "#FAECE7", text: "#712B13" },
  }

  const addTask = () => {
    if (!title.trim()) return
    const newTask = {
      id: tasks.length + 1,
      title,
      domain,
      duration: duration || "—",
      hidden: isHidden,
    }
    setTasks([...tasks, newTask])
    setTitle("")
    setDomain("Work")
    setDuration("")
    setIsHidden(false)
    setShowForm(false)
  }

  const hiddenCount = tasks.filter(t => t.hidden).length
  const hiddenMins = tasks.filter(t => t.hidden).reduce((acc, t) => {
    const num = parseInt(t.duration)
    return acc + (isNaN(num) ? 30 : num)
  }, 0)

  return (
    <div style={{ padding: "24px 20px 100px", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1A1A2E", margin: 0 }}>My Tasks</h1>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>{tasks.length} tasks today</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: "#4A90D9", color: "#fff", border: "none", borderRadius: "12px", padding: "10px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          + Add Task
        </button>
      </div>

      {/* Hidden Work Summary */}
      <div style={{ backgroundColor: "#FAECE7", border: "1px solid #E8734A", borderRadius: "16px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#712B13", margin: 0 }}>
          👁 {hiddenCount} hidden work tasks this week
        </p>
        <p style={{ fontSize: "12px", color: "#993C1D", margin: 0, marginTop: "3px" }}>
          Approx {hiddenMins} mins of invisible labor not counted anywhere else
        </p>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#1A1A2E", marginBottom: "12px" }}>New Task</p>

          {/* Title */}
          <input
            type="text"
            placeholder="What do you need to do?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", outline: "none", fontFamily: "DM Sans, sans-serif" }}
          />

          {/* Domain Picker */}
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>Domain</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            {["Work", "Home", "Childcare", "Emotional"].map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600", backgroundColor: domain === d ? domainColors[d].bg : "#F0F0F0", color: domain === d ? domainColors[d].text : "#888" }}>
                {d}
              </button>
            ))}
          </div>

          {/* Duration */}
          <input
            type="text"
            placeholder="Duration e.g. 30m or 1h"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", outline: "none", fontFamily: "DM Sans, sans-serif" }}
          />

          {/* Hidden Work Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isHidden ? "#FAECE7" : "#fff", border: isHidden ? "1px solid #E8734A" : "1px solid #E5E7EB", borderRadius: "12px", padding: "12px 14px", marginBottom: "14px" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: isHidden ? "#712B13" : "#1A1A2E", margin: 0 }}>👁 Hidden work</p>
              <p style={{ fontSize: "11px", color: isHidden ? "#993C1D" : "#888", margin: 0, marginTop: "2px" }}>Emotional, mental or invisible labor</p>
            </div>
            <div
              onClick={() => setIsHidden(!isHidden)}
              style={{ width: "44px", height: "24px", borderRadius: "12px", backgroundColor: isHidden ? "#E8734A" : "#E5E7EB", cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
              <div style={{ position: "absolute", top: "3px", left: isHidden ? "22px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.3s" }}></div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={addTask}
            style={{ width: "100%", backgroundColor: "#4A90D9", color: "#fff", border: "none", borderRadius: "12px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            Add Task
          </button>
        </div>
      )}

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map(task => (
          <div key={task.id} style={{ backgroundColor: "#F8FAFC", borderRadius: "12px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: task.hidden ? "1px dashed #E8734A" : "1px solid #F0F0F0" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#1A1A2E", margin: 0 }}>{task.title}</p>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", backgroundColor: domainColors[task.domain].bg, color: domainColors[task.domain].text, padding: "2px 8px", borderRadius: "20px", fontWeight: "500" }}>
                  {task.domain}
                </span>
                {task.hidden && (
                  <span style={{ fontSize: "11px", color: "#E8734A", fontWeight: "500" }}>👁 Hidden work</span>
                )}
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888" }}>{task.duration}</span>
          </div>
        ))}
      </div>

    </div>
  )
}