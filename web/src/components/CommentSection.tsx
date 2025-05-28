import React, { useState } from "react";
import Button from "./Button";

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

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            댓글 작성
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm text-gray-500">
                  {comment.userName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {comment.userName}
                </span>
                <span className="text-sm text-gray-500">
                  {comment.createdAt}
                </span>
              </div>
              <p className="mt-1 text-gray-600">{comment.content}</p>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => onLikeComment(comment.id)}
                  className={`flex items-center space-x-2 ${
                    comment.isLiked
                      ? "text-red-500 border-red-500"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={comment.isLiked ? "currentColor" : "none"}
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
                  <span>{comment.likes}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
