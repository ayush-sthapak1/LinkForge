import React from 'react';

/**
 * Footer Component
 * 
 * Purpose: Global app footer.
 */
function Footer() {
  return (
    <footer>
      <div>
        <p>&copy; {new Date().getFullYear()} LinkForge. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
