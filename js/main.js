import { getAllHabits as getDisplay } from "./habits.js";
import { createUserHabit } from "./habits.js";
import { loadUserHabits, saveUserHabits, clearUserHabits } from "./storage.js";
import { renderHabitCards } from "./ui.js";

const habitList = document.querySelector(".habit-list");
const habitForm = document.getElementById("habitForm");
const categoryFilter = document.getElementById("category");
const resetBtn = document.getElementById("resetHabits");

// Render initial list
async function init() {
  const habits = await getDisplay();
  window._catalogRendered = habits; // debug helper
  renderHabitCards(habits, habitList);

  wireUp();
}

function wireUp() {
  // Delegated click listener for change date / details button
  habitList.addEventListener("click", (e) => {
    const idAttr = e.target.dataset.id;
    if (!idAttr) return;
    const id = Number(idAttr);

    if (e.target.classList.contains("change-date-btn")) {
      const input = document.querySelector(`.date-input[data-id="${id}"]`);
      if (input) {
        input.style.display = input.style.display === "inline-block" ? "none" : "inline-block";
        input.focus();
      }
      return;
    }

    if (e.target.classList.contains("details-btn")) {
      window.location.href = `habit.html?id=${id}`;
      return;
    }
  });

  habitList.addEventListener("change", (e) => {
    if (e.target.classList.contains("date-input")) {
      // We'll call habit update via fetch to storage through habits.update flow.
      // To keep main.js minimal, reload page state after updating via API functions.
      // For now, call a simple event that habit.js handles (we will re-render in this file).
      const id = Number(e.target.dataset.id);
      const newDate = e.target.value;
      // Update via storage helper: create/update a user habit
      // We import saveUserHabits via storage.js earlier if needed
      const user = loadUserHabits();
      const idx = user.findIndex(h => h.id === id);
      if (idx !== -1) {
        user[idx].createdAt = newDate;
      } else {
        // create a user-modified copy
        user.push({ id, createdAt: newDate, name: "Modified habit", completed: [] });
      }
      saveUserHabits(user);
      // Re-render
      getDisplay().then(h => renderHabitCards(h, habitList));
    }
  });

  // form submit
  if (habitForm) {
    habitForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newHabit = {
        name: e.target.habitName.value.trim(),
        category: e.target.categorySelect.value,
        frequency: e.target.frequency.value,
        notes: e.target.notes.value.trim(),
        completed: [],
        createdAt: new Date().toISOString().split("T")[0]
      };

      createUserHabit(newHabit);
      const all = await getDisplay();
      renderHabitCards(all, habitList);
      habitForm.reset();
    });
  }

  // Filtering
  if (categoryFilter) {
    categoryFilter.addEventListener("change", async () => {
      const all = await getDisplay();
      const val = categoryFilter.value;
      if (val === "all") renderHabitCards(all, habitList);
      else renderHabitCards(all.filter(h => h.category === val), habitList);
    });
  }

  // Reset user habits (doesn't alter catalog JSON)
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset only user-saved habits to empty?")) return;
      clearUserHabits();
      getDisplay().then(h => renderHabitCards(h, habitList));
    });
  }
}

init();
