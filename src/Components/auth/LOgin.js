// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { setToken } from '../../utils/tokenHelper';
// import { isValidEmail, isValidPassword } from '../../utils/validators';
// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../../redux/authSlice';
// import '../../styles/index.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!isValidEmail(email)) {
//       alert('Please enter a valid email address.');
//       return;
//     }

//     if (!isValidPassword(password)) {
//       alert('Password must be at least 6 characters and contain a number.');
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:3000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Store token and user, update Redux
//         setToken(data.token, data.user);
//         dispatch(setCredentials({ token: data.token, user: data.user }));
//         navigate('/home');
//       } else {
//         alert(data.message || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       alert('Server error. Please try again later.');
//     }
//   };

//   const handleGoogleLogin = () => {
//     console.log("Attempting Google Login...");
//     alert("Google login not implemented yet!");
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="avatar-placeholder">
//           <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
//           </svg>
//         </div>
//         <h2>Login</h2>
//         <form onSubmit={handleLogin} className="login-form">
//           <input
//             type="email"
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             autoFocus
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="login-button">Log In</button>
//           <p className="signup-text">
//             Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from '../../utils/tokenHelper';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import '../../styles/index.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Bypass validation and API call - accept any email and password
    const dummyToken = "dummy-token-123"; // Dummy token for testing
    const dummyUser = { name: "Arnold", email: email }; // Use entered email for user

    // Set token and user in localStorage and Redux
    setToken(dummyToken, dummyUser);
    dispatch(setCredentials({ token: dummyToken, user: dummyUser }));
    navigate('/home');
  };

  const handleGoogleLogin = () => {
    console.log("Attempting Google Login...");
    alert("Google login not implemented yet!");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="avatar-placeholder">
          <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
          </svg>
        </div>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Log In</button>
          <p className="signup-text">
            Don't have an account? <Link to="/auth/signup" className="signup-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;