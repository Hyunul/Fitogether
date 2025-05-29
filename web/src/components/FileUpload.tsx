import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../contexts/NotificationContext";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  maxSize?: number; // MB 단위
  accept?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxSize = 10,
  accept,
  className = "",
}) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
        onFileUpload(file);
        setFileName(file.name);
      }
    },
    [onFileUpload, validateFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (validateFile(file)) {
        onFileUpload(file);
        setFileName(file.name);
      }
    },
    [onFileUpload, validateFile]
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
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
            : "border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
        }`}
      >
        <div className="flex flex-col items-center justify-center">
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {fileName ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {fileName}
            </p>
          ) : (
            <>
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

export default FileUpload;
