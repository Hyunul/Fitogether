import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const Profile: React.FC = () => {
  // 임시 데이터
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2024-03-15",
    completedRoutines: 12,
    activeRoutines: 3,
    totalChallenges: 5,
  };

  const activeRoutines = [
    {
      id: 1,
      title: "매일 30분 러닝",
      progress: 75,
      nextSchedule: "2024-03-20 06:00",
    },
    {
      id: 2,
      title: "주 3회 홈트레이닝",
      progress: 60,
      nextSchedule: "2024-03-21 19:00",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl text-gray-500">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                가입일: {user.joinDate}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              완료한 루틴
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {user.completedRoutines}
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              진행 중인 루틴
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {user.activeRoutines}
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              참여한 챌린지
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {user.totalChallenges}
            </p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            진행 중인 루틴
          </h2>
          <div className="space-y-4">
            {activeRoutines.map((routine) => (
              <div
                key={routine.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{routine.title}</h3>
                  <span className="text-sm text-gray-500">
                    다음 일정: {routine.nextSchedule}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${routine.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="text-sm">
                    상세보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
