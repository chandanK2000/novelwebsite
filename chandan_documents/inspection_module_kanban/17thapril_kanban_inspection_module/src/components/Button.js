import React from 'react';
import './Button.css'; 

// A reusable button component that accepts props
const Button = ({ label, onClick, className, disabled }) => {
  return (
    <button
      className={`btn ${className}`} 
      onClick={onClick}             
      disabled={disabled}          
    >
      {label}  {/* Display the button label */}
    </button>
  );
};

export default Button;
