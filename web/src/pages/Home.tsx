import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import RoutineCard from "../components/RoutineCard";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const sampleRoutines = [
    {
      id: 1,
      title: "매일 30분 러닝",
      description: "아침 30분 러닝으로 하루를 시작해보세요.",
      frequency: "7",
      participants: 12,
    },
    {
      id: 2,
      title: "주 3회 홈트레이닝",
      description: "집에서 할 수 있는 간단한 홈트레이닝 루틴입니다.",
      frequency: "3",
      participants: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            FitTogether에 오신 것을 환영합니다
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            함께 운동하고 인증하며 동기부여를 받아보세요.
          </p>
          <div className="space-x-4">
            <Button variant="primary">시작하기</Button>
            <Button variant="outline">더 알아보기</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 루틴</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sampleRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                title={routine.title}
                description={routine.description}
                frequency={routine.frequency}
                participants={routine.participants}
                onClick={() => navigate(`/routines/${routine.id}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
