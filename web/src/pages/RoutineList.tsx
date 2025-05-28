import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

interface Routine {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  creator: {
    name: string;
    profileImage: string | null;
  };
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const RoutineList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  // 임시 데이터
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: 1,
      title: "초보자를 위한 홈 트레이닝",
      description: "집에서 할 수 있는 기본적인 전신 운동 루틴",
      category: "홈트레이닝",
      difficulty: "초급",
      duration: 30,
      creator: {
        name: "김철수",
        profileImage: null,
      },
      likes: 42,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 2,
      title: "상체 근력 강화 루틴",
      description: "덤벨을 활용한 상체 근력 운동",
      category: "근력운동",
      difficulty: "중급",
      duration: 45,
      creator: {
        name: "이영희",
        profileImage: null,
      },
      likes: 28,
      isLiked: true,
      isBookmarked: false,
    },
  ]);

  const categories = ["all", "홈트레이닝", "근력운동", "유산소", "스트레칭"];
  const difficulties = ["all", "초급", "중급", "고급"];

  const handleLike = (routineId: number) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              likes: routine.isLiked ? routine.likes - 1 : routine.likes + 1,
              isLiked: !routine.isLiked,
            }
          : routine
      )
    );
  };

  const handleBookmark = (routineId: number) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              isBookmarked: !routine.isBookmarked,
            }
          : routine
      )
    );
  };

  const filteredRoutines = routines.filter((routine) => {
    const matchesSearch = routine.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || routine.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || routine.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedRoutines = [...filteredRoutines].sort((a, b) => {
    if (sortBy === "latest") {
      return b.id - a.id;
    } else {
      return b.likes - a.likes;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">운동 루틴</h1>
            <p className="text-gray-600">
              다양한 운동 루틴을 찾아보고 시작해보세요.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/routines/create")}
          >
            루틴 만들기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="루틴 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "전체 카테고리" : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === "all" ? "전체 난이도" : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex space-x-2">
            <Button
              variant={sortBy === "latest" ? "primary" : "outline"}
              onClick={() => setSortBy("latest")}
            >
              최신순
            </Button>
            <Button
              variant={sortBy === "popular" ? "primary" : "outline"}
              onClick={() => setSortBy("popular")}
            >
              인기순
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRoutines.map((routine) => (
            <Card key={routine.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {routine.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {routine.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {routine.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {routine.difficulty}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {routine.duration}분
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleLike(routine.id)}
                    className={`flex items-center space-x-2 ${
                      routine.isLiked
                        ? "text-red-500 border-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={routine.isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{routine.likes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleBookmark(routine.id)}
                    className={`flex items-center space-x-2 ${
                      routine.isBookmarked
                        ? "text-yellow-500 border-yellow-500"
                        : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={routine.isBookmarked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {routine.creator.name.charAt(0)}
                    </span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {routine.creator.name}
                  </span>
                </div>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/routines/${routine.id}`)}
                >
                  자세히 보기
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineList;
