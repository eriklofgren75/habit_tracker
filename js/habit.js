// --- STEP 1: Get the habit ID from the URL ---
const params = new URLSearchParams(window.location.search);
const habitId = parseInt(params.get("id"), 10);

// --- STEP 2: Grab the main content area ---
const main = document.querySelector("main");

// --- STEP 3: Load habits from localStorage ---
let habits = JSON.parse(localStorage.getItem("habits"));

// --- Handle missing or invalid data ---
if (!habits || habits.length === 0) {
  main.innerHTML = `<p>No habit data found. Please return to the <a href="index.html">home page</a>.</p>`;
  throw new Error("No habit data in localStorage.");
}

const habit = habits.find((h) => h.id === habitId);

if (!habit) {
  main.innerHTML = `<p>Habit not found. Please go back to the <a href="index.html">home page</a>.</p>`;
  throw new Error("Habit not found.");
}

// --- STEP 4: Display the habit’s details dynamically ---
main.innerHTML = `
  <section class="habit-details">
    <h2>${habit.name}</h2>
    <p><strong>Category:</strong> ${habit.category}</p>
    <p><strong>Frequency:</strong> ${habit.frequency}</p>
    <p><strong>Streak:</strong> ${habit.completed.length} days</p>
    <p><strong>Notes:</strong> ${habit.notes || "No notes added."}</p>

    <button id="markComplete">Mark as Complete</button>
    <button id="goBack">← Back to Home</button>
  </section>
`;

// --- STEP 5: Add interactivity ---
// (1) Go back button
document.getElementById("goBack").addEventListener("click", () => {
  window.location.href = "index.html";
});

// (2) Mark Complete button
document.getElementById("markComplete").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];

  // Avoid duplicate entries for the same day
  if (!habit.completed.includes(today)) {
    habit.completed.push(today);
    localStorage.setItem("habits", JSON.stringify(habits));
    alert(`Nice work! You completed "${habit.name}" today.`);
  } else {
    alert(`You've already marked "${habit.name}" complete for today.`);
  }

  // Re-render streak count on the page
  document.querySelector(".habit-details").innerHTML = `
    <h2>${habit.name}</h2>
    <p><strong>Category:</strong> ${habit.category}</p>
    <p><strong>Frequency:</strong> ${habit.frequency}</p>
    <p><strong>Streak:</strong> ${habit.completed.length} days</p>
    <p><strong>Notes:</strong> ${habit.notes || "No notes added."}</p>

    <button id="markComplete">Mark as Complete</button>
    <button id="goBack">← Back to Home</button>
  `;

  // Reattach event listeners (since we re-rendered the content)
  document.getElementById("goBack").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("markComplete").addEventListener("click", () => {
    alert(`You've already marked "${habit.name}" complete for today.`);
  });
});

if (!habits || habits.length === 0) {
  main.innerHTML = `<p>No habit data found. Please return to the <a href="./index.html">home page</a>.</p>`;
  return; // stop instead of throwing an error
}

if (!habit) {
  main.innerHTML = `<p>Habit not found. Please go back to the <a href="./index.html">home page</a>.</p>`;
  return; // stop instead of throwing an error
}