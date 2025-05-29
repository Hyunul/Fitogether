import React, { useState, useEffect } from "react";
import { usePoints } from "../contexts/PointContext";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const PointHistory: React.FC = () => {
  const { points, loading, error, refreshPoints } = usePoints();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    refreshPoints();
  }, [page]);

  const getPointIcon = (type: string) => {
    switch (type) {
      case "CHALLENGE_COMPLETE":
        return "🎯";
      case "DAILY_CHECKIN":
        return "📅";
      case "POST_CREATE":
        return "📝";
      case "COMMENT_CREATE":
        return "💬";
      case "LIKE_RECEIVE":
        return "❤️";
      case "FOLLOW_RECEIVE":
        return "👥";
      default:
        return "⭐";
    }
  };

  if (loading && points.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        포인트 내역을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">포인트 내역</h2>
      {points.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          포인트 내역이 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {points.map((point) => (
            <div
              key={point._id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl">{getPointIcon(point.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {point.description || "포인트 적립"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(point.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  point.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {point.amount > 0 ? "+" : ""}
                {point.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointHistory;
