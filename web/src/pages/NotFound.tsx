import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        {t("error.pageNotFound")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {t("error.pageNotFoundDescription")}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
      >
        {t("error.backToHome")}
      </Link>
    </div>
  );
};

export default NotFound;
