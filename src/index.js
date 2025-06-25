// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import store from "./Components/Store"; // Make sure this path is correct for your Redux store
// import './styles/index.css';
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { Provider } from 'react-redux';
// import store from './redux/store';

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );

import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ use 'client' subpath in React 18
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);