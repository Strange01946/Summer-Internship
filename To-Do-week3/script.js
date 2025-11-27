const inputBox = document.getElementById("input-box");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const searchInput = document.getElementById("search");
const filterPriority = document.getElementById("filter-priority");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  listContainer.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();
  const selectedPriority = filterPriority.value;

  tasks.forEach((task, index) => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    if (matchesSearch && matchesPriority) {
      const li = document.createElement("li");
      li.setAttribute("data-priority", task.priority);
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <label>
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span>${task.text}</span>
        </label>
        <div class="meta">
          📅 ${task.dueDate || "No due date"} | 🏷 ${task.category || "None"}
        </div>
        <div class="task-actions">
          <button class="complete-btn">✔</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      const checkbox = li.querySelector("input");
      const completeBtn = li.querySelector(".complete-btn");
      const editBtn = li.querySelector(".edit-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      completeBtn.addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

      editBtn.addEventListener("click", () => {
        const newText = prompt("Edit task:", task.text);
        if (newText !== null) {
          task.text = newText.trim();
          task.completed = false;
          saveTasks();
          renderTasks();
        }
      });

      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }
      });

      listContainer.appendChild(li);
    }
  });

  updateCounters();
}

function updateCounters() {
  const completed = tasks.filter(task => task.completed).length;
  const uncompleted = tasks.length - completed;
  completedCounter.textContent = completed;
  uncompletedCounter.textContent = uncompleted;
}

function addTask() {
  const text = inputBox.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    text,
    dueDate,
    priority,
    category,
    completed: false,
  });

  inputBox.value = "";
  dueDateInput.value = "";
  categoryInput.value = "";

  saveTasks();
  renderTasks();
}

function filterTasks() {
  renderTasks();
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

// Enter key adds task
inputBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Init
loadTheme();
renderTasks();
