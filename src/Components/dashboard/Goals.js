import React, { useState, useEffect } from "react";
import '../../styles/index.css';

const Goals = () => {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newGoal = {
      id: Date.now(),
      goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate,
      description,
      status: "Active",
    };

    try {
      const res = await fetch("http://localhost:3000/api/financial-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ goalName, targetAmount, currentAmount, targetDate, description }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Financial goal saved successfully!");
        fetchGoals(); // Update goals from server
        // Clear form fields
        setGoalName("");
        setTargetAmount("");
        setCurrentAmount("");
        setTargetDate("");
        setDescription("");
      } else {
        console.error("API Error:", data.message || "Failed to save financial goal");
        alert(data.message || "Failed to save financial goal");
        // Fallback: Add to local state if API fails
        setGoals((prevGoals) => [...prevGoals, newGoal]);
        localStorage.setItem('dummyFinancialGoals', JSON.stringify([...goals, newGoal]));
      }
    } catch (err) {
      console.error("Server error while saving goal:", err);
      alert("Server error while saving financial goal");
      // Fallback: Add to local state on error
      setGoals((prevGoals) => [...prevGoals, newGoal]);
      localStorage.setItem('dummyFinancialGoals', JSON.stringify([...goals, newGoal]));
    }

    console.log("Financial Goal to save (local demo):", newGoal);
  };

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/financial-goals", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setGoals(data);
      } else {
        console.log("API error, using dummy goals:", res.statusText);
        const dummyGoals = JSON.parse(localStorage.getItem('dummyFinancialGoals')) || [
          { id: 1, goalName: "Emergency Fund", targetAmount: 5000, currentAmount: 1500, targetDate: "2024-12-31", description: "Build a safety net for unexpected expenses.", status: "Active" },
          { id: 2, goalName: "New Car Down Payment", targetAmount: 20000, currentAmount: 8000, targetDate: "2025-06-30", description: "Saving for a down payment on a new car.", status: "Active" },
        ];
        setGoals(dummyGoals);
      }
    } catch (err) {
      console.error("Server error while fetching goals:", err);
      const dummyGoals = [
        { id: 1, goalName: "Emergency Fund", targetAmount: 5000, currentAmount: 1500, targetDate: "2024-12-31", description: "Build a safety net for unexpected expenses.", status: "Active" },
        { id: 2, goalName: "New Car Down Payment", targetAmount: 20000, currentAmount: 8000, targetDate: "2025-06-30", description: "Saving for a down payment on a new car.", status: "Active" },
      ];
      setGoals(dummyGoals);
    }
  };

  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/financial-progress", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProgress(data);
      } else {
        console.log("API error, using dummy progress:", res.statusText);
        const dummyProgress = [
          { id: 1, goalName: "Emergency Fund", date: "2024-05-01", savedAmount: 500, percentage: "10%" },
          { id: 2, goalName: "New Car Down Payment", date: "2024-04-15", savedAmount: 1000, percentage: "5%" },
          { id: 3, goalName: "Emergency Fund", date: "2024-06-01", savedAmount: 700, percentage: "14%" },
        ];
        setProgress(dummyProgress);
      }
    } catch (err) {
      console.error("Server error while fetching progress:", err);
      const dummyProgress = [
        { id: 1, goalName: "Emergency Fund", date: "2024-05-01", savedAmount: 500, percentage: "10%" },
        { id: 2, goalName: "New Car Down Payment", date: "2024-04-15", savedAmount: 1000, percentage: "5%" },
        { id: 3, goalName: "Emergency Fund", date: "2024-06-01", savedAmount: 700, percentage: "14%" },
      ];
      setProgress(dummyProgress);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    localStorage.setItem('dummyFinancialGoals', JSON.stringify(goals));
  }, [goals]);

  return (
    <div className="goals-container">
      <div className="goal-card">
        <h2 className="goal-section-title">Set Your Financial Goals</h2>
        <form onSubmit={handleSaveGoal} className="goal-form">
          <div className="form-group">
            <label htmlFor="goalName">Goal Name</label>
            <input
              type="text"
              className="form-control"
              id="goalName"
              placeholder="e.g., New Car Down Payment, Emergency Fund"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAmount">Target Amount (R)</label>
            <input
              type="number"
              className="form-control"
              id="targetAmount"
              placeholder="Enter target amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentAmount">Currently Saved (R)</label>
            <input
              type="number"
              className="form-control"
              id="currentAmount"
              placeholder="Enter current saved amount"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">Target Date</label>
            <input
              type="date"
              className="form-control"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Add notes about your goal"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary goal-submit-btn">Save Financial Goal</button>
        </form>
      </div>

      <div className="goal-card mt-4">
        <h2 className="goal-section-title">My Financial Goals</h2>
        <div className="button-container">
          <button onClick={fetchGoals} className="btn btn-primary">Refresh Goals</button>
        </div>
        <ul className="list-group goal-list">
          {goals.length > 0 ? (
            goals.map((goal) => {
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <li key={goal.id} className="list-group-item">
                  <strong>{goal.goalName}</strong><br />
                  Target: ${goal.targetAmount.toFixed(2)} | Saved: R{goal.currentAmount.toFixed(2)} | By: {goal.targetDate}
                  {goal.description && <p className="goal-description">Notes: {goal.description}</p>}
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                    <span className="progress-text">{progressPercentage.toFixed(2)}%</span>
                  </div>
                  <span className={`goal-status ${goal.status === 'Active' ? 'status-active' : 'status-completed'}`}>
                    {goal.status}
                  </span>
                </li>
              );
            })
          ) : (
            <li className="list-group-item no-goals">No financial goals saved yet.</li>
          )}
        </ul>
      </div>

      <div className="goal-card mt-4">
        <h2 className="goal-section-title">Financial Progress</h2>
        <div className="button-container">
          <button onClick={() => { fetchProgress(); setShowProgress(!showProgress); }} className="btn btn-primary">
            {showProgress ? "Hide Progress" : "View Progress"}
          </button>
        </div>
        {showProgress && (
          <div id="progressSection" className="progress-section-content">
            <div className="card">
              <div className="card-body">
                <ul id="progressList" className="list-group progress-list">
                  {progress.length > 0 ? (
                    progress.map((item) => (
                      <li key={item.id} className="list-group-item">
                        <strong>{item.goalName}:</strong> Saved R{item.savedAmount.toFixed(2)} on {item.date} ({item.percentage} complete)
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item no-progress">No financial progress recorded yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;