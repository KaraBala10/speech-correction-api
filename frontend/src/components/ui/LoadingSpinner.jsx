import React from "react";

const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variants = {
    primary: "border-primary-200 border-t-primary-600",
    secondary: "border-secondary-200 border-t-secondary-600",
    accent: "border-accent-200 border-t-accent-600",
    white: "border-white/20 border-t-white",
  };

  return (
    <div
      className={`spinner ${sizes[size]} ${variants[variant]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
