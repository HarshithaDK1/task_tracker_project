import React from "react";
import "./Insights.css";

function Insights({ insights }) {
  if (!insights) {
    return (
      <div className="insights-container">
        <h2>📊 Insights</h2>
        <p className="loading-insights">Loading insights...</p>
      </div>
    );
  }

  const {
    total_tasks,
    tasks_by_status,
    tasks_by_priority,
    due_soon_count,
    overdue_count,
    busiest_day,
    summary_message,
  } = insights;

  return (
    <div className="insights-container">
      <h2>📊 Insights</h2>

      <div className="insight-card summary-card">
        <p className="summary-text">{summary_message}</p>
      </div>

      <div className="insight-card">
        <h3>Overview</h3>
        <div className="stat-row">
          <span>Total Tasks:</span>
          <strong>{total_tasks}</strong>
        </div>
        <div className="stat-row">
          <span>Due Soon (7 days):</span>
          <strong className="highlight">{due_soon_count}</strong>
        </div>
        {overdue_count > 0 && (
          <div className="stat-row">
            <span>Overdue:</span>
            <strong className="warning">{overdue_count}</strong>
          </div>
        )}
        {busiest_day && (
          <div className="stat-row">
            <span>Busiest Day:</span>
            <strong>{busiest_day}</strong>
          </div>
        )}
      </div>

      <div className="insight-card">
        <h3>By Status</h3>
        {Object.entries(tasks_by_status).map(([status, count]) => (
          <div key={status} className="stat-row">
            <span>{formatStatus(status)}:</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      <div className="insight-card">
        <h3>By Priority</h3>
        {Object.entries(tasks_by_priority).map(([priority, count]) => (
          <div key={priority} className="stat-row priority-row">
            <span className={`priority-label priority-${priority}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}:
            </span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatStatus(status) {
  const labels = {
    todo: "To Do",
    in_progress: "In Progress",
    completed: "Completed",
  };
  return labels[status] || status;
}

export default Insights;
