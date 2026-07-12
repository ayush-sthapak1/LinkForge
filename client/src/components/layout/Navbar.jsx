import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Navbar Component
 * 
 * Purpose: Global navigation interface.
 */
function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header>
      <div>
        <Link to="/">LinkForge</Link>
        <nav>
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
