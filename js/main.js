// --- Select DOM ---
const habitList = document.querySelector(".habit-list");
const categoryFilter = document.getElementById("category");
const habitForm = document.getElementById("habitForm");

// --- Initialize App ---
async function init() {
  // Check if habits already exist in localStorage
  let habits = JSON.parse(localStorage.getItem("habits"));

  if (!habits) {
    // If not, fetch from JSON and save to localStorage
    const response = await fetch("json/habits.json?nocache=" + Date.now());
    habits = await response.json();
    localStorage.setItem("habits", JSON.stringify(habits));
    console.log("Loaded habits from JSON into localStorage.");
  } else {
    console.log("Loaded habits from localStorage.");
  }

  // Render all habits on load
  renderHabits(habits);

  // --- Filter functionality ---
  categoryFilter.addEventListener("change", () => {
    const selected = categoryFilter.value;
    if (selected === "all") {
      renderHabits(habits);
    } else {
      const filtered = habits.filter((h) => h.category === selected);
      renderHabits(filtered);
    }
  });

  // --- Form submission: Add new habit ---
  habitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user input
    const name = document.getElementById("habitName").value.trim();
    const category = document.getElementById("categorySelect").value;
    const frequency = document.getElementById("frequency").value;
    const notes = document.getElementById("notes").value.trim();

    // Validation check (HTML also does this, but double-safe)
    if (!name || !category || !frequency) {
      alert("Please fill out all required fields.");
      return;
    }

    // Create new habit object
    const newHabit = {
      id: Date.now(), // unique ID
      name,
      category,
      frequency,
      completed: [],
      notes,
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Update localStorage
    let currentHabits = JSON.parse(localStorage.getItem("habits")) || [];
    currentHabits.push(newHabit);
    localStorage.setItem("habits", JSON.stringify(currentHabits));

    // Clear form
    habitForm.reset();

    // Re-render list with new habit
    renderHabits(currentHabits);

    console.log(`Added new habit: ${name}`);
  });
}

// --- Render Habits ---
function renderHabits(habitsArray) {
  habitList.innerHTML = ""; // Clear previous habits

  habitsArray.forEach((habit) => {
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

// --- Resets Habits --- //
document.getElementById("resetHabits").addEventListener("click", async () => {
  if (confirm("Are you sure you want to reset all habits to default?")) {
    const response = await fetch("./json/habits.json?nocache=" + Date.now());
    const defaultHabits = await response.json();
    localStorage.setItem("habits", JSON.stringify(defaultHabits));
    renderHabits(defaultHabits);
    alert("Habits reset to default!");
  }
});

// --- Placeholder function for View Detail ---
window.viewHabit = function (id) {
  // Redirect with URL parameter (for habit.html)
  window.location.href = `habit.html?id=${id}`;
};

// Initialize app
init();
