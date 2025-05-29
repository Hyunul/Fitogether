import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  maxParticipants: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ChallengeListProps {
  challenges: Challenge[];
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onChallengeClick: (id: string) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  onLike,
  onBookmark,
  onShare,
  onChallengeClick,
}) => {
  const { t } = useTranslation();

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("challenge.noChallenges")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onChallengeClick(challenge.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {challenge.author.avatar ? (
                  <img
                    src={challenge.author.avatar}
                    alt={challenge.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-300 text-lg font-semibold">
                      {challenge.author.name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {challenge.author.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(challenge.startDate), "PPP", {
                      locale: ko,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <LikeButton
                  isLiked={challenge.isLiked}
                  likeCount={challenge.likeCount}
                  onLike={() => onLike(challenge.id)}
                  size="sm"
                />
                <BookmarkButton
                  isBookmarked={challenge.isBookmarked}
                  onBookmark={() => onBookmark(challenge.id)}
                  size="sm"
                />
                <ShareButton
                  url={`/challenges/${challenge.id}`}
                  title={challenge.title}
                  size="sm"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {challenge.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {challenge.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 rounded-full">
                {t(`challenge.categories.${challenge.category}`)}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                {t(`challenge.difficulties.${challenge.difficulty}`)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {t("challenge.participants", {
                  current: challenge.participantCount,
                  max: challenge.maxParticipants,
                })}
              </span>
              <span>
                {t("challenge.period", {
                  start: format(new Date(challenge.startDate), "MM/dd"),
                  end: format(new Date(challenge.endDate), "MM/dd"),
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengeList;
