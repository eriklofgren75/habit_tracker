const LS_KEY = "userHabits";

export function loadUserHabits() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUserHabits(habits) {
  localStorage.setItem(LS_KEY, JSON.stringify(habits));
}

export function addUserHabit(habit) {
  const arr = loadUserHabits();
  // Ensure unique id for user-created habits
  habit.id = Date.now();
  arr.push(habit);
  saveUserHabits(arr);
  return arr;
}

export function updateUserHabitById(id, changes) {
  const arr = loadUserHabits();
  const idx = arr.findIndex(h => h.id === id);
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...changes };
    saveUserHabits(arr);
    return arr;
  } else {
    // If not found in userHabits -> create a user-modified copy with same id
    const newItem = { id, ...changes };
    arr.push(newItem);
    saveUserHabits(arr);
    return arr;
  }
}

export function clearUserHabits() {
  localStorage.removeItem(LS_KEY);
}