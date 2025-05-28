import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import CommentSection from "../components/CommentSection";

interface Exercise {
  id: number;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number;
  image: string;
}

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
  exercises: Exercise[];
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userProfileImage: string | null;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const RoutineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"exercises" | "comments">(
    "exercises"
  );
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: "홍길동",
      userProfileImage: null,
      content: "정말 좋은 루틴이네요!",
      createdAt: "2024-03-20 14:30",
      likes: 2,
      isLiked: false,
    },
    {
      id: 2,
      userId: 2,
      userName: "김영희",
      userProfileImage: null,
      content: "저도 이 루틴으로 운동하고 있어요!",
      createdAt: "2024-03-20 15:45",
      likes: 1,
      isLiked: true,
    },
  ]);

  // 임시 데이터
  const [routine, setRoutine] = useState<Routine>({
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
    exercises: [
      {
        id: 1,
        name: "스쿼트",
        description:
          "다리를 어깨 너비로 벌리고 무릎을 구부려 앉았다가 일어서는 동작",
        sets: 3,
        reps: 15,
        restTime: 60,
        image: "https://example.com/squat.jpg",
      },
      {
        id: 2,
        name: "푸시업",
        description: "바닥에 엎드려 팔을 구부렸다 펴는 동작",
        sets: 3,
        reps: 10,
        restTime: 60,
        image: "https://example.com/pushup.jpg",
      },
      {
        id: 3,
        name: "플랭크",
        description: "팔꿈치를 바닥에 대고 몸을 일직선으로 유지하는 동작",
        sets: 3,
        reps: 30,
        restTime: 60,
        image: "https://example.com/plank.jpg",
      },
    ],
    likes: 42,
    isLiked: false,
    isBookmarked: false,
  });

  const handleLike = () => {
    setRoutine((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleBookmark = () => {
    setRoutine((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  const handleAddComment = (content: string) => {
    // TODO: API 연동
    const newComment: Comment = {
      id: comments.length + 1,
      userId: 1, // TODO: 현재 로그인한 사용자 ID
      userName: "현재 사용자", // TODO: 현재 로그인한 사용자 이름
      userProfileImage: null,
      content,
      createdAt: new Date().toLocaleString(),
      likes: 0,
      isLiked: false,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          : comment
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {routine.title}
                </h1>
                <p className="text-gray-600">{routine.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleLike}
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
                  onClick={handleBookmark}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">카테고리</div>
                <div className="font-medium">{routine.category}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">난이도</div>
                <div className="font-medium">{routine.difficulty}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">소요 시간</div>
                <div className="font-medium">{routine.duration}분</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">생성자</div>
                <div className="font-medium">{routine.creator.name}</div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("exercises")}
                  className={`${
                    activeTab === "exercises"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  운동 목록
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`${
                    activeTab === "comments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  댓글
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "exercises" && (
              <div className="space-y-6">
                {routine.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {exercise.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {exercise.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{exercise.sets}세트</span>
                        <span>{exercise.reps}회</span>
                        <span>휴식 {exercise.restTime}초</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "comments" && (
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoutineDetail;
