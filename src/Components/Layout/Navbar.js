// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import "./Header.css";
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import SearchIcon from "@mui/icons-material/Search";
// import HomeIcon from "@mui/icons-material/Home";
// import FavoriteIcon from "@mui/icons-material/Favorite";

// const Header = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [searchResult, setSearchResult] = useState(null);

//   useEffect(() => {
//     fetch("/recipes.json")
//       .then((response) => response.json())
//       .then((data) => setRecipes(data))
//       .catch((error) => console.error("Error fetching recipes:", error));
//   }, []);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.trim() === "") {
//       setSearchResult(null);
//       return;
//     }

//     const matchedRecipe = recipes.find((recipe) =>
//       recipe.title.toLowerCase().includes(value.toLowerCase())
//     );

//     if (matchedRecipe) {
//       setSearchResult({ found: true, recipe: matchedRecipe });
//     } else {
//       setSearchResult({ found: false, message: `${value} recipe is not available` });
//     }
//   };

//   return (
//     <header>
//       <nav>
//         <div className="logo-area">
//           <h1 className="logo-text">
//             <span>
//               <MonetizationOnIcon />
//             </span>
//             Budgetly
//           </h1>
//         </div>

//         <div className="search-area">
//           <div className="tooltip">
//             <span>
//               <SearchIcon />
//             </span>
//             <span className="tooltip-text">Search</span>
//           </div>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           {searchResult && (
//             <div className="search-feedback">
//               {searchResult.found ? (
//                 <NavLink to={`/recipe/${searchResult.recipe.id}`}>
//                   Found: {searchResult.recipe.title}
//                 </NavLink>
//               ) : (
//                 <p>{searchResult.message}</p>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="navbar-icons">
//           <div className="tooltip">
//             <NavLink activeClassName="active" to="/homepage">
//               <span className="icon">
//                 <HomeIcon />
//               </span>
//               <span className="text">Home</span>
//               <span className="tooltip-text">Homepage</span>
//             </NavLink>
//           </div>

//           <div className="tooltip">
//             <NavLink activeClassName="active" to="/favourites">
//               <span className="icon">
//                 <FavoriteIcon />
//               </span>
//               <span className="text">Favourites</span>
//               <span className="tooltip-text">Favourites</span>
//             </NavLink>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/index.css';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PieChartIcon from '@mui/icons-material/PieChart';
import LogoutIcon from '@mui/icons-material/Logout';

import { removeToken } from '../../utils/tokenHelper';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/auth/login');
  };

  return (
    <header>
      <nav>
              {/* Logo Area */}
        <div className="logo-area">
            <h1 className="logo-text">
              <MonetizationOnIcon style={{ marginRight: '8px' }} />
              <span
                onClick={() => (window.location.href = '/home')}
                style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
              >
                Budgetly
              </span>
            </h1>
          </div>

        {/* Navigation Items */}
        <div className="navbar-icons">
          <div className="tooltip">
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? 'nav-item-content active' : 'nav-item-content'
              }
            >
              <span className="icon"><AccountBalanceWalletIcon /></span>
              <span className="text">Transactions</span>
            </NavLink>
            <span className="tooltip-text">Transactions</span>
          </div>

          <div className="tooltip">
            <NavLink
              to="/goals"
              className={({ isActive }) =>
                isActive ? 'nav-item-content active' : 'nav-item-content'
              }
            >
              <span className="icon"><TrackChangesIcon /></span>
              <span className="text">Goals</span>
            </NavLink>
            <span className="tooltip-text">Financial Goals</span>
          </div>

          <div className="tooltip">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? 'nav-item-content active' : 'nav-item-content'
              }
            >
              <span className="icon"><PieChartIcon /></span>
              <span className="text">Analytics</span>
            </NavLink>
            <span className="tooltip-text">Insights</span>
          </div>

          <div className="tooltip">
            <button
              type="button"
              onClick={handleLogout}
              className="nav-item-content logout-button"
            >
              <span className="icon"><LogoutIcon /></span>
              <span className="text">Logout</span>
            </button>
            <span className="tooltip-text">Logout</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;