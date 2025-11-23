import { getAllHabits } from "./data.js";
import { addUserHabit } from "./storage.js";

const habitList = document.querySelector(".habit-list");
const categoryFilter = document.getElementById("category");
const habitForm = document.getElementById("habitForm");

// --- Render Habits ---
function renderHabits(habits) {
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const card = document.createElement("article");
    card.classList.add("habit-card");

    card.innerHTML = `
      <h3>${habit.name}</h3>
      <p><strong>Category:</strong> ${habit.category}</p>
      <p><strong>Frequency:</strong> ${habit.frequency}</p>
      <p><strong>Streak:</strong> ${habit.completed.length} days</p>
      <button onclick="viewHabit(${habit.id})">View Details</button>
    `;

    habitList.appendChild(card);
  });
}

// --- Initial Load ---
async function init() {
  const habits = await getAllHabits();
  renderHabits(habits);

  // Category filtering
  categoryFilter.addEventListener("change", async () => {
    const all = await getAllHabits();
    const category = categoryFilter.value;

    if (category === "all") {
      renderHabits(all);
    } else {
      renderHabits(all.filter(h => h.category === category));
    }
  });

  // Add habit form
  habitForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newHabit = {
      id: Date.now(),             // unique ID
      name: habitForm.habitName.value,
      category: habitForm.categorySelect.value,
      frequency: habitForm.frequency.value,
      notes: habitForm.notes.value,
      createdAt: new Date().toISOString().split("T")[0],
      completed: []
    };

    addUserHabit(newHabit);

    const updated = await getAllHabits();
    renderHabits(updated);

    habitForm.reset();
    alert("Habit added!");
  });
}

window.viewHabit = function (id) {
  window.location.href = `habit.html?id=${id}`;
};

init();