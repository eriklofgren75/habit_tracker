import { getAllHabits } from "./habits.js";
import { saveUserHabits, loadUserHabits } from "./storage.js";
import { renderHabitDetails } from "./ui.js";

const main = document.querySelector("main");

// Replaces the missing qParam()
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

async function init() {
  const idParam = getQueryParam("id");
  const id = Number(idParam);

  if (!id) {
    main.innerHTML = `<p>Missing habit id in URL. <a href="./index.html">Go back</a></p>`;
    return;
  }

  const all = await getAllHabits();
  const habit = all.find(h => Number(h.id) === id);

  if (!habit) {
    main.innerHTML = `<p>Habit not found. <a href="./index.html">Go back</a></p>`;
    return;
  }

  renderHabitDetails(habit, main);

  document.getElementById("backToHome").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("markComplete").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];

    let user = loadUserHabits();
    const idx = user.findIndex(h => Number(h.id) === id);

    if (idx !== -1) {
      if (!user[idx].completed) user[idx].completed = [];
      if (!user[idx].completed.includes(today)) {
        user[idx].completed.push(today);
      }
      saveUserHabits(user);
    } else {
      const newCopy = { ...habit, completed: [...(habit.completed || []), today] };
      user.push(newCopy);
      saveUserHabits(user);
    }

    init();
  });
}

init();
