const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="empty-message">Nenhuma tarefa adicionada ainda.</p>`;
    return;
  }

  tasks.forEach((task, index) => {
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
      <button class="delete-btn" data-index="${index}">Excluir</button>
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
    completed: false
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

  if (event.target.classList.contains("toggle-task")) {
    tasks[index].completed = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

renderTasks();