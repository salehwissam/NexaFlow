const clock = document.getElementById("clock");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}


function atualizarRelogio() {
  const agora = new Date();

  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");
  const segundos = String(agora.getSeconds()).padStart(2, "0");

  clock.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarRelogio, 1000);

atualizarRelogio();

function adicionarTarefa() {
  const textoDaTarefa = taskInput.value.trim();

  if (textoDaTarefa === "") {
    alert("Digite uma tarefa.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto: textoDaTarefa,
    concluida: false
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  renderizarTarefas();

  taskInput.value = "";
}

addTaskBtn.addEventListener("click", adicionarTarefa);

taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    adicionarTarefa();
  }
});

function renderizarTarefas() {
  taskList.innerHTML = "";

  tarefas.forEach(function(tarefa) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
      li.classList.add("completed");
    }

    span.addEventListener("click", function() {
      tarefa.concluida = !tarefa.concluida;
      salvarTarefas();
      renderizarTarefas();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";

    deleteBtn.addEventListener("click", function(event) {
      event.stopPropagation();

      tarefas = tarefas.filter(function(item) {
        return item.id !== tarefa.id;
      });

      salvarTarefas();
      renderizarTarefas();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

renderizarTarefas();