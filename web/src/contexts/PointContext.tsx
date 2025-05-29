import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Point {
  _id: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
  reference?: {
    _id: string;
    title?: string;
  };
}

interface PointContextType {
  points: Point[];
  totalPoints: number;
  loading: boolean;
  error: string | null;
  refreshPoints: () => Promise<void>;
}

const PointContext = createContext<PointContextType | undefined>(undefined);

export const PointProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPoints = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/points`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch points");
      }

      const data = await response.json();
      setPoints(data.points);
      setTotalPoints(data.totalPoints);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch points");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPoints();
    }
  }, [user?.token]);

  return (
    <PointContext.Provider
      value={{
        points,
        totalPoints,
        loading,
        error,
        refreshPoints: fetchPoints,
      }}
    >
      {children}
    </PointContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointProvider");
  }
  return context;
};
