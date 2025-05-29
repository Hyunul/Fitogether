import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentProps {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  isAuthor?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  createdAt,
  onEdit,
  onDelete,
  isAuthor = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id, editedContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-300 text-lg font-semibold">
              {author.name[0]}
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {author.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(createdAt), "PPP", { locale: ko })}
            </p>
          </div>
          {isAuthor && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t("common.edit")}
              </button>
              <button
                onClick={() => onDelete?.(id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t("common.delete")}
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
