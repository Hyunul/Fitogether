import React from "react";
import PointHistory from "../components/PointHistory";
import { usePoints } from "../contexts/PointContext";

const PointsPage: React.FC = () => {
  const { totalPoints } = usePoints();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">내 포인트</h1>
        <div className="flex items-center space-x-2">
          <span className="text-3xl text-yellow-500">⭐</span>
          <span className="text-3xl font-bold">
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
      <PointHistory />
    </div>
  );
};

export default PointsPage;
