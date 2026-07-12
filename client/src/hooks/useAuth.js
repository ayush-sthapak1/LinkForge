import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth hook
 * 
 * Purpose: Exposes current global user context details.
 */
function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
