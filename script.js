const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskInfo = document.getElementById("task-info");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const completedTasks = tasks.filter((task) => task.completed).length;
  taskInfo.textContent = `Total: ${tasks.length} | Concluídas: ${completedTasks}`;

  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="empty-message">Nenhuma tarefa adicionada ainda.</p>`;
    return;
  }

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task);
    const li = document.createElement("li");
    li.classList.add("task-item");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="toggle-task" />
        <span class="task-text">${task.text}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-index="${index}">Editar</button>
        <button class="delete-btn" data-index="${index}">Excluir</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Por favor, digite uma tarefa.");
    return;
  }

  tasks.push({
    text: taskText,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
});

taskList.addEventListener("click", function (event) {
  const index = event.target.dataset.index;

  if (event.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  if (event.target.classList.contains("edit-btn")) {
    const newTaskText = prompt("Editar tarefa:", tasks[index].text);

    if (newTaskText !== null && newTaskText.trim() !== "") {
      tasks[index].text = newTaskText.trim();
      saveTasks();
      renderTasks();
    }
  }

  if (event.target.classList.contains("toggle-task")) {
    tasks[index].completed = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    renderTasks();
  });
});

renderTasks();
