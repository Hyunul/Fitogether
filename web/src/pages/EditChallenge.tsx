import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

interface ChallengeForm {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  rules: string[];
  maxParticipants: number;
}

const EditChallenge: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ChallengeForm>({
    title: "30일 러닝 챌린지",
    description: "30일 동안 매일 5km 러닝하기",
    category: "러닝",
    difficulty: "중급",
    startDate: "2024-03-20",
    endDate: "2024-04-19",
    rules: [
      "매일 5km 이상 러닝하기",
      "러닝 인증 사진 업로드하기",
      "3일 연속 미인증 시 챌린지 실패",
    ],
    maxParticipants: 100,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...form.rules];
    newRules[index] = value;
    setForm((prev) => ({
      ...prev,
      rules: newRules,
    }));
  };

  const addRule = () => {
    setForm((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const removeRule = (index: number) => {
    const newRules = form.rules.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      rules: newRules,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("챌린지 수정:", form);
    navigate(`/challenges/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">챌린지 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="챌린지 제목"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예: 30일 러닝 챌린지"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                챌린지 설명
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
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
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="러닝">러닝</option>
                  <option value="홈트레이닝">홈트레이닝</option>
                  <option value="요가">요가</option>
                  <option value="수영">수영</option>
                  <option value="자전거">자전거</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  난이도
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                  <option value="고급">고급</option>
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
                  value={form.startDate}
                  onChange={handleChange}
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
                  value={form.endDate}
                  onChange={handleChange}
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
                value={form.maxParticipants}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  챌린지 규칙
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRule}
                  className="text-sm"
                >
                  규칙 추가
                </Button>
              </div>
              <div className="space-y-2">
                {form.rules.map((rule, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                      placeholder={`규칙 ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {form.rules.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeRule(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/challenges/${id}`)}
              >
                취소
              </Button>
              <Button type="submit" variant="primary">
                수정하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditChallenge;
