document
  .getElementById("add-task")
  .addEventListener("click", async function () {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    if (taskText) {
      const task = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      };

      // Send the task to the server
      const response = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const newTask = await response.json();
        displayTask(newTask); // Function to render the task in the list
        taskInput.value = "";
      }
    }
  });

async function loadTasks() {
  const response = await fetch("/tasks");
  const tasks = await response.json();
  tasks.forEach(displayTask); // Render all tasks
}

function displayTask(task) {
  const taskList = document.getElementById("task-list");
  const listItem = document.createElement("li");
  listItem.textContent = task.text;
  taskList.appendChild(listItem);
}

loadTasks();
