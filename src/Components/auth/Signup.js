import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isValidEmail, isValidPassword } from '../../utils/validators';

import '../../styles/index.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(form.password)) {
      alert("Password must be at least 6 characters and contain a number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Enter OTP to continue.");
        navigate("/verify-otp", { state: { email: form.email } });
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Redirect to homepage on API failure (e.g., network error or unreachable endpoint)
      navigate("/home");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <p className="signup-text">
          Already have an account? <Link to="/auth/login" className="signup-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;