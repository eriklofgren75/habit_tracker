import { loadCatalog } from "./catalog.js";
import { loadUserHabits, addUserHabit, updateUserHabitById } from "./storage.js";

/**
 * Returns the merged habit list:
 * - catalog items are base definitions
 * - any user habit with same id overrides catalog (user-modified)
 * - user-only items (created by user) are appended
 */
export async function getAllHabits() {
  const catalog = await loadCatalog();
  const user = loadUserHabits();

  // Build map from catalog by id
  const map = new Map();
  catalog.forEach(h => map.set(Number(h.id), { ...h }));

  // Overlay user habits: if id matches catalog, override; otherwise add
  user.forEach(uh => {
    map.set(Number(uh.id), { ...uh });
  });

  // Return array of values (stable order: catalog order then user-only appended by map insertion)
  // But to preserve the original catalog order, start from catalog and then append user-only
  const result = catalog.map(c => map.get(Number(c.id))).filter(Boolean);

  // Add user-created items whose id was not in catalog (user-only)
  user.forEach(uh => {
    if (!catalog.some(c => Number(c.id) === Number(uh.id))) {
      result.push(uh);
    }
  });

  return result;
}

export function createUserHabit(habitObj) {
  return addUserHabit(habitObj);
}

// Update habit (will update user copy or create user-modified copy)
export function saveHabitUpdate(id, changes) {
  return updateUserHabitById(id, changes);
}
