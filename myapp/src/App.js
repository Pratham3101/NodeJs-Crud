import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CategoryMaster from "./component/CategoryMaster";
import ProductMaster from "./component/ProductMaster";
import "./App.css"; 

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categories">Category Master</Link>
            </li>
            <li>
              <Link to="/products">Product Master</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/categories" element={<CategoryMaster />} />
          <Route path="/products" element={<ProductMaster />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

// Home Component
const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Product Management System</h1>
      <p>Use the navigation links above to manage categories and products.</p>
    </div>
  );
};

export default App;