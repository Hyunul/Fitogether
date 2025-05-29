import {
  format,
  addDays,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  caloriesBurned: number;
}

interface Challenge {
  id: string;
  title: string;
  status: "in_progress" | "completed";
  progress: number;
  startDate: string;
  endDate: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  averageDuration: number;
  averageCalories: number;
}

interface ChallengeStats {
  totalChallenges: number;
  completedChallenges: number;
  inProgressChallenges: number;
  averageProgress: number;
}

interface DailyStats {
  date: string;
  workouts: number;
  minutes: number;
  calories: number;
}

interface WorkoutDistribution {
  [key: string]: {
    count: number;
    totalMinutes: number;
    totalCalories: number;
  };
}

export const calculateReportPeriod = (
  type: "weekly" | "monthly",
  date: Date
) => {
  if (type === "weekly") {
    return {
      startDate: startOfWeek(date, { weekStartsOn: 1 }),
      endDate: endOfWeek(date, { weekStartsOn: 1 }),
    };
  } else {
    return {
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
    };
  }
};

export const generateReportTitle = (
  type: "weekly" | "monthly",
  startDate: Date
) => {
  if (type === "weekly") {
    return `${format(startDate, "yyyy년 MM월")} ${format(
      startDate,
      "d"
    )}주차 리포트`;
  } else {
    return `${format(startDate, "yyyy년 MM월")} 리포트`;
  }
};

export const calculateWorkoutStats = (workouts: Workout[]): WorkoutStats => {
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );
  const totalCalories = workouts.reduce(
    (sum, workout) => sum + workout.caloriesBurned,
    0
  );

  return {
    totalWorkouts,
    totalMinutes,
    totalCalories,
    averageDuration: totalWorkouts > 0 ? totalMinutes / totalWorkouts : 0,
    averageCalories: totalWorkouts > 0 ? totalCalories / totalWorkouts : 0,
  };
};

export const calculateChallengeStats = (
  challenges: Challenge[]
): ChallengeStats => {
  const totalChallenges = challenges.length;
  const completedChallenges = challenges.filter(
    (c) => c.status === "completed"
  ).length;
  const inProgressChallenges = challenges.filter(
    (c) => c.status === "in_progress"
  ).length;
  const averageProgress =
    challenges.reduce((sum, challenge) => sum + challenge.progress, 0) /
    totalChallenges;

  return {
    totalChallenges,
    completedChallenges,
    inProgressChallenges,
    averageProgress,
  };
};

export const groupWorkoutsByDate = (
  workouts: Workout[]
): { [key: string]: Workout[] } => {
  return workouts.reduce((groups, workout) => {
    const date = workout.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {} as { [key: string]: Workout[] });
};

export const calculateDailyStats = (workouts: Workout[]): DailyStats[] => {
  const groupedWorkouts = groupWorkoutsByDate(workouts);
  return Object.entries(groupedWorkouts).map(([date, dayWorkouts]) => ({
    date,
    workouts: dayWorkouts.length,
    minutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    calories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
  }));
};

export const calculateWorkoutDistribution = (
  workouts: Workout[]
): WorkoutDistribution => {
  return workouts.reduce((distribution, workout) => {
    if (!distribution[workout.name]) {
      distribution[workout.name] = {
        count: 0,
        totalMinutes: 0,
        totalCalories: 0,
      };
    }
    distribution[workout.name].count++;
    distribution[workout.name].totalMinutes += workout.duration;
    distribution[workout.name].totalCalories += workout.caloriesBurned;
    return distribution;
  }, {} as WorkoutDistribution);
};
