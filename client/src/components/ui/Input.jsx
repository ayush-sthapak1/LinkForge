import React from 'react';

/**
 * Reusable Input Component
 * 
 * Purpose: Base UI input placeholder.
 * 
 * TODO:
 * - Implement styling, focus rings, validation indicators, and forward refs.
 */
function Input(props) {
  return (
    <input {...props} />
  );
}

export default Input;
