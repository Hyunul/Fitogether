import React from "react";
import { useTranslation } from "react-i18next";
import Comment from "./Comment";

interface CommentListProps {
  comments: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
  }>;
  currentUserId?: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("comment.noComments")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          isAuthor={comment.author.id === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
