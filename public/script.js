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

// Function to display a task in the list
function displayTask(task) {
  const taskList = document.getElementById("task-list");
  const listItem = document.createElement("li");
  listItem.textContent = task.text;
  listItem.dataset.id = task.id; // Add data-id attribute for identification

  // Create a delete button for each task
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    await deleteTask(task.id); // Call deleteTask function
    taskList.removeChild(listItem); // Remove from the DOM
  });

  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);
}

// Function to delete a task from the server
async function deleteTask(id) {
  const response = await fetch(`/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Failed to delete task with id", id);
  }
}

// Load tasks when the page loads
loadTasks();
