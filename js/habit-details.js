import { getAllHabits } from "./habits.js";
import { loadUserHabits, saveUserHabits } from "./storage.js";
import { renderHabitDetails } from "./ui.js";

const main = document.querySelector("main");

// Extract URL parameter
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

async function init() {
  const idParam = getQueryParam("id");
  const id = Number(idParam);

  if (!id) {
    main.innerHTML = `<p>Missing habit ID in URL. <a href="./index.html">Go back</a></p>`;
    return;
  }

  const all = await getAllHabits();
  const user = loadUserHabits();

  const overridden = user.find((u) => Number(u.id) === id);
  const base = all.find((h) => Number(h.id) === id);

  const habit = overridden || base;

  if (!habit) {
    main.innerHTML = `<p>Habit not found. <a href="./index.html">Go back</a></p>`;
    return;
  }

  renderHabitDetails(habit, main);

  // COMPLETE BUTTON
  const completeBtn = document.getElementById("markComplete");
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      const today = new Date().toISOString().split("T")[0];

      const store = loadUserHabits();
      const idx = store.findIndex((h) => Number(h.id) === id);

      if (idx !== -1) {
        if (!store[idx].completed.includes(today)) {
          store[idx].completed.push(today);
        }
        saveUserHabits(store);
      } else {
        const newCopy = { ...habit, completed: [today] };
        saveUserHabits([...store, newCopy]);
      }

      init(); // refresh UI
    });
  }
}

init();
