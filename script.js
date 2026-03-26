const clock = document.getElementById("clock");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let filtroAtual = "todas";

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarProgresso() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;

  progressText.textContent = `${concluidas} de ${total} tarefas concluídas`;

  let porcentagem = 0;

  if (total > 0) {
    porcentagem = (concluidas / total) * 100;
  }

  progressFill.style.width = `${porcentagem}%`;
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

  let tarefasFiltradas = tarefas;

  if (filtroAtual === "pendentes") {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  }

  if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  tarefasFiltradas.forEach(function(tarefa) {
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

  atualizarProgresso();
}

renderizarTarefas();

filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    filtroAtual = button.dataset.filter;

    renderizarTarefas();
  });
});