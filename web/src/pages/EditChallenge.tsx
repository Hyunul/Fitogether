import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

interface Rule {
  id: string;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  rules: Rule[];
}

const EditChallenge: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showNotification } = useNotifications();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Implement challenge fetch
    const mockChallenge: Challenge = {
      id: id || "",
      title: "Sample Challenge",
      description: "This is a sample challenge",
      category: "upperBody",
      difficulty: "intermediate",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      maxParticipants: 100,
      rules: [
        {
          id: "1",
          description: "Complete the challenge within the time limit",
        },
      ],
    };
    setChallenge(mockChallenge);
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    setSaving(true);
    try {
      // TODO: Implement challenge update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification(t("challenge.updateSuccess"), "success");
      navigate(`/challenges/${challenge.id}`);
    } catch (error) {
      showNotification(t("challenge.updateError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRuleChange = (index: number, value: string) => {
    if (!challenge) return;

    const updatedRules = [...challenge.rules];
    updatedRules[index] = {
      ...updatedRules[index],
      description: value,
    };

    setChallenge({
      ...challenge,
      rules: updatedRules,
    });
  };

  const addRule = () => {
    if (!challenge) return;

    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
    };

    setChallenge({
      ...challenge,
      rules: [...challenge.rules, newRule],
    });
  };

  const removeRule = (index: number) => {
    if (!challenge) return;

    const updatedRules = challenge.rules.filter((_, i) => i !== index);
    setChallenge({
      ...challenge,
      rules: updatedRules,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("challenge.notFound")}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">챌린지 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="챌린지 제목"
              name="title"
              value={challenge.title}
              onChange={(e) =>
                setChallenge({ ...challenge, title: e.target.value })
              }
              placeholder="예: 30일 러닝 챌린지"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                챌린지 설명
              </label>
              <textarea
                name="description"
                value={challenge.description}
                onChange={(e) =>
                  setChallenge({ ...challenge, description: e.target.value })
                }
                rows={4}
                placeholder="챌린지에 대한 설명을 입력해주세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <select
                  name="category"
                  value={challenge.category}
                  onChange={(e) =>
                    setChallenge({ ...challenge, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(
                    t("challenge.categories", { returnObjects: true })
                  ).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  난이도
                </label>
                <select
                  name="difficulty"
                  value={challenge.difficulty}
                  onChange={(e) =>
                    setChallenge({ ...challenge, difficulty: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(
                    t("challenge.difficulties", { returnObjects: true })
                  ).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={challenge.startDate}
                  onChange={(e) =>
                    setChallenge({ ...challenge, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={challenge.endDate}
                  onChange={(e) =>
                    setChallenge({ ...challenge, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최대 참여자 수
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={challenge.maxParticipants}
                onChange={(e) =>
                  setChallenge({
                    ...challenge,
                    maxParticipants: parseInt(e.target.value),
                  })
                }
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {t("challenge.rules")}
                </h2>
                <button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t("challenge.addRule")}
                </button>
              </div>

              <div className="space-y-4">
                {challenge.rules.map((rule, index) => (
                  <div key={rule.id} className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t("challenge.rule")} {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        {t("challenge.removeRule")}
                      </button>
                    </div>

                    <div>
                      <label
                        htmlFor={`rule-${index}-description`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("challenge.ruleDescription")}
                      </label>
                      <input
                        type="text"
                        id={`rule-${index}-description`}
                        value={rule.description}
                        onChange={(e) =>
                          handleRuleChange(index, e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditChallenge;
