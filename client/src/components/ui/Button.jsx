import React from 'react';

/**
 * Reusable Button Component
 * 
 * Purpose: Base UI button placeholder.
 * 
 * TODO:
 * - Implement branding variants and load status indicators.
 */
function Button({ children, ...props }) {
  return (
    <button {...props}>
      {children}
    </button>
  );
}

export default Button;
