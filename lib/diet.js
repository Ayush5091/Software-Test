// Static, rules-based diet suggestions per goal — informational starting
// points, not a substitute for advice from a nutritionist or doctor.
export const DIET_PLANS = {
  lose_weight: {
    summary: "A moderate calorie deficit with high protein to preserve muscle while losing fat.",
    meals: [
      "Breakfast: Greek yogurt with berries and a handful of oats.",
      "Lunch: Grilled chicken or tofu salad with olive oil dressing.",
      "Dinner: Baked fish or legumes with steamed vegetables.",
      "Snacks: Almonds, an apple, or a protein shake between meals."
    ]
  },
  build_muscle: {
    summary: "A calorie surplus with high protein and enough carbs to fuel training.",
    meals: [
      "Breakfast: Eggs, whole-grain toast, and a banana.",
      "Lunch: Rice, grilled chicken or paneer, and mixed vegetables.",
      "Dinner: Salmon or lentils with sweet potato.",
      "Snacks: Cottage cheese, peanut butter toast, or a mass-gainer shake."
    ]
  },
  endurance: {
    summary: "Carb-forward eating to keep glycogen stores topped up for long sessions.",
    meals: [
      "Breakfast: Oatmeal with banana and honey.",
      "Lunch: Whole-grain pasta with lean protein and vegetables.",
      "Dinner: Rice bowl with grilled protein and greens.",
      "Snacks: Dates, energy bars, or a fruit smoothie before training."
    ]
  },
  general_fitness: {
    summary: "A balanced plate — protein, whole grains, vegetables, and healthy fats — most meals.",
    meals: [
      "Breakfast: Eggs or yogurt with fruit.",
      "Lunch: Grilled protein, a whole grain, and vegetables.",
      "Dinner: Similar balance to lunch, lighter portion.",
      "Snacks: Nuts, fruit, or yogurt."
    ]
  }
};
