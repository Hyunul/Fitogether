import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

interface Exercise {
  id: number;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number;
  image: string;
}

interface RoutineForm {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
}

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RoutineForm>({
    title: "",
    description: "",
    category: "홈트레이닝",
    difficulty: "초급",
    duration: 30,
    exercises: [],
  });

  const categories = ["홈트레이닝", "근력운동", "유산소", "스트레칭"];
  const difficulties = ["초급", "중급", "고급"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: formData.exercises.length + 1,
      name: "",
      description: "",
      sets: 3,
      reps: 10,
      restTime: 60,
      image: "",
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    }));
  };

  const handleExerciseChange = (
    exerciseId: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("루틴 생성:", formData);
    navigate("/routines");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                새로운 루틴 만들기
              </h1>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  제목
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="루틴 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="루틴에 대한 설명을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    카테고리
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    난이도
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    소요 시간 (분)
                  </label>
                  <Input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">운동 목록</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddExercise}
                >
                  운동 추가
                </Button>
              </div>

              {formData.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      운동 {exercise.id}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      삭제
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`exercise-${exercise.id}-name`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        운동 이름
                      </label>
                      <Input
                        type="text"
                        id={`exercise-${exercise.id}-name`}
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="운동 이름을 입력하세요"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`exercise-${exercise.id}-description`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        설명
                      </label>
                      <Input
                        type="text"
                        id={`exercise-${exercise.id}-description`}
                        value={exercise.description}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="운동 설명을 입력하세요"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor={`exercise-${exercise.id}-sets`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        세트 수
                      </label>
                      <Input
                        type="number"
                        id={`exercise-${exercise.id}-sets`}
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "sets",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`exercise-${exercise.id}-reps`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        반복 횟수
                      </label>
                      <Input
                        type="number"
                        id={`exercise-${exercise.id}-reps`}
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "reps",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`exercise-${exercise.id}-restTime`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        휴식 시간 (초)
                      </label>
                      <Input
                        type="number"
                        id={`exercise-${exercise.id}-restTime`}
                        value={exercise.restTime}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "restTime",
                            parseInt(e.target.value)
                          )
                        }
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`exercise-${exercise.id}-image`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      이미지 URL
                    </label>
                    <Input
                      type="text"
                      id={`exercise-${exercise.id}-image`}
                      value={exercise.image}
                      onChange={(e) =>
                        handleExerciseChange(
                          exercise.id,
                          "image",
                          e.target.value
                        )
                      }
                      placeholder="운동 이미지 URL을 입력하세요"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/routines")}
              >
                취소
              </Button>
              <Button type="submit" variant="primary">
                루틴 만들기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoutine;
