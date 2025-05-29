import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge("bg-white rounded-lg shadow-sm p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
