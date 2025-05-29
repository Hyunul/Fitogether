import React from "react";
import { useTranslation } from "react-i18next";
import { ShareIcon } from "@heroicons/react/24/outline";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  text,
  size = "md",
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
      } else {
        // Web Share API를 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(url);
        // TODO: 알림 표시
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // TODO: 에러 알림 표시
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
      aria-label={t("share.share")}
    >
      <ShareIcon className={sizeClasses[size]} />
    </button>
  );
};

export default ShareButton;
