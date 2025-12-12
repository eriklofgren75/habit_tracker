// ================= IMPORTS ===================
import { getAllHabits, createUserHabit } from "./habits.js";
import { loadUserHabits, saveUserHabits, clearUserHabits } from "./storage.js";
import { renderHabitCards } from "./ui.js";

// Detect which page we are on
const isIndexPage = document.querySelector(".habit-list") !== null;
const isDetailPage = window.location.pathname.includes("habit.html");

// Global DOM references (some may be null on habit.html)
const habitList = document.querySelector(".habit-list");
const habitForm = document.getElementById("habitForm");
const categoryFilter = document.getElementById("category");
const resetBtn = document.getElementById("resetHabits");

// Modals
const addModal = document.getElementById("addHabitModal");
const addCloseBtn = document.querySelector(".close-modal");
const modalForm = document.getElementById("modalHabitForm");

const pickerModal = document.getElementById("habitPickerModal");
const pickerCloseBtn = document.querySelector(".picker-close");
const pickerList = document.getElementById("habitPickerList");

// Nav buttons
const navHabitDetails = document.getElementById("navHabitDetails");
const navAddHabit = document.getElementById("navAddHabit");


// =============== MODAL HELPERS ==================
function openAddModal() {
  if (addModal) addModal.classList.remove("hidden");
}

function closeAddModal() {
  if (addModal) addModal.classList.add("hidden");
}

function openPickerModal() {
  if (pickerModal) pickerModal.classList.remove("hidden");
}

function closePickerModal() {
  if (pickerModal) pickerModal.classList.add("hidden");
}


// =============== PICKER MODAL POPULATION ==================
async function buildPickerModal() {
  if (!pickerList) return;

  const habits = await getAllHabits();
  pickerList.innerHTML = "";

  habits.forEach(h => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="picker-item" data-id="${h.id}">
        ${h.name}
      </button>
    `;
    pickerList.appendChild(li);
  });
}


// =============== MAIN INITIALIZER ================
async function init() {
  // ------------ INDEX PAGE LOGIC -------------
  if (isIndexPage) {
    const habits = await getAllHabits();
    renderHabitCards(habits, habitList);

    // Card actions (view details / change start date)
    habitList.addEventListener("click", (e) => {
      const id = Number(e.target.dataset.id);
      if (!id) return;

      if (e.target.classList.contains("details-btn")) {
        window.location.href = `habit.html?id=${id}`;
      }

      if (e.target.classList.contains("change-date-btn")) {
        const input = document.querySelector(`.date-input[data-id="${id}"]`);
        if (!input) return;
        input.showPicker(); // Better experience
      }
    });

    // Add habit (inline form)
    if (habitForm) {
      habitForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newHabit = {
          name: habitForm.habitName.value.trim(),
          category: habitForm.categorySelect.value,
          frequency: habitForm.frequency.value,
          notes: habitForm.notes.value.trim(),
          completed: [],
          createdAt: new Date().toISOString().split("T")[0]
        };

        createUserHabit(newHabit);

        const all = await getAllHabits();
        renderHabitCards(all, habitList);

        habitForm.reset();
      });
    }

    // Filtering
    if (categoryFilter) {
      categoryFilter.addEventListener("change", async () => {
        const all = await getAllHabits();
        const val = categoryFilter.value;
        renderHabitCards(
          val === "all" ? all : all.filter(h => h.category === val),
          habitList
        );
      });
    }

    // Reset
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset only user-saved habits to empty?")) {
          clearUserHabits();
          getAllHabits().then(data => renderHabitCards(data, habitList));
        }
      });
    }
  }

  // --------- UNIVERSAL NAV BUTTON LOGIC (works on BOTH pages) ---------

  // Habit Details (opens picker modal)
  if (navHabitDetails) {
    navHabitDetails.addEventListener("click", async (e) => {
      e.preventDefault();
      await buildPickerModal();
      openPickerModal();
    });
  }

  // Add Habit (opens add modal)
  if (navAddHabit) {
    navAddHabit.addEventListener("click", (e) => {
      e.preventDefault();
      openAddModal();
    });
  }

  // Add Habit Modal Submit
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

      if (isIndexPage) {
        const all = await getAllHabits();
        renderHabitCards(all, habitList);
      }

      closeAddModal();
      modalForm.reset();
    });
  }

  // Modal Close Buttons
  if (addCloseBtn) addCloseBtn.addEventListener("click", closeAddModal);
  if (pickerCloseBtn) pickerCloseBtn.addEventListener("click", closePickerModal);

  // Picker Modal item click
  if (pickerList) {
    pickerList.addEventListener("click", (e) => {
      if (e.target.classList.contains("picker-item")) {
        const id = e.target.dataset.id;
        window.location.href = `habit.html?id=${id}`;
      }
    });
  }
}

init();
