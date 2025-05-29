import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

interface WorkoutData {
  date: string;
  workouts: number;
  minutes: number;
  calories: number;
}

interface WorkoutChartProps {
  data: WorkoutData[];
  type: "workouts" | "minutes" | "calories";
}

const WorkoutChart: React.FC<WorkoutChartProps> = ({ data, type }) => {
  const { t } = useTranslation();

  const getDataKey = () => {
    switch (type) {
      case "workouts":
        return "workouts";
      case "minutes":
        return "minutes";
      case "calories":
        return "calories";
    }
  };

  const getLabel = () => {
    switch (type) {
      case "workouts":
        return t("report.workouts");
      case "minutes":
        return t("report.minutes");
      case "calories":
        return t("report.calories");
    }
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={getDataKey()}
            stroke="#3b82f6"
            strokeWidth={2}
            name={getLabel()}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutChart;
