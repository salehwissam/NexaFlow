const clock = document.getElementById("clock");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

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

  const li = document.createElement("li");
  li.textContent = textoDaTarefa;

  taskList.appendChild(li);

  taskInput.value = "";
}

addTaskBtn.addEventListener("click", adicionarTarefa);