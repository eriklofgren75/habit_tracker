// habit-details.js
import { qParam, todayISO } from "./utils.js";
import { getAllHabits } from "./habits.js";
import { saveUserHabits, loadUserHabits } from "./storage.js";
import { renderHabitDetails } from "./ui.js";

const main = document.querySelector("main");

async function init() {
  const idParam = qParam("id");
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
    const today = todayISO();
    // Attach completed to either user-stored copy or create new user copy
    let user = loadUserHabits();
    const idx = user.findIndex(h => Number(h.id) === id);
    if (idx !== -1) {
      if (!user[idx].completed) user[idx].completed = [];
      if (!user[idx].completed.includes(today)) user[idx].completed.push(today);
      saveUserHabits(user);
    } else {
      // create user-modified copy
      const newCopy = { ...habit, completed: [...(habit.completed || []), today] };
      // Preserve ID so that user copy overrides catalog version
      user.push(newCopy);
      saveUserHabits(user);
    }

    // Re-render details
    init();
  });
}

init();
