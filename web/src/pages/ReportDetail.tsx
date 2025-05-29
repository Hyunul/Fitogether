import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button } from "../components/ui";
import WorkoutChart from "../components/charts/WorkoutChart";
import {
  calculateWorkoutStats,
  calculateChallengeStats,
  groupWorkoutsByDate,
  calculateDailyStats,
  calculateWorkoutDistribution,
} from "../utils/reportUtils";

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  caloriesBurned: number;
}

interface Challenge {
  id: string;
  title: string;
  status: "in_progress" | "completed";
  progress: number;
  startDate: string;
  endDate: string;
}

interface ReportDetail {
  id: string;
  title: string;
  type: "weekly" | "monthly";
  startDate: string;
  endDate: string;
  status: "pending" | "completed";
  createdAt: string;
  summary: {
    totalWorkouts: number;
    totalChallenges: number;
    completedChallenges: number;
    totalMinutes: number;
  };
  challenges: Challenge[];
  workouts: Workout[];
}

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<
    "workouts" | "minutes" | "calories"
  >("workouts");

  useEffect(() => {
    // TODO: API 연동
    const fetchReport = async () => {
      try {
        // 임시 데이터
        const mockReport: ReportDetail = {
          id: "1",
          title: "2024년 3월 리포트",
          type: "monthly",
          startDate: "2024-03-01",
          endDate: "2024-03-31",
          status: "completed",
          createdAt: "2024-03-31T23:59:59Z",
          summary: {
            totalWorkouts: 20,
            totalChallenges: 5,
            completedChallenges: 3,
            totalMinutes: 1200,
          },
          challenges: [
            {
              id: "1",
              title: "매일 30분 운동하기",
              status: "completed",
              progress: 100,
              startDate: "2024-03-01",
              endDate: "2024-03-31",
            },
            {
              id: "2",
              title: "주 3회 러닝",
              status: "in_progress",
              progress: 75,
              startDate: "2024-03-01",
              endDate: "2024-03-31",
            },
          ],
          workouts: [
            {
              id: "1",
              name: "러닝",
              date: "2024-03-01",
              duration: 30,
              caloriesBurned: 300,
            },
            {
              id: "2",
              name: "웨이트 트레이닝",
              date: "2024-03-02",
              duration: 45,
              caloriesBurned: 400,
            },
          ],
        };

        setReport(mockReport);
      } catch (error) {
        console.error("리포트를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("report.notFound")}</h1>
          <Button onClick={() => navigate("/reports")}>
            {t("report.backToList")}
          </Button>
        </div>
      </div>
    );
  }

  const workoutStats = calculateWorkoutStats(report.workouts);
  const challengeStats = calculateChallengeStats(report.challenges);
  const dailyStats = calculateDailyStats(report.workouts);
  const workoutDistribution = calculateWorkoutDistribution(report.workouts);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        <Button onClick={() => navigate("/reports")}>
          {t("report.backToList")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t("report.summary.totalWorkouts")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {workoutStats.totalWorkouts}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t("report.summary.totalChallenges")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {challengeStats.totalChallenges}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t("report.summary.completedChallenges")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {challengeStats.completedChallenges}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t("report.summary.totalMinutes")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {workoutStats.totalMinutes}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">{t("report.workoutTrend")}</h2>
          <div className="flex gap-4 mb-4">
            <Button
              variant={chartType === "workouts" ? "primary" : "secondary"}
              onClick={() => setChartType("workouts")}
            >
              {t("report.workouts")}
            </Button>
            <Button
              variant={chartType === "minutes" ? "primary" : "secondary"}
              onClick={() => setChartType("minutes")}
            >
              {t("report.minutes")}
            </Button>
            <Button
              variant={chartType === "calories" ? "primary" : "secondary"}
              onClick={() => setChartType("calories")}
            >
              {t("report.calories")}
            </Button>
          </div>
        </div>
        <WorkoutChart data={dailyStats} type={chartType} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">{t("report.challenges")}</h2>
          <div className="space-y-4">
            {report.challenges.map((challenge) => (
              <div key={challenge.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      challenge.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {t(`report.status.${challenge.status}`)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {t("report.progress")}: {challenge.progress}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">{t("report.workouts")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t("report.workoutName")}</th>
                  <th className="text-left py-2">{t("report.date")}</th>
                  <th className="text-left py-2">{t("report.duration")}</th>
                  <th className="text-left py-2">{t("report.calories")}</th>
                </tr>
              </thead>
              <tbody>
                {report.workouts.map((workout) => (
                  <tr key={workout.id} className="border-b last:border-b-0">
                    <td className="py-2">{workout.name}</td>
                    <td className="py-2">{workout.date}</td>
                    <td className="py-2">
                      {workout.duration} {t("report.minutes")}
                    </td>
                    <td className="py-2">{workout.caloriesBurned} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetail;
