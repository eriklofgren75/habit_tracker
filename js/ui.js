export function renderHabitCards(habits, container) {
  container.innerHTML = "";

  if (!habits || habits.length === 0) {
    container.innerHTML = `<p class="empty-state">No habits to show.</p>`;
    return;
  }

  habits.forEach(habit => {
    const card = document.createElement("article");
    card.className = "habit-card";
    card.innerHTML = `
      <div class="card-head">
        <h3>${escapeHtml(habit.name)}</h3>
        <small class="category">${escapeHtml(habit.category || "")}</small>
      </div>

      <div class="card-body">
        <p><strong>Frequency:</strong> ${escapeHtml(habit.frequency || "")}</p>
        <p><strong>Start:</strong> ${escapeHtml(habit.createdAt || "")}</p>
        <p><strong>Streak:</strong> ${Array.isArray(habit.completed) ? habit.completed.length : 0} days</p>
      </div>

      <div class="card-actions">
        <button class="details-btn" data-id="${habit.id}" aria-label="View details for ${escapeHtml(habit.name)}">Details</button>
        <button class="change-date-btn" data-id="${habit.id}" aria-label="Change start date for ${escapeHtml(habit.name)}">Change Start</button>
        <input type="date" class="date-input" data-id="${habit.id}" style="display:none;">
      </div>
    `;

    container.appendChild(card);
  });
}

export function renderHabitDetails(habit, container) {
  const completedList = (habit.completed && habit.completed.length > 0)
    ? habit.completed.map(date => `<li>${escapeHtml(date)}</li>`).join("")
    : "<li>No completed days yet.</li>";

  container.innerHTML = `
    <section class="habit-details">
      <h2>${escapeHtml(habit.name)}</h2>

      <p><strong>Category:</strong> ${escapeHtml(habit.category || "")}</p>
      <p><strong>Frequency:</strong> ${escapeHtml(habit.frequency || "")}</p>
      <p><strong>Start:</strong> ${escapeHtml(habit.createdAt || "")}</p>
      <p><strong>Streak:</strong> ${habit.completed ? habit.completed.length : 0} days</p>

      <h3>Completion History</h3>
      <ul class="completion-history">
        ${completedList}
      </ul>

      <p><strong>Notes:</strong> ${escapeHtml(habit.notes || "No notes")}</p>

      <div class="details-actions">
        <button id="markComplete">Mark Complete</button>
        <button id="backToHome">Back</button>
      </div>
    </section>
  `;
}


// small helper to avoid HTML injection when rendering user-supplied values
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str).replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}
