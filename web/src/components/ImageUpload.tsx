import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../contexts/NotificationContext";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  maxSize?: number; // MB 단위
  accept?: string;
  className?: string;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  maxSize = 5,
  accept = "image/*",
  className = "",
  currentImage,
}) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!file.type.startsWith("image/")) {
        showNotification(t("common.invalidImageType"), "error");
        return false;
      }

      if (file.size > maxSize * 1024 * 1024) {
        showNotification(t("common.fileTooLarge", { size: maxSize }), "error");
        return false;
      }

      return true;
    },
    [maxSize, showNotification, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (validateFile(file)) {
        onImageUpload(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload, validateFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (validateFile(file)) {
        onImageUpload(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload, validateFile]
  );

  return (
    <div
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className={`block w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
            : "border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <>
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("common.dragAndDrop")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("common.maxFileSize", { size: maxSize })}
              </p>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;
