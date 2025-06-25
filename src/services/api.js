// const API_BASE = 'http://localhost:3000/api/user'; // Update if your actual route prefix differs
const API_BASE = 'http://localhost:3000'; 
// Login (GET with query params — unconventional, but aligns with your route)
export const loginUser = async (email, password) => {
  const query = new URLSearchParams({ email, password }).toString();
  const res = await fetch(`${API_BASE}/login?${query}`, {
    method: 'GET',
  });
  return res.json();
};

// Signup (POST)
export const signupUser = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Verify email token (PATCH)
export const verifyOtp = async (emailToken) => {
  const res = await fetch(`${API_BASE}/verify/emailToken`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailToken }),
  });
  return res.json();
};

// Resend OTP (GET – assumes token auth, will use Bearer token)
export const resendOtp = async (token) => {
  const res = await fetch(`${API_BASE}/send/verification/email`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// Get Profile (GET – protected)
export const getUserProfile = async (token) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};