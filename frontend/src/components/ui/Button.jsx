import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    outline: "btn-outline",
    ghost: "text-neutral-700 hover:bg-neutral-100 px-4 py-2",
    danger:
      "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className={`${iconSizes[size]} animate-spin mr-2`} />
      )}

      {!loading && Icon && iconPosition === "left" && (
        <Icon className={`${iconSizes[size]} mr-2`} />
      )}

      {children}

      {!loading && Icon && iconPosition === "right" && (
        <Icon className={`${iconSizes[size]} ml-2`} />
      )}
    </button>
  );
};

export default Button;
