import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import type { FilterOption } from "../components/Filter";
import Sort from "../components/Sort";
import type { SortOption } from "../components/Sort";
import Card from "../components/Card";

interface Item {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

const SearchExample: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // 예시 데이터
  const items: Item[] = [
    {
      id: 1,
      title: "30일 스쿼트 챌린지",
      category: "lower",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      title: "플랭크 마스터",
      category: "core",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      title: "푸시업 100회",
      category: "upper",
      createdAt: "2024-01-03",
    },
  ];

  // 카테고리 필터 옵션
  const categoryOptions: FilterOption[] = [
    { value: "all", label: t("common.all") },
    { value: "upper", label: t("common.upperBody") },
    { value: "lower", label: t("common.lowerBody") },
    { value: "core", label: t("common.core") },
  ];

  // 정렬 옵션
  const sortOptions: SortOption[] = [
    { value: "latest", label: t("common.latest") },
    { value: "popular", label: t("common.popular") },
  ];

  // 필터링 및 정렬된 아이템
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });
  }, [items, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("common.searchPlaceholder")}
        />
        <Filter
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          label={t("common.category")}
        />
        <Sort
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          label={t("common.sort")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t(`common.${item.category}`)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchExample;
