import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../components/Card";
import Button from "../components/Button";

interface Report {
  id: string;
  title: string;
  type: "weekly" | "monthly";
  startDate: string;
  endDate: string;
  status: "pending" | "completed";
  createdAt: string;
}

const ReportList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 연동
    const fetchReports = async () => {
      try {
        // 임시 데이터
        const mockReports: Report[] = [
          {
            id: "1",
            title: "2024년 1월 1주차 리포트",
            type: "weekly",
            startDate: "2024-01-01",
            endDate: "2024-01-07",
            status: "completed",
            createdAt: "2024-01-07",
          },
          {
            id: "2",
            title: "2024년 1월 2주차 리포트",
            type: "weekly",
            startDate: "2024-01-08",
            endDate: "2024-01-14",
            status: "pending",
            createdAt: "2024-01-14",
          },
        ];
        setReports(mockReports);
      } catch (error) {
        console.error("리포트 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("report.title")}
        </h1>
        <Button
          onClick={() => navigate("/reports/create")}
          className="bg-primary-500 text-white"
        >
          {t("report.create")}
        </Button>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleReportClick(report.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {report.startDate} ~ {report.endDate}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    report.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status === "completed"
                    ? t("report.status.completed")
                    : t("report.status.pending")}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
