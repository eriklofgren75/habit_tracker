import { getAllHabits as getDisplay } from "./habits.js";
import { createUserHabit } from "./habits.js";
import { loadUserHabits, saveUserHabits, clearUserHabits } from "./storage.js";
import { renderHabitCards } from "./ui.js";

const habitList = document.querySelector(".habit-list");
const habitForm = document.getElementById("habitForm");
const categoryFilter = document.getElementById("category");
const resetBtn = document.getElementById("resetHabits");

// Modal elements
const modal = document.getElementById("addHabitModal");
const closeBtn = document.querySelector(".close-modal");
const modalForm = document.getElementById("modalHabitForm");

async function init() {
  const habits = await getDisplay();
  renderHabitCards(habits, habitList);

  // Make sure modal is hidden unless specifically requested
  if (modal) modal.classList.add("hidden");

  wireUp();

  // Open modal if ?add is present
  const params = new URLSearchParams(window.location.search);
  if (params.has("add")) {
    openModal();
  }
}

// =====================
// Event Wiring
// =====================
function wireUp() {
  // Click events on habit cards (change date, details)
  habitList.addEventListener("click", (e) => {
    const idAttr = e.target.dataset.id;
    if (!idAttr) return;
    const id = Number(idAttr);

    if (e.target.classList.contains("change-date-btn")) {
      const input = document.querySelector(`.date-input[data-id="${id}"]`);
      if (input) {
        input.style.display =
          input.style.display === "inline-block" ? "none" : "inline-block";
        input.focus();
      }
      return;
    }

    if (e.target.classList.contains("details-btn")) {
      window.location.href = `habit.html?id=${id}`;
      return;
    }
  });

  // Handle date change
  habitList.addEventListener("change", (e) => {
    if (!e.target.classList.contains("date-input")) return;

    const id = Number(e.target.dataset.id);
    const newDate = e.target.value;

    let user = loadUserHabits();
    const idx = user.findIndex((h) => h.id === id);

    if (idx !== -1) {
      user[idx].createdAt = newDate;
    } else {
      user.push({ id, createdAt: newDate, name: "Modified Habit", completed: [] });
    }

    saveUserHabits(user);

    getDisplay().then((list) => renderHabitCards(list, habitList));
  });

  // Normal add-habit form
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

  // Modal add-habit form
  if (modalForm) {
    modalForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newHabit = {
        name: document.getElementById("mHabitName").value.trim(),
        category: document.getElementById("mCategorySelect").value,
        frequency: document.getElementById("mFrequency").value,
        notes: document.getElementById("mNotes").value.trim(),
        completed: [],
        createdAt: new Date().toISOString().split("T")[0]
      };

      createUserHabit(newHabit);

      const all = await getDisplay();
      renderHabitCards(all, habitList);

      closeModal();
      modalForm.reset();
    });
  }

  // Filter habits
  if (categoryFilter) {
    categoryFilter.addEventListener("change", async () => {
      const all = await getDisplay();
      const val = categoryFilter.value;
      if (val === "all") renderHabitCards(all, habitList);
      else renderHabitCards(all.filter((h) => h.category === val), habitList);
    });
  }

  // Reset habits
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset only user-saved habits to empty?")) return;

      clearUserHabits();
      getDisplay().then((h) => renderHabitCards(h, habitList));
    });
  }

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
}

// =====================
// Modal functions
// =====================
export function openModal() {
  modal?.classList.remove("hidden");
}

function closeModal() {
  modal?.classList.add("hidden");
}

init();
