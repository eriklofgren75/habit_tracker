const USER_KEY = "userHabits";

// Get user habits from localStorage
export function getUserHabits() {
  return JSON.parse(localStorage.getItem(USER_KEY)) || [];
}

// Save user habits back to localStorage
export function saveUserHabits(userHabits) {
  localStorage.setItem(USER_KEY, JSON.stringify(userHabits));
}

// Add a single user habit
export function addUserHabit(habit) {
  const habits = getUserHabits();
  habits.push(habit);
  saveUserHabits(habits);
}

// Update an existing user habit (by ID)
export function updateUserHabit(updatedHabit) {
  let habits = getUserHabits();
  habits = habits.map(h => (h.id === updatedHabit.id ? updatedHabit : h));
  saveUserHabits(habits);
}

// Reset user habits (does NOT affect default JSON data)
export function resetUserHabits() {
  localStorage.removeItem(USER_KEY);
}