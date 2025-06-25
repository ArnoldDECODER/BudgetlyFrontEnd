import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCountdown } from '../../utils/countdown';
import '../../styles/index.css';

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ""; // pulled from navigate state

  const { isExpired, formatTime, resetCountdown } = useCountdown(300);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP verified! Now log in.");
        navigate("/login");
      } else {
        alert(data.message || "Invalid OTP.");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP resent!");
        resetCountdown();
      } else {
        alert(data.message || "Could not resend OTP.");
      }
    } catch (err) {
      alert("Error resending OTP.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Enter OTP</h2>
        <p>We’ve sent you a code to verify your account.</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>
        <p className="countdown-text">
          {isExpired ? (
            <button onClick={handleResendOtp} className="resend-button">
              Resend OTP
            </button>
          ) : (
            `You can resend in ${formatTime()}`
          )}
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;