import React from "react";
import Card from "./Card";

interface RoutineCardProps {
  title: string;
  description: string;
  frequency: string;
  participants: number;
  onClick?: () => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  title,
  description,
  frequency,
  participants,
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="mb-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>주 {frequency}회</span>
        <span>{participants}명 참여 중</span>
      </div>
    </Card>
  );
};

export default RoutineCard;
