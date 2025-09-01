import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
 
const AutoLogout = () => {
  const navigate = useNavigate();
  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 1 minute (60 seconds)
 
  // Handle logout: Clears user data from localStorage and redirects to login
  const handleLogout = useCallback(() => {
    if (localStorage.getItem('userData')) {
      // Clear user details from local storage
      localStorage.removeItem('userData');
      // Log to console for confirmation
      console.log('User logged out successfully');
      // Redirect to login page
      navigate('/');
      window.location.reload();
    }
  }, [navigate]);
 
  // Reset inactivity timer
  const resetTimer = useCallback(() => {
    clearTimeout(window.logoutTimer); // Clear any existing timeout
    window.logoutTimer = setTimeout(() => {
      handleLogout(); // Trigger logout after inactivity limit
    }, INACTIVITY_LIMIT);
  }, [handleLogout]);
 
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
 
    // Add event listeners for activity detection
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
 
    // Set initial timer when the component mounts
    resetTimer();
 
    // Cleanup on component unmount or when the component is re-rendered
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(window.logoutTimer); // Clear the timeout when the component is unmounted
    };
  }, [resetTimer]);
 
  return null; // No UI for this component
};
 
export default AutoLogout;