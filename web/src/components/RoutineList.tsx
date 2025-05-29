import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

interface Routine {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  exerciseCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface RoutineListProps {
  routines: Routine[];
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onRoutineClick: (id: string) => void;
}

const RoutineList: React.FC<RoutineListProps> = ({
  routines,
  onLike,
  onBookmark,
  onShare,
  onRoutineClick,
}) => {
  const { t } = useTranslation();

  if (routines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("routine.noRoutines")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onRoutineClick(routine.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {routine.author.avatar ? (
                  <img
                    src={routine.author.avatar}
                    alt={routine.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-300 text-lg font-semibold">
                      {routine.author.name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {routine.author.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(routine.createdAt), "PPP", { locale: ko })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <LikeButton
                  isLiked={routine.isLiked}
                  likeCount={routine.likeCount}
                  onLike={() => onLike(routine.id)}
                  size="sm"
                />
                <BookmarkButton
                  isBookmarked={routine.isBookmarked}
                  onBookmark={() => onBookmark(routine.id)}
                  size="sm"
                />
                <ShareButton
                  url={`/routines/${routine.id}`}
                  title={routine.title}
                  size="sm"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {routine.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {routine.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 rounded-full">
                {t(`routine.categories.${routine.category}`)}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                {t(`routine.difficulties.${routine.difficulty}`)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {t("routine.exerciseCount", { count: routine.exerciseCount })}
              </span>
              <span>
                {t("routine.duration", { minutes: routine.duration })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutineList;
