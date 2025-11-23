import { getUserHabits } from "./storage.js";

// Fetch default habits from JSON
export async function getDefaultHabits() {
  const response = await fetch("./json/habits.json?nocache=" + Date.now());
  return await response.json();
}

// Merge defaults + user habits
export async function getAllHabits() {
  const defaults = await getDefaultHabits();
  const users = getUserHabits();
  return [...defaults, ...users]; // merged dataset
}