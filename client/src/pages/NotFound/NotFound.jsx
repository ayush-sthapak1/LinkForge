import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Page Component
 * 
 * Purpose: Displayed when route doesn't match existing paths.
 */
function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default NotFound;
