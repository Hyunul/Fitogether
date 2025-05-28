import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

interface Certification {
  id: number;
  userId: number;
  userName: string;
  userProfileImage: string | null;
  date: string;
  image: string;
  comment: string;
  likes: number;
  isLiked: boolean;
}

const ChallengeCertifications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      userId: 1,
      userName: "홍길동",
      userProfileImage: null,
      date: "2024-03-20",
      image: "https://example.com/image1.jpg",
      comment: "오늘도 완주!",
      likes: 5,
      isLiked: false,
    },
    {
      id: 2,
      userId: 2,
      userName: "김영희",
      userProfileImage: null,
      date: "2024-03-20",
      image: "https://example.com/image2.jpg",
      comment: "힘들었지만 해냈어요!",
      likes: 3,
      isLiked: true,
    },
  ]);

  const handleLike = (certificationId: number) => {
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === certificationId
          ? {
              ...cert,
              likes: cert.isLiked ? cert.likes - 1 : cert.likes + 1,
              isLiked: !cert.isLiked,
            }
          : cert
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">인증 목록</h1>
          <p className="text-gray-600">
            챌린지 참여자들의 인증 사진과 후기를 확인해보세요.
          </p>
        </div>

        <div className="space-y-6">
          {certifications.map((certification) => (
            <Card key={certification.id}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    {certification.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {certification.userName}
                  </p>
                  <p className="text-sm text-gray-500">{certification.date}</p>
                </div>
              </div>

              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                <img
                  src={certification.image}
                  alt="인증 이미지"
                  className="object-cover rounded-lg"
                />
              </div>

              <p className="text-gray-600 mb-4">{certification.comment}</p>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleLike(certification.id)}
                  className={`flex items-center space-x-2 ${
                    certification.isLiked
                      ? "text-red-500 border-red-500"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={certification.isLiked ? "currentColor" : "none"}
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
                  <span>{certification.likes}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCertifications;
