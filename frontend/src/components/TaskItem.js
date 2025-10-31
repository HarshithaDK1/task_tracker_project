import React, { useState } from "react";
import "./TaskItem.css";

function TaskItem({ task, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "#4caf50",
      medium: "#ff9800",
      high: "#ff5722",
      critical: "#d32f2f",
    };
    return colors[priority] || "#999";
  };

  const getStatusDisplay = (status) => {
    const labels = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const isOverdue = () => {
    if (!task.due_date || task.status === "completed") return false;
    return new Date(task.due_date) < new Date();
  };

  return (
    <div className={`task-item ${task.status}`}>
      <div className="task-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="task-main-info">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
            <span className="status-badge">
              {getStatusDisplay(task.status)}
            </span>
            <span className={`due-date ${isOverdue() ? "overdue" : ""}`}>
              {isOverdue() && "⚠️ "}
              {formatDate(task.due_date)}
            </span>
          </div>
        </div>
        <button className="expand-btn">{isExpanded ? "▲" : "▼"}</button>
      </div>

      {isExpanded && (
        <div className="task-details">
          {task.description && (
            <div className="task-description">
              <strong>Description:</strong>
              <p>{task.description}</p>
            </div>
          )}

          <div className="task-actions">
            <label>Update Status:</label>
            <div className="status-buttons">
              <button
                className={task.status === "todo" ? "active" : ""}
                onClick={() => handleStatusChange("todo")}
              >
                To Do
              </button>
              <button
                className={task.status === "in_progress" ? "active" : ""}
                onClick={() => handleStatusChange("in_progress")}
              >
                In Progress
              </button>
              <button
                className={task.status === "completed" ? "active" : ""}
                onClick={() => handleStatusChange("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="task-timestamps">
            <small>Created: {formatDate(task.created_at)}</small>
            <small>Updated: {formatDate(task.updated_at)}</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
