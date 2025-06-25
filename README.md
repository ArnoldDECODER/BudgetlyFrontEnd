# Budgetly Application README

## Overview
Budgetly is a financial tracking web application designed to help users manage their income, expenses, goals, and analytics. This README provides insights into the architecture, connectivity, and key functionalities of the application, including how the frontend interacts with the backend, handles dummy data, and routes users through the application.

## Frontend-Backend Connection
The frontend, built with advanced React features, leverages **React Hooks** (e.g., `useState`, `useEffect`) for state management and side effects, and **Redux** for global state management to handle user authentication, transactions, goals, and analytics data efficiently. The backend is designed with a RESTful API architecture, hosted at `http://localhost:3000`, providing endpoints such as `/api/transactions`, `/api/goals`, and authentication routes.

- **API Integration**: The frontend connects to the backend using `fetch` requests with `Authorization` headers containing a JWT token (stored in `localStorage` under the key `token`). For example, the `Goals` component uses a `POST` request to `http://localhost:3000/api/goals` to save new goals, while the `Analytics` component polls `/api/transactions` and `/api/goals` every 30 seconds when online to sync data.
- **Redux Store**: A centralized Redux store manages the application state, including user authentication status and financial data. Actions and reducers are dispatched to update the store, ensuring real-time reactivity across components like `Transactions` and `Goals`.
- **Hooks Usage**: Custom hooks (e.g., `useEffect` for data fetching) and context APIs enhance component reusability and data flow, such as dynamically rendering charts in the `Analytics` component based on fetched or dummy data.

## Handling Dummy Data
The application is designed to display dummy data when the backend API is unavailable or not connected, ensuring a seamless user experience during development or offline scenarios:

- **Local Storage Fallback**: If the API request fails (e.g., due to a network error or `res.ok` being false), components like `Goals` and `Analytics` fall back to dummy data stored in `localStorage` under keys like `dummyFinancialGoals` and `transactions`. For instance, the `Goals` component initializes with dummy goals (e.g., "Emergency Fund" with a target of R5000) if the API at `/api/financial-goals` is unreachable.
- **Dynamic Rendering**: The `Analytics` component uses dummy transactions and goals (defined in the `useEffect` hook) when no API data is available, rendering charts like the "Goal Progress" bar chart with preloaded values. This ensures the UI remains functional even without a live backend.
- **Online/Offline Detection**: The `useEffect` hook with `navigator.onLine` monitors connectivity, triggering data sync when online and reverting to local dummy data when offline, providing resilience.

## Routing from Login to Homepage
The application uses React Router for client-side navigation, enabling smooth transitions between pages. To route from the login page to the homepage using the test profile:

- **Test Profile**: Use the email `arnold.mabope@gmail.com` and password `12345678` to log in. This profile is hardcoded in the backend for testing purposes and returns a JWT token upon successful authentication.
- **Login Process**: 
  1. Navigate to the login page (e.g., `/login`).
  2. Enter `arnold.mabope@gmail.com` as the email and `12345678` as the password.
  3. Submit the form, triggering a `POST` request to `http://localhost:3000/api/login`. On success, the backend returns a token, which is stored in `localStorage` under `token`.
  4. Upon successful login, the `useEffect` hook in the `Login` component dispatches a Redux action to update the authentication state and redirects to the homepage (`/`) using `<Navigate to="/" />` from React Router.
- **Implementation**: The navbar includes a clickable "Budgetly" logo (in the `logo-area` div) wrapped in a `<Link to="/home" />` component, allowing users to return to the homepage from any page. This feature was implemented using React Router, ensuring a consistent navigation experience.

## Technical Highlights
- **Advanced React Features**: The application utilizes **React Hooks** for state and side effects, **React Router** for navigation, and **JSX** for dynamic UI rendering. Components like `Analytics` use `useState` and `useEffect` to manage chart data.
- **Redux**: Global state management is handled with Redux, with reducers managing authentication and financial data, enhancing scalability and maintainability.
- **RESTful API Design**: The backend exposes clear, stateless endpoints (e.g., `/api/transactions` for GET/POST) with JSON responses, adhering to REST principles. Error handling (e.g., `res.ok` checks) ensures robust data flow.
- **Dummy Data Integration**: The use of `localStorage` and dummy datasets in `Goals` and `Analytics` showcases a practical offline-first approach, tested with the test profile during development.

## Getting Started
1. **Install Dependencies**: Run `npm install` in both the frontend and backend directories.
2. **Start Backend**: Navigate to the backend folder and run `npm start` to start the server at `http://localhost:3000`.
3. **Start Frontend**: In the frontend directory, run `npm start` to launch the app at `http://localhost:3001`.
4. **Test Login**: Use `arnold.mabope@gmail.com` and `12345678` to log in and explore the homepage, transactions, goals, and analytics pages.

## Future Improvements
- Enhance api routes an user interface.
- Implement persistent storage for offline data using IndexedDB.
- Add user role-based routing for admin features.

