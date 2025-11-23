import { getAllHabits } from "./data.js";
import { updateUserHabit } from "./storage.js";

const main = document.querySelector("main");

async function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const habitId = Number(params.get("id"));

  const habits = await getAllHabits();
  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    main.innerHTML = "<h2>Habit not found.</h2>";
    return;
  }

  main.innerHTML = `
    <section class="habit-details">
      <h2>${habit.name}</h2>
      <p><strong>Category:</strong> ${habit.category}</p>
      <p><strong>Frequency:</strong> ${habit.frequency}</p>
      <p><strong>Notes:</strong> ${habit.notes}</p>
      <p><strong>Streak:</strong> ${habit.completed.length} days</p>

      <button id="markComplete">Mark Completed Today</button>
      <button onclick="window.location.href='index.html'">← Back</button>
    </section>
  `;

  document.getElementById("markComplete").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];

    if (!habit.completed.includes(today)) {
      habit.completed.push(today);

      // only update if user habit
      if (habit.id.toString().length > 4) {
        updateUserHabit(habit);
      }

      alert("Marked as completed!");
      initDetailPage(); // re-render
    }
  });
}

initDetailPage();