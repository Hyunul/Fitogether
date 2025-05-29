import React from "react";
import { useTranslation } from "react-i18next";

export interface SortOption {
  value: string;
  label: string;
}

interface SortProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const Sort: React.FC<SortProps> = ({
  options,
  value,
  onChange,
  label,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              value === option.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sort;
