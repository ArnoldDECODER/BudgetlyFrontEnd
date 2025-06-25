import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import '../../styles/index.css';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Dummy data (move to a separate service or API call in a real app)
  const recentTransactions = [
    { id: 1, type: "expense", amount: 45.75, category: "Food", notes: "Dinner out", date: "2025-06-19" },
    { id: 2, type: "income", amount: 150.00, category: "Other", notes: "Freelance payment", date: "2025-06-18" },
    { id: 3, type: "expense", amount: 200.00, category: "Utilities", notes: "Electricity bill", date: "2025-06-15" },
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const financialGoalsSummary = [
    { id: 1, goalName: "Emergency Fund", targetAmount: 5000, currentAmount: 1500, targetDate: "2024-12-31" },
    { id: 2, goalName: "New Car Down Payment", targetAmount: 20000, currentAmount: 8000, targetDate: "2025-06-30" },
  ].map(goal => ({ ...goal, progress: (goal.currentAmount / goal.targetAmount) * 100 }));

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="greeting">Hello, {user?.name || user?.email?.split('@')[0] || "Guest"} 👋</h1>
        <p className="welcome-message">
          Welcome to <strong>Budgetly</strong> — where we help you find your financial freedom.
        </p>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-widget overview-widget">
          <h2 className="widget-title">Quick Overview</h2>
          <div className="overview-summary">
            <p>Total Income: <span className="income-text">R2600.00</span></p>
            <p>Total Expenses: <span className="expense-text">R300.00</span></p>
            <p>Net Savings: <span className="net-savings-text">R2300.00</span></p>
          </div>
          <p className="placeholder-text">Detailed analytics available in the "Analytics" section.</p>
        </section>

        <section className="dashboard-widget transactions-widget">
          <h2 className="widget-title">Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <ul className="recent-transactions-list">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <span className="transaction-item-category">{transaction.category}</span>
                  <span className="transaction-item-notes">{transaction.notes}</span>
                  <span className="transaction-item-amount">
                    {transaction.type === 'expense' ? '-' : '+'}R{transaction.amount.toFixed(2)}
                  </span>
                  <span className="transaction-item-date">{transaction.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="placeholder-text">No recent transactions to display.</p>
          )}
        </section>

        <section className="dashboard-widget goals-widget">
          <h2 className="widget-title">Your Goals Progress</h2>
          {financialGoalsSummary.length > 0 ? (
            <ul className="goals-progress-list">
              {financialGoalsSummary.map((goal) => (
                <li key={goal.id} className="goal-progress-item">
                  <div className="goal-info">
                    <span className="goal-name">{goal.goalName}</span>
                    <span className="goal-amounts">R{goal.currentAmount.toFixed(2)} / R{goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(goal.progress, 100)}%` }}></div>
                    <span className="progress-percentage">{goal.progress.toFixed(2)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="placeholder-text">No financial goals set yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;