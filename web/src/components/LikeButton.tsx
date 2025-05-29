import React from "react";
import { useTranslation } from "react-i18next";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likeCount,
  onLike,
  size = "md",
  showCount = true,
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const countSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <button
      onClick={onLike}
      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      aria-label={isLiked ? t("like.unlike") : t("like.like")}
    >
      {isLiked ? (
        <HeartSolid className={`${sizeClasses[size]} text-red-500`} />
      ) : (
        <HeartOutline className={sizeClasses[size]} />
      )}
      {showCount && (
        <span className={`${countSizeClasses[size]} font-medium`}>
          {likeCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
