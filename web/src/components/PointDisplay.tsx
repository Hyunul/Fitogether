import React from "react";
import { usePoints } from "../contexts/PointContext";

const PointDisplay: React.FC = () => {
  const { totalPoints, loading } = usePoints();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
        <span className="text-gray-500">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-yellow-500">⭐</span>
      <span className="font-semibold">{totalPoints.toLocaleString()}</span>
    </div>
  );
};

export default PointDisplay;
