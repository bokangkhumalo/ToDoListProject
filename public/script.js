document
  .getElementById("new-task")
  .addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
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
    }
  });

// Load and display tasks from the server
async function loadTasks() {
  const response = await fetch("/tasks");
  const tasks = await response.json();
  tasks.forEach(displayTask); // Render all tasks
}

// Function to display a task in the list
function displayTask(task) {
  const listId = task.completed ? "completed-list" : "todo-list";
  const taskList = document.getElementById(listId);
  const listItem = document.createElement("li");
  listItem.dataset.id = task.id;

  // Create checkbox for task completion
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", async () => {
    await updateTaskStatus(task.id, checkbox.checked);
    // Move task to the other list
    taskList.removeChild(listItem);
    task.completed = checkbox.checked;
    displayTask(task);
  });

  const taskText = document.createElement("span");
  taskText.textContent = task.text;

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  deleteButton.addEventListener("click", async () => {
    await deleteTask(task.id);
    taskList.removeChild(listItem);
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(taskText);
  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);
}

// Add this new function to handle task status updates
async function updateTaskStatus(id, completed) {
  const response = await fetch(`/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    console.error("Failed to update task status");
  }
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
