const clock = document.getElementById("clock");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const notesArea = document.getElementById("notesArea");
const pomodoroTimer = document.getElementById("pomodoroTimer");
const startPomodoro = document.getElementById("startPomodoro");
const pausePomodoro = document.getElementById("pausePomodoro");
const resetPomodoro = document.getElementById("resetPomodoro");
const temaBtn = document.getElementById("themeToggle");
const pomodoroStatus = document.getElementById("pomodoroStatus");
const pomodoroCycles = document.getElementById("pomodoroCycles");
const modeButtons = document.querySelectorAll(".mode-btn");

let modoAtual = "foco";
let tempoRestante = 25 * 60;
let intervaloPomodoro = null;
let ciclosConcluidos = 0;

const temposPomodoro = {
  foco: 25 * 60,
  curto: 5 * 60,
  longo: 15 * 60
};

let filtroAtual = "todas";

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let metas = JSON.parse(localStorage.getItem("metas")) || [];
let notas = localStorage.getItem("notas") || "";
let temaSalvo = localStorage.getItem("tema") || "claro";

if (temaSalvo === "escuro") {
  document.body.classList.add("dark-mode");
  temaBtn.textContent = "☀️";
} else {
  temaBtn.textContent = "🌙";
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function salvarMetas() {
  localStorage.setItem("metas", JSON.stringify(metas));
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

notesArea.value = notas;

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

function adicionarMeta() {
  const textoDaMeta = goalInput.value.trim();

  if (textoDaMeta === "") {
    alert("Digite uma meta.");
    return;
  }

  const novaMeta = {
    id: Date.now(),
    texto: textoDaMeta,
    concluida: false
  };

  metas.push(novaMeta);
  salvarMetas();
  renderizarMetas();

  goalInput.value = "";
}

addGoalBtn.addEventListener("click", adicionarMeta);

goalInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    adicionarMeta();
  }
});

function renderizarMetas() {
  goalList.innerHTML = "";

  metas.forEach(function(meta) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = meta.texto;

    if (meta.concluida) {
      li.classList.add("completed");
    }

    span.addEventListener("click", function() {
      meta.concluida = !meta.concluida;
      salvarMetas();
      renderizarMetas();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";

    deleteBtn.addEventListener("click", function(event) {
      event.stopPropagation();

      metas = metas.filter(function(item) {
        return item.id !== meta.id;
      });

      salvarMetas();
      renderizarMetas();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    goalList.appendChild(li);
  });
}

renderizarMetas();

notesArea.addEventListener("input", function() {
  localStorage.setItem("notas", notesArea.value);
});

function atualizarPomodoro() {
  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;

  pomodoroTimer.textContent =
    `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function iniciarPomodoro() {
  if (intervaloPomodoro !== null) return;

  intervaloPomodoro = setInterval(function() {
    if (tempoRestante > 0) {
      tempoRestante--;
      atualizarPomodoro();
    } else {
      clearInterval(intervaloPomodoro);
      intervaloPomodoro = null;

      if (modoAtual === "foco") {
        ciclosConcluidos++;
        pomodoroCycles.textContent = `Ciclos concluídos: ${ciclosConcluidos}`;

        if (ciclosConcluidos % 4 === 0) {
          definirModoPomodoro("longo");
        } else {
          definirModoPomodoro("curto");
        }
      } else {
        definirModoPomodoro("foco");
      }
    }
  }, 1000);
}

startPomodoro.addEventListener("click", iniciarPomodoro);

atualizarPomodoro();
pomodoroCycles.textContent = `Ciclos concluídos: ${ciclosConcluidos}`;
definirModoPomodoro("foco");

function pausarPomodoro() {
  clearInterval(intervaloPomodoro);
  intervaloPomodoro = null;
}

function resetarPomodoro() {
  clearInterval(intervaloPomodoro);
  intervaloPomodoro = null;
  tempoRestante = temposPomodoro[modoAtual];
  atualizarPomodoro();
}

pausePomodoro.addEventListener("click", pausarPomodoro);
resetPomodoro.addEventListener("click", resetarPomodoro);

temaBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("tema", "escuro");
    temaBtn.textContent = "☀️";
  } else {
    localStorage.setItem("tema", "claro");
    temaBtn.textContent = "🌙";
  }
});

function definirModoPomodoro(modo) {
  modoAtual = modo;
  tempoRestante = temposPomodoro[modo];
  atualizarPomodoro();

  if (modo === "foco") {
    pomodoroStatus.textContent = "Modo atual: Foco";
  }

  if (modo === "curto") {
    pomodoroStatus.textContent = "Modo atual: Pausa curta";
  }

  if (modo === "longo") {
    pomodoroStatus.textContent = "Modo atual: Pausa longa";
  }

  modeButtons.forEach(function(button) {
    button.classList.remove("active");

    if (button.dataset.mode === modo) {
      button.classList.add("active");
    }
  });
}

modeButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    clearInterval(intervaloPomodoro);
    intervaloPomodoro = null;

    definirModoPomodoro(button.dataset.mode);
  });
});