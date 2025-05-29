import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

interface Routine {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
}

const EditRoutine: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showNotification } = useNotifications();
  const { user } = useAuth();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Implement routine fetch
    const mockRoutine: Routine = {
      id: id || "",
      title: "Sample Routine",
      description: "This is a sample routine",
      category: "upperBody",
      difficulty: "intermediate",
      duration: 45,
      exercises: [
        {
          id: "1",
          name: "Push-ups",
          sets: 3,
          reps: 12,
          restTime: 60,
        },
      ],
    };
    setRoutine(mockRoutine);
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routine) return;

    setSaving(true);
    try {
      // TODO: Implement routine update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification(t("routine.updateSuccess"), "success");
      navigate(`/routines/${routine.id}`);
    } catch (error) {
      showNotification(t("routine.updateError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    if (!routine) return;

    const updatedExercises = [...routine.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };

    setRoutine({
      ...routine,
      exercises: updatedExercises,
    });
  };

  const addExercise = () => {
    if (!routine) return;

    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      sets: 3,
      reps: 12,
      restTime: 60,
    };

    setRoutine({
      ...routine,
      exercises: [...routine.exercises, newExercise],
    });
  };

  const removeExercise = (index: number) => {
    if (!routine) return;

    const updatedExercises = routine.exercises.filter((_, i) => i !== index);
    setRoutine({
      ...routine,
      exercises: updatedExercises,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("routine.notFound")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("routine.edit")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("routine.title")}
          </label>
          <input
            type="text"
            id="title"
            value={routine.title}
            onChange={(e) => setRoutine({ ...routine, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("routine.description")}
          </label>
          <textarea
            id="description"
            value={routine.description}
            onChange={(e) =>
              setRoutine({ ...routine, description: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("routine.category")}
            </label>
            <select
              id="category"
              value={routine.category}
              onChange={(e) =>
                setRoutine({ ...routine, category: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            >
              {Object.entries(
                t("routine.categories", { returnObjects: true })
              ).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("routine.difficulty")}
            </label>
            <select
              id="difficulty"
              value={routine.difficulty}
              onChange={(e) =>
                setRoutine({ ...routine, difficulty: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            >
              {Object.entries(
                t("routine.difficulties", { returnObjects: true })
              ).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("routine.duration")}
            </label>
            <input
              type="number"
              id="duration"
              value={routine.duration}
              onChange={(e) =>
                setRoutine({
                  ...routine,
                  duration: parseInt(e.target.value),
                })
              }
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t("routine.exercises")}
            </h2>
            <button
              type="button"
              onClick={addExercise}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t("routine.addExercise")}
            </button>
          </div>

          <div className="space-y-4">
            {routine.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t("routine.exercise")} {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t("routine.removeExercise")}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`exercise-${index}-name`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("routine.exerciseName")}
                    </label>
                    <input
                      type="text"
                      id={`exercise-${index}-name`}
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(index, "name", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`exercise-${index}-sets`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("routine.sets")}
                    </label>
                    <input
                      type="number"
                      id={`exercise-${index}-sets`}
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "sets",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`exercise-${index}-reps`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("routine.reps")}
                    </label>
                    <input
                      type="number"
                      id={`exercise-${index}-reps`}
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "reps",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`exercise-${index}-restTime`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("routine.restTime")}
                    </label>
                    <input
                      type="number"
                      id={`exercise-${index}-restTime`}
                      value={exercise.restTime}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "restTime",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/routines/${routine.id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoutine;
