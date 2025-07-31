import React from "react";
import { useScrollAnimation } from "../../hooks/useIntersectionObserver";

const AnimatedCard = ({
  children,
  className = "",
  delay = 0,
  variant = "default",
  onClick,
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation(delay);

  const baseClasses = "transition-all duration-500 ease-out";

  const variants = {
    default: "card",
    gradient: "card-gradient",
    glass: "glass",
    primary:
      "bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 rounded-2xl shadow-lg hover:shadow-xl",
    accent:
      "bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 rounded-2xl shadow-lg hover:shadow-xl",
  };

  const animationClasses = isVisible
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 translate-y-8 scale-95";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${animationClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
