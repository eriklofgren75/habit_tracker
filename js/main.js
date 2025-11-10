// --- Select DOM ---
const habitList = document.querySelector(".habit-list");
const categoryFilter = document.getElementById("category");
const habitForm = document.getElementById("habitForm");

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
      <p><strong>Start Date:</strong> ${habit.createdAt}</p>

      <button onclick="viewHabit(${habit.id})">View Details</button>
      <button class="change-date-btn" data-id="${habit.id}">Change Start Date</button>
      <input type="date" class="date-input" data-id="${habit.id}" style="display:none;">
    `;

    habitList.appendChild(card);
  });
}

// --- Initialize App ---
async function init() {
  let habits = JSON.parse(localStorage.getItem("habits"));

  if (!habits) {
    const response = await fetch("./json/habits.json?nocache=" + Date.now());
    habits = await response.json();
    localStorage.setItem("habits", JSON.stringify(habits));
    console.log("Loaded habits from JSON into localStorage.");
  } else {
    console.log("Loaded habits from localStorage.");
  }

  renderHabits(habits);

  // --- Filter by Category ---
  categoryFilter.addEventListener("change", () => {
    const selected = categoryFilter.value;
    const habitsData = JSON.parse(localStorage.getItem("habits"));
    if (selected === "all") {
      renderHabits(habitsData);
    } else {
      const filtered = habitsData.filter((h) => h.category === selected);
      renderHabits(filtered);
    }
  });
}

// --- Event Delegation for Change Start Date ---
habitList.addEventListener("click", (e) => {
  if (e.target.classList.contains("change-date-btn")) {
    const id = parseInt(e.target.dataset.id, 10);
    const dateInput = document.querySelector(`.date-input[data-id="${id}"]`);
    dateInput.style.display = "inline-block";
    dateInput.focus();
  }
});

// --- Handle Date Change Event ---
habitList.addEventListener("change", (e) => {
  if (e.target.classList.contains("date-input")) {
    const id = parseInt(e.target.dataset.id, 10);
    const habits = JSON.parse(localStorage.getItem("habits"));
    const habit = habits.find((h) => h.id === id);

    habit.createdAt = e.target.value;
    localStorage.setItem("habits", JSON.stringify(habits));

    alert(`Start date for "${habit.name}" updated to ${habit.createdAt}.`);
    renderHabits(habits);
  }
});

// --- Reset Habits Button ---
document.getElementById("resetHabits").addEventListener("click", async () => {
  if (confirm("Are you sure you want to reset all habits to default?")) {
    const response = await fetch("./json/habits.json?nocache=" + Date.now());
    const defaultHabits = await response.json();
    localStorage.setItem("habits", JSON.stringify(defaultHabits));
    renderHabits(defaultHabits);
    alert("Habits reset to default!");
  }
});

// --- View Habit Function ---
window.viewHabit = function (id) {
  window.location.href = `habit.html?id=${id}`;
};

// --- Run the App ---
init();
