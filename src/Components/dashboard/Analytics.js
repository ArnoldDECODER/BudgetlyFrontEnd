import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // For data labels
import '../../styles/index.css';

// Register Chart.js components and datalabels plugin
Chart.register(...registerables, ChartDataLabels);

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load initial data from localStorage and dummy data
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const storedGoals = JSON.parse(localStorage.getItem('financialGoals') || '[]');
    const dummyTransactions = [
      { id: Date.now() + 1, type: "income", amount: 2500, date: "2024-06-01", category: "Salary", notes: "Monthly salary" },
      { id: Date.now() + 2, type: "expense", amount: 50, date: "2024-06-03", category: "Food", notes: "Groceries" },
      { id: Date.now() + 3, type: "expense", amount: 120, date: "2024-06-05", category: "Entertainment", notes: "Movie tickets" },
      { id: Date.now() + 4, type: "income", amount: 100, date: "2024-06-10", category: "Other", notes: "Freelance work" },
    ];
    const dummyGoals = [
      { id: Date.now() + 5, goalName: "Emergency Fund", targetAmount: 5000, currentAmount: 1500, targetDate: "2024-12-31", description: "Build a safety net", status: "Active" },
      { id: Date.now() + 6, goalName: "New Car Down Payment", targetAmount: 20000, currentAmount: 8000, targetDate: "2025-06-30", description: "Saving for a car", status: "Active" },
    ];
    const combinedTransactions = [...dummyTransactions, ...storedTransactions];
    const combinedGoals = [...dummyGoals, ...storedGoals];
    setTransactions(combinedTransactions);
    setGoals(combinedGoals);
    localStorage.setItem('transactions', JSON.stringify(combinedTransactions));
    localStorage.setItem('financialGoals', JSON.stringify(combinedGoals));
    console.log("Initialized data - Transactions:", combinedTransactions, "Goals:", combinedGoals);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with database when online
  useEffect(() => {
    if (isOnline) {
      const token = localStorage.getItem("token");
      const syncData = async () => {
        try {
          const resTransactions = await fetch("http://localhost:3000/api/transactions", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (resTransactions.ok) {
            const dbTransactions = await resTransactions.json();
            const updatedTransactions = [...transactions, ...dbTransactions.filter(t => !transactions.some(tt => tt.id === t.id))];
            setTransactions(updatedTransactions);
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
          }

          const resGoals = await fetch("http://localhost:3000/api/financial-goals", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (resGoals.ok) {
            const dbGoals = await resGoals.json();
            const updatedGoals = [...goals, ...dbGoals.filter(g => !goals.some(gg => gg.id === g.id))];
            setGoals(updatedGoals);
            localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
          }
        } catch (err) {
          console.error("Sync error:", err);
        }
      };
      syncData();
      const interval = setInterval(syncData, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOnline, transactions, goals]);

  // Render charts when data changes
  useEffect(() => {
    if (transactions.length > 0 || goals.length > 0) {
      console.log("Rendering charts with transactions:", transactions, "goals:", goals);
      renderCharts();
    }
  }, [transactions, goals]);

  const renderCharts = () => {
    // Destroy existing charts
    ["expenseIncomeChart", "categoryPieChart", "goalProgressChart"].forEach(id => {
      const ctx = Chart.getChart(id);
      if (ctx) ctx.destroy();
    });

    // Bar Chart: Expenses vs Income over Time
    const barCtx = document.getElementById("expenseIncomeChart")?.getContext("2d");
    if (barCtx && transactions.length > 0) {
      const labels = [...new Set(transactions.map(t => t.date))].sort();
      const incomeData = labels.map(date =>
        transactions.filter(t => t.date === date && t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      );
      const expenseData = labels.map(date =>
        transactions.filter(t => t.date === date && t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      );

      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              borderColor: "rgba(0, 123, 255, 1)",
              borderWidth: 1
            },
            {
              label: "Expenses",
              data: expenseData,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, ticks: { color: "#ffffff" } },
            x: { ticks: { color: "#ffffff" } }
          },
          plugins: {
            legend: { labels: { color: "#ffffff" }, position: "top" },
            title: { display: true, text: "Income vs Expenses Over Time", color: "#ffffff", font: { size: 16 } },
            datalabels: {
              color: "#ffffff",
              anchor: 'end',
              align: 'top',
              formatter: (value) => value > 0 ? `R${value.toFixed(2)}` : '',
              font: { weight: 'bold' }
            }
          }
        }
      });
    }

    // Pie Chart: Transaction Categories
    const pieCtx = document.getElementById("categoryPieChart")?.getContext("2d");
    if (pieCtx && transactions.length > 0) {
      const amountByCategory = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      const pieLabels = Object.keys(amountByCategory);
      const pieData = Object.values(amountByCategory);

      new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: pieLabels,
          datasets: [{
            label: "Amount by Category (R)",
            data: pieData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(255, 159, 64, 0.7)",
              "rgba(199, 199, 199, 0.7)", "rgba(83, 102, 255, 0.7)"
            ],
            borderWidth: 1,
            borderColor: "#ffffff"
          }]
        },
        options: {
          plugins: {
            legend: { labels: { color: "#ffffff" }, position: "right" },
            title: { display: true, text: "Transaction Categories", color: "#ffffff", font: { size: 16 } },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              formatter: (value, ctx) => `R${value.toFixed(2)}`,
              font: { weight: 'bold' }
            }
          }
        }
      });
    }

    // Bar Chart: Goal Progress
    const goalBarCtx = document.getElementById("goalProgressChart")?.getContext("2d");
    if (goalBarCtx && goals.length > 0) {
      // Limit to top 7 goals based on currentAmount
      const sortedGoals = [...goals].sort((a, b) => b.currentAmount - a.currentAmount).slice(0, 7);
      const goalLabels = sortedGoals.map(g => g.goalName);
      const goalData = sortedGoals.map(g => g.currentAmount);
      const goalTargets = sortedGoals.map(g => g.targetAmount);

      new Chart(goalBarCtx, {
        type: "bar",
        data: {
          labels: goalLabels,
          datasets: [
            {
              label: "Current Amount",
              data: goalData,
              backgroundColor: "rgba(20, 145, 234, 0.5)",
              borderColor: "rgb(234, 232, 229)",
              borderWidth: 1
            },
            {
              label: "Target Amount",
              data: goalTargets,
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              borderColor: "rgba(0, 123, 255, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, ticks: { color: "#ffffff" } },
            x: { ticks: { color: "#ffffff" } }
          },
          plugins: {
            legend: { labels: { color: "#ffffff" }, position: "top" },
            title: { display: true, text: "Goal Progress", color: "#ffffff", font: { size: 16 } },
            datalabels: {
              color: "#ffffff",
              anchor: 'end',
              align: 'top',
              formatter: (value) => `R${value.toFixed(2)}`,
              font: { weight: 'bold' }
            }
          },
          // Adjust bar spacing and width
          barPercentage: 0.8, // Adjust bar width (0-1, where 1 is full width)
          categoryPercentage: 0.6 // Adjust category spacing
        }
      });
    }
  };

  return (
    <div className="analytics-container">
      <h2 className="section-title">Financial Analytics</h2>
      <div className="chart-card">
        <canvas id="expenseIncomeChart" style={{ maxHeight: "400px" }}></canvas>
      </div>
      <div className="chart-card">
        <canvas id="categoryPieChart" style={{ maxHeight: "400px" }}></canvas>
      </div>
      <div className="chart-card">
        <canvas id="goalProgressChart" style={{ maxHeight: "400px" }}></canvas>
      </div>
      <div style={{ marginTop: "20px", color: "#6b7280" }}>
        {transactions.length === 0 && <p>No transaction data available.</p>}
        {goals.length === 0 && <p>No goal data available.</p>}
      </div>
    </div>
  );
};

export default Analytics;