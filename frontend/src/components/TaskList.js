import React from "react";
import "./TaskList.css";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  loading,
  filterStatus,
  onFilterChange,
  onTaskUpdate,
}) {
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>📝 Tasks ({tasks.length})</h2>

        <div className="filter-controls">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task above!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={onTaskUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
