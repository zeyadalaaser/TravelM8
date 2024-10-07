import React from "react";

export const Button = ({ children, variant, size, className, ...props }) => (
  <button
    className={`btn ${variant ? `btn-${variant}` : ""} ${size ? `btn-${size}` : ""} ${className}`}
    {...props}
  >
    {children}
  </button>
);
