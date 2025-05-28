import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
