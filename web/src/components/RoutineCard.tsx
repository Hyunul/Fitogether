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
    <Card onClick={onClick}>
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{description}</p>
      <div className="text-muted">
        <span className="me-3">주 {frequency}회</span>
        <span>{participants}명 참여 중</span>
      </div>
    </Card>
  );
};

export default RoutineCard;
