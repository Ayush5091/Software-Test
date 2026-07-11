// Static exercise library used by the Workout Planner + AI recommendation.
// Each exercise references an `illustration` key rendered by
// components/ExerciseIllustration.js — custom inline SVG, so the planner
// never depends on external image hosting.

export const EXERCISES = [
  {
    id: "squat",
    name: "Bodyweight Squat",
    goals: ["lose_weight", "build_muscle", "general_fitness"],
    muscle: "Legs & Glutes",
    equipment: "None",
    difficulty: "Beginner",
    illustration: "squat",
    sets: "3 sets x 15 reps",
    steps: [
      "Stand with feet shoulder-width apart, toes slightly turned out.",
      "Brace your core and push your hips back like sitting into a chair.",
      "Bend your knees and lower until thighs are parallel to the floor.",
      "Keep your chest up and weight on your heels.",
      "Drive through your heels to stand back up to the start."
    ]
  },
  {
    id: "pushup",
    name: "Push-Up",
    goals: ["build_muscle", "general_fitness"],
    muscle: "Chest, Shoulders & Triceps",
    equipment: "None",
    difficulty: "Beginner",
    illustration: "pushup",
    sets: "3 sets x 12 reps",
    steps: [
      "Start in a plank position with hands slightly wider than shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Lower your chest toward the floor by bending your elbows.",
      "Stop just above the floor, elbows near 45 degrees from your body.",
      "Push back up explosively to the starting position."
    ]
  },
  {
    id: "plank",
    name: "Plank Hold",
    goals: ["lose_weight", "general_fitness", "endurance"],
    muscle: "Core",
    equipment: "None",
    difficulty: "Beginner",
    illustration: "plank",
    sets: "3 sets x 30-45 sec",
    steps: [
      "Rest on your forearms and toes, elbows under shoulders.",
      "Keep your body in one straight line — no sagging hips.",
      "Squeeze your glutes and brace your abs.",
      "Breathe steadily and hold the position for the set time.",
      "Lower to the floor with control to finish the set."
    ]
  },
  {
    id: "lunge",
    name: "Forward Lunge",
    goals: ["lose_weight", "build_muscle", "general_fitness"],
    muscle: "Legs & Glutes",
    equipment: "None",
    difficulty: "Beginner",
    illustration: "lunge",
    sets: "3 sets x 10 reps / leg",
    steps: [
      "Stand tall with feet hip-width apart.",
      "Step forward with one leg and lower your hips until both knees are bent 90 degrees.",
      "Keep your front knee above your ankle, not past your toes.",
      "Push through your front heel to return to standing.",
      "Alternate legs for the full set."
    ]
  },
  {
    id: "deadlift",
    name: "Dumbbell Deadlift",
    goals: ["build_muscle"],
    muscle: "Hamstrings & Back",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    illustration: "deadlift",
    sets: "4 sets x 8 reps",
    steps: [
      "Stand with feet hip-width apart, dumbbells in front of your thighs.",
      "Hinge at the hips and push your glutes back, keeping a flat back.",
      "Lower the weights along your shins until you feel a hamstring stretch.",
      "Keep your shoulders back and core braced throughout.",
      "Drive your hips forward to return to standing."
    ]
  },
  {
    id: "shoulder_press",
    name: "Dumbbell Shoulder Press",
    goals: ["build_muscle"],
    muscle: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    illustration: "shoulder_press",
    sets: "3 sets x 10 reps",
    steps: [
      "Sit or stand holding dumbbells at shoulder height, palms forward.",
      "Brace your core so your lower back doesn't arch.",
      "Press the weights straight overhead until arms are extended.",
      "Pause briefly at the top without locking elbows harshly.",
      "Lower back to shoulder height with control."
    ]
  },
  {
    id: "mountain_climber",
    name: "Mountain Climbers",
    goals: ["lose_weight", "endurance"],
    muscle: "Full Body / Cardio",
    equipment: "None",
    difficulty: "Beginner",
    illustration: "mountain_climber",
    sets: "3 sets x 30 sec",
    steps: [
      "Start in a high plank with hands under shoulders.",
      "Drive one knee toward your chest.",
      "Quickly switch legs, extending the first leg back.",
      "Keep hips low and core tight throughout.",
      "Continue alternating at a controlled, steady pace."
    ]
  },
  {
    id: "jump_rope",
    name: "Jump Rope Intervals",
    goals: ["lose_weight", "endurance"],
    muscle: "Full Body / Cardio",
    equipment: "Jump rope",
    difficulty: "Beginner",
    illustration: "jump_rope",
    sets: "5 rounds x 45 sec, 15 sec rest",
    steps: [
      "Hold rope handles lightly, elbows close to your body.",
      "Rotate the rope using your wrists, not your shoulders.",
      "Jump just high enough to clear the rope.",
      "Land softly on the balls of your feet.",
      "Keep a steady rhythm for the full interval."
    ]
  },
  {
    id: "row",
    name: "Bent-Over Dumbbell Row",
    goals: ["build_muscle"],
    muscle: "Back & Biceps",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    illustration: "row",
    sets: "3 sets x 12 reps",
    steps: [
      "Hinge forward at the hips with a flat back, knees slightly bent.",
      "Let dumbbells hang below your shoulders, arms extended.",
      "Pull the weights toward your hips, squeezing your shoulder blades.",
      "Pause briefly at the top of the movement.",
      "Lower the weights with control back to the start."
    ]
  },
  {
    id: "run_steady",
    name: "Steady-State Run",
    goals: ["endurance", "lose_weight"],
    muscle: "Cardiovascular",
    equipment: "Treadmill or track",
    difficulty: "Beginner",
    illustration: "run",
    sets: "20-30 minutes, moderate pace",
    steps: [
      "Warm up with 5 minutes of brisk walking.",
      "Build into a pace where you can still speak in short sentences.",
      "Keep your posture tall and arms relaxed at your sides.",
      "Hold the steady pace for the planned duration.",
      "Cool down with 5 minutes of walking and light stretching."
    ]
  }
];

const GOAL_LABELS = {
  lose_weight: "Lose Weight",
  build_muscle: "Build Muscle",
  endurance: "Endurance",
  general_fitness: "General Fitness"
};

export function goalLabel(goal) {
  return GOAL_LABELS[goal] || "General Fitness";
}

// Very small rules-based "AI" recommender: filters the exercise library by
// goal, then balances it into a simple weekly split. This runs entirely
// client- or server-side with no external AI API required, so the feature
// works out of the box with zero extra keys/config.
export function recommendPlan(goal, daysPerWeek = 3) {
  const pool = EXERCISES.filter((e) => e.goals.includes(goal));
  const days = [];
  for (let i = 0; i < daysPerWeek; i++) {
    const picks = [];
    for (let j = i; j < pool.length; j += daysPerWeek) {
      picks.push(pool[j]);
    }
    if (picks.length === 0 && pool.length) picks.push(pool[i % pool.length]);
    days.push({ day: `Day ${i + 1}`, exercises: picks.slice(0, 5) });
  }
  return { goal, goalLabel: goalLabel(goal), daysPerWeek, days };
}
