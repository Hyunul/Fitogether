import React from "react";
import { useTranslation } from "react-i18next";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onBookmark: () => void;
  size?: "sm" | "md" | "lg";
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onBookmark,
  size = "md",
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <button
      onClick={onBookmark}
      className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
      aria-label={isBookmarked ? t("bookmark.remove") : t("bookmark.add")}
    >
      {isBookmarked ? (
        <BookmarkSolid className={`${sizeClasses[size]} text-primary-500`} />
      ) : (
        <BookmarkOutline className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default BookmarkButton;
