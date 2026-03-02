const list = document.getElementById("list");
const addTaskForm = document.getElementById("addTask");
const input = addTaskForm.querySelector("input");
const addButton = addTaskForm.querySelector("button");

const API_URL = "http://localhost:3008/tasks";

// 🔹 Carica le task dal server
async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    list.innerHTML = ""; // pulisco prima di ricostruire

    tasks.forEach((task) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const span = document.createElement("span");
      span.textContent = task.title;
      span.classList.add("task-text");

      if (task.completed) {
        span.classList.add("completed");
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("btn", "btn-danger");

      // 🔹 DELETE
      deleteBtn.addEventListener("click", async () => {
        try {
          await fetch(`${API_URL}/${task.id}`, {
            method: "DELETE",
          });

          loadTasks(); // ricarico lista aggiornata
        } catch (error) {
          console.error("Errore nella delete:", error);
        }
      });

      // 🔹 Toggle completed (opzionale ma intelligente)
      checkbox.addEventListener("change", async () => {
        try {
          await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: checkbox.checked,
            }),
          });

          loadTasks();
        } catch (error) {
          console.error("Errore aggiornamento stato:", error);
        }
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });
  } catch (error) {
    console.error("Errore nel caricamento tasks:", error);
  }
}

// 🔹 Aggiunta nuova task
addTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita il refresh della pagina

  const title = input.value.trim();
  if (!title) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    });

    input.value = "";
    loadTasks();
  } catch (error) {
    console.error("Errore nella creazione task:", error);
  }
});

// 🔹 Carico all'avvio
loadTasks();
