import React, { useState, useEffect } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Insights from "./components/Insights";
import api from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch tasks from API
  const fetchTasks = async (status = "") => {
    try {
      setLoading(true);
      const data = await api.getTasks(status);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch insights
  const fetchInsights = async () => {
    try {
      const data = await api.getInsights();
      setInsights(data);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchTasks();
    fetchInsights();
  }, []);

  // Reload when filter changes
  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  const handleTaskCreated = async (newTask) => {
    try {
      const created = await api.createTask(newTask);
      // Refresh tasks and insights
      await fetchTasks(filterStatus);
      await fetchInsights();
      return created;
    } catch (err) {
      setError("Failed to create task");
      throw err;
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await api.updateTask(taskId, updates);
      // Refresh tasks and insights
      await fetchTasks(filterStatus);
      await fetchInsights();
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Task Tracker</h1>
        <p>Manage your tasks with smart insights</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="main-content">
        <div className="left-panel">
          <TaskForm onTaskCreated={handleTaskCreated} />

          <TaskList
            tasks={tasks}
            loading={loading}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onTaskUpdate={handleTaskUpdate}
          />
        </div>

        <div className="right-panel">
          <Insights insights={insights} />
        </div>
      </div>
    </div>
  );
}

export default App;
