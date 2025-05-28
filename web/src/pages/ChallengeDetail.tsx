import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import CommentSection from "../components/CommentSection";

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
  rules: string[];
  isParticipating: boolean;
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

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "info" | "participants" | "certifications"
  >("info");
  const [isParticipating, setIsParticipating] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: "홍길동",
      userProfileImage: null,
      content: "화이팅!",
      createdAt: "2024-03-20 14:30",
      likes: 2,
      isLiked: false,
    },
    {
      id: 2,
      userId: 2,
      userName: "김영희",
      userProfileImage: null,
      content: "저도 참여하고 싶어요!",
      createdAt: "2024-03-20 15:45",
      likes: 1,
      isLiked: true,
    },
  ]);

  // 임시 데이터
  const [challenge, setChallenge] = useState<Challenge>({
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
    rules: [
      "매일 5km 이상 러닝하기",
      "러닝 인증 사진 업로드하기",
      "3일 연속 미인증 시 챌린지 실패",
    ],
    isParticipating: false,
    likes: 42,
    isLiked: false,
    isBookmarked: false,
  });

  const handleParticipate = () => {
    // TODO: API 연동
    setIsParticipating(true);
    console.log("챌린지 참여");
  };

  const handleLeave = () => {
    // TODO: API 연동
    setIsParticipating(false);
    console.log("챌린지 탈퇴");
  };

  const handleCertify = () => {
    navigate(`/challenges/${id}/certify`);
  };

  const handleLike = () => {
    setChallenge((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleBookmark = () => {
    setChallenge((prev) => ({
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
                  {challenge.title}
                </h1>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
              <div className="flex space-x-2">
                {isParticipating ? (
                  <>
                    <Button variant="primary" onClick={handleCertify}>
                      인증하기
                    </Button>
                    <Button variant="outline" onClick={handleLeave}>
                      탈퇴하기
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleParticipate}
                    disabled={
                      challenge.participants >= challenge.maxParticipants
                    }
                  >
                    참여하기
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">카테고리</div>
                <div className="font-medium">{challenge.category}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">난이도</div>
                <div className="font-medium">{challenge.difficulty}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">참여자</div>
                <div className="font-medium">
                  {challenge.participants} / {challenge.maxParticipants}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">기간</div>
                <div className="font-medium">
                  {challenge.startDate} ~ {challenge.endDate}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`${
                    activeTab === "info"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  정보
                </button>
                <button
                  onClick={() => setActiveTab("participants")}
                  className={`${
                    activeTab === "participants"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  참여자
                </button>
                <button
                  onClick={() => setActiveTab("certifications")}
                  className={`${
                    activeTab === "certifications"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  인증
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    챌린지 규칙
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {challenge.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    챌린지 생성자
                  </h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        {challenge.creator.name.charAt(0)}
                      </span>
                    </div>
                    <span className="ml-3 text-gray-600">
                      {challenge.creator.name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div className="space-y-4">
                {/* TODO: 참여자 목록 구현 */}
                <p className="text-gray-500">참여자 목록이 표시됩니다.</p>
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-4">
                {/* TODO: 인증 목록 구현 */}
                <p className="text-gray-500">인증 목록이 표시됩니다.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">댓글</h3>
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetail;
