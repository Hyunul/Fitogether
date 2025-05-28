import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  creator: {
    name: string;
    profileImage: string | null;
  };
}

const ChallengeList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 임시 데이터
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "30일 러닝 챌린지",
      description: "30일 동안 매일 5km 러닝하기",
      category: "러닝",
      difficulty: "중급",
      startDate: "2024-03-20",
      endDate: "2024-04-19",
      participants: 15,
      maxParticipants: 100,
      creator: {
        name: "김철수",
        profileImage: null,
      },
    },
    {
      id: 2,
      title: "홈트레이닝 챌린지",
      description: "집에서 할 수 있는 운동으로 건강한 몸 만들기",
      category: "홈트레이닝",
      difficulty: "초급",
      startDate: "2024-03-25",
      endDate: "2024-04-24",
      participants: 8,
      maxParticipants: 50,
      creator: {
        name: "이영희",
        profileImage: null,
      },
    },
  ];

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || challenge.category === selectedCategory;
    const matchesDifficulty =
      !selectedDifficulty || challenge.difficulty === selectedDifficulty;
    const matchesStatus =
      !selectedStatus || getChallengeStatus(challenge) === selectedStatus;

    return (
      matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    );
  });

  const getChallengeStatus = (challenge: Challenge) => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (now < startDate) return "upcoming";
    if (now > endDate) return "ended";
    return "ongoing";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "예정";
      case "ongoing":
        return "진행중";
      case "ended":
        return "종료";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">챌린지</h1>
          <Button variant="primary" onClick={() => console.log("챌린지 생성")}>
            챌린지 만들기
          </Button>
        </div>

        <div className="mb-8 space-y-4">
          <Input
            label="검색"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="챌린지 검색..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="러닝">러닝</option>
                <option value="홈트레이닝">홈트레이닝</option>
                <option value="요가">요가</option>
                <option value="수영">수영</option>
                <option value="자전거">자전거</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                난이도
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="upcoming">예정</option>
                <option value="ongoing">진행중</option>
                <option value="ended">종료</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {challenge.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      getChallengeStatus(challenge)
                    )}`}
                  >
                    {getStatusText(getChallengeStatus(challenge))}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {challenge.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>시작일</span>
                    <span>{challenge.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>종료일</span>
                    <span>{challenge.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>참여자</span>
                    <span>
                      {challenge.participants} / {challenge.maxParticipants}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        {challenge.creator.name.charAt(0)}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {challenge.creator.name}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeList;
