import React, { useState, useEffect } from "react";
// import "./Transactions.css"; // Custom CSS for this component
import '../../styles/index.css';

const Transactions = () => {
  // State for the transaction form inputs
  const [type, setType] = useState("expense"); // 'income' or 'expense'
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [transactions, setTransactions] = useState([]); // State to store all transactions
  const [isEditing, setIsEditing] = useState(false); // To determine if we are editing an existing transaction
  const [currentTransactionId, setCurrentTransactionId] = useState(null); // ID of the transaction being edited

  // Dummy categories for the dropdown (you'd likely fetch these from your backend)
  const [categories, setCategories] = useState([
    "Food", "Utilities", "Rent", "Entertainment", "Transport", "Salary", "Investments", "Other"
  ]);
  const [newCategory, setNewCategory] = useState(""); // State for adding new categories

  // --- API Interaction Placeholders ---

  // Function to fetch all transactions from the backend
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/transactions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        console.error("Failed to fetch transactions:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    // Dummy data for demonstration if backend is not connected
    const dummyTransactions = JSON.parse(localStorage.getItem('dummyTransactions')) || [
      { id: 1, type: "income", amount: 2500, date: "2024-06-01", category: "Salary", notes: "Monthly salary" },
      { id: 2, type: "expense", amount: 50, date: "2024-06-03", category: "Food", notes: "Groceries" },
      { id: 3, type: "expense", amount: 120, date: "2024-06-05", category: "Entertainment", notes: "Movie tickets" },
      { id: 4, type: "income", amount: 100, date: "2024-06-10", category: "Other", notes: "Freelance work" },
    ];
    setTransactions(dummyTransactions);
  };

  // Function to handle adding a new transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    const newTransaction = { type, amount: parseFloat(amount), date, category, notes };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction),
      });
      if (res.ok) {
        alert("Transaction added successfully!");
        fetchTransactions(); // Refresh the list
        resetForm();
      } else {
        alert("Failed to add transaction: " + (await res.json()).message);
      }
    } catch (error) {
      alert("Error adding transaction: " + error.message);
    }

    // For demo: Add to local state and persist
    const transactionWithId = { ...newTransaction, id: Date.now() };
    setTransactions((prev) => [...prev, transactionWithId]);
    localStorage.setItem('dummyTransactions', JSON.stringify([...transactions, transactionWithId]));
    alert("Transaction added! (Backend not connected)");
    resetForm();
  };

  // Function to handle updating an existing transaction
  const updateTransaction = async (e) => {
    e.preventDefault();
    const updatedTransaction = { id: currentTransactionId, type, amount: parseFloat(amount), date, category, notes };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/${currentTransactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedTransaction),
      });
      if (res.ok) {
        alert("Transaction updated successfully!");
        fetchTransactions(); // Refresh the list
        resetForm();
      } else {
        alert("Failed to update transaction: " + (await res.json()).message);
      }
    } catch (error) {
      alert("Error updating transaction: " + error.message);
    }

    // For demo: Update in local state and persist
    setTransactions((prev) =>
      prev.map((t) => (t.id === currentTransactionId ? updatedTransaction : t))
    );
    localStorage.setItem('dummyTransactions', JSON.stringify(transactions.map((t) => (t.id === currentTransactionId ? updatedTransaction : t))));
    alert("Transaction updated! (Backend not connected)");
    resetForm();
  };

  // Function to handle deleting a transaction
  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return; // Using window.confirm for simplicity, replace with custom modal if required

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Transaction deleted successfully!");
        fetchTransactions(); // Refresh the list
      } else {
        alert("Failed to delete transaction: " + (await res.json()).message);
      }
    } catch (error) {
      alert("Error deleting transaction: " + error.message);
    }

    // For demo: Delete from local state and persist
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    localStorage.setItem('dummyTransactions', JSON.stringify(transactions.filter((t) => t.id !== id)));
    alert("Transaction deleted! (Backend not connected)");
  };

  // Function to load transaction into form for editing
  const editTransaction = (transaction) => {
    setType(transaction.type);
    setAmount(transaction.amount);
    setDate(transaction.date);
    setCategory(transaction.category);
    setNotes(transaction.notes);
    setIsEditing(true);
    setCurrentTransactionId(transaction.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to show form
  };

  // Reset form fields and editing state
  const resetForm = () => {
    setType("expense");
    setAmount("");
    setDate("");
    setCategory("");
    setNotes("");
    setIsEditing(false);
    setCurrentTransactionId(null);
  };

  // Function to add a new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory(""); // Clear input
      alert(`Category "${newCategory}" added!`);
    } else if (categories.includes(newCategory)) {
      alert(`Category "${newCategory}" already exists.`);
    }
  };

  // Function to delete a category (only if no transactions use it)
  const handleDeleteCategory = (categoryToDelete) => {
    if (transactions.some(t => t.category === categoryToDelete)) {
      alert(`Cannot delete category "${categoryToDelete}" because it is currently used by transactions.`);
      return;
    }
    setCategories((prev) => prev.filter(cat => cat !== categoryToDelete));
    alert(`Category "${categoryToDelete}" deleted!`);
  };


  // --- Effects ---
  useEffect(() => {
    fetchTransactions();
    // In a real app, also fetch categories from backend if dynamic
  }, []); // Run once on component mount

  // Persist transactions to local storage for demo purposes
  useEffect(() => {
    localStorage.setItem('dummyTransactions', JSON.stringify(transactions));
  }, [transactions]);


  return (
    <div className="transactions-container">
      {/* Transaction Form Card */}
      <div className="transaction-card">
        <h2 className="section-title">{isEditing ? "Edit Transaction" : "Add New Transaction"}</h2>
        <form onSubmit={isEditing ? updateTransaction : addTransaction} className="transaction-form">
          {/* Type (Income/Expense) */}
          <div className="form-group">
            <label htmlFor="transactionType">Type</label>
            <select
              className="form-control"
              id="transactionType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="transactionAmount">Amount (R)</label>
            <input
              type="number"
              className="form-control"
              id="transactionAmount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="transactionDate">Date</label>
            <input
              type="date"
              className="form-control"
              id="transactionDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="transactionCategory">Category</label>
            <select
              className="form-control"
              id="transactionCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Notes (Optional) */}
          <div className="form-group">
            <label htmlFor="transactionNotes">Notes (Optional)</label>
            <textarea
              className="form-control"
              id="transactionNotes"
              placeholder="Add notes about this transaction"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Submit/Update Button */}
          <button type="submit" className="btn btn-primary submit-btn">
            {isEditing ? "Update Transaction" : "Add Transaction"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary cancel-btn">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Categories Management Card */}
      <div className="transaction-card mt-4">
        <h2 className="section-title">Manage Categories</h2>
        <div className="category-add-form">
          <input
            type="text"
            className="form-control"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory} className="btn btn-primary add-category-btn">
            Add Category
          </button>
        </div>
        <div className="current-categories">
          <strong>Existing Categories:</strong>
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat} className="category-item">
                {cat}
                {/* Prevent deletion of default categories, or categories in use */}
                {!['Food', 'Utilities', 'Rent', 'Entertainment', 'Transport', 'Salary', 'Investments', 'Other'].includes(cat) &&
                 !transactions.some(t => t.category === cat) && (
                  <button onClick={() => handleDeleteCategory(cat)} className="btn btn-danger delete-category-btn">
                    &times; {/* HTML entity for multiplication sign, often used for close/delete */}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>


      {/* Transaction List Card */}
      <div className="transaction-card mt-4">
        <h2 className="section-title">My Transactions</h2>
        <ul className="transaction-list">
          {transactions.length > 0 ? (
            transactions
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
              .map((transaction) => (
                <li key={transaction.id} className={`list-item ${transaction.type}`}>
                  <div className="transaction-details">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-notes">{transaction.notes}</span>
                    <span className="transaction-date">{transaction.date}</span>
                  </div>
                  <div className="transaction-amount">
                    {transaction.type === 'expense' ? '-' : '+'}R{transaction.amount.toFixed(2)}
                  </div>
                  <div className="transaction-actions">
                    <button onClick={() => editTransaction(transaction)} className="btn btn-info action-btn edit-btn">
                      Edit
                    </button>
                    <button onClick={() => deleteTransaction(transaction.id)} className="btn btn-danger action-btn delete-btn">
                      Delete
                    </button>
                  </div>
                </li>
              ))
          ) : (
            <li className="no-transactions">No transactions recorded yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Transactions;
