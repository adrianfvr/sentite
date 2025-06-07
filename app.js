const preguntas = [
  {
    texto: "😊 ¿Con qué frecuencia te has sentido motivado esta semana?",
    tipo: "opciones",
    opciones: [
      { valor: 1, texto: "Nunca 😞" },
      { valor: 2, texto: "Rara vez 😕" },
      { valor: 3, texto: "Algunas veces 😐" },
      { valor: 4, texto: "Frecuentemente 🙂" },
      { valor: 5, texto: "Siempre 😄" },
    ],
  },
  {
    texto: "😌 ¿Cómo describirías tu estado emocional general?",
    tipo: "opciones",
    opciones: [
      { valor: 1, texto: "Muy bajo 😩" },
      { valor: 2, texto: "Bajo 😟" },
      { valor: 3, texto: "Neutral 😐" },
      { valor: 4, texto: "Bien 🙂" },
      { valor: 5, texto: "Excelente 😃" },
    ],
  },
  {
    texto: "🧠 ¿Te consideras consciente de tus emociones en el día a día?",
    tipo: "opciones",
    opciones: [
      { valor: 1, texto: "Nada consciente" },
      { valor: 2, texto: "Poco consciente" },
      { valor: 3, texto: "Algo consciente" },
      { valor: 4, texto: "Bastante consciente" },
      { valor: 5, texto: "Muy consciente" },
    ],
  },
  {
    texto: "🎯 ¿Cuánto control consideras que tienes sobre tus emociones?",
    tipo: "opciones",
    opciones: [
      { valor: 1, texto: "Nada" },
      { valor: 2, texto: "Poco" },
      { valor: 3, texto: "Moderado" },
      { valor: 4, texto: "Bastante" },
      { valor: 5, texto: "Total" },
    ],
  },
  {
    texto: "🏆 ¿Qué tanto te motivan los logros personales?",
    tipo: "opciones",
    opciones: [
      { valor: 1, texto: "Nada" },
      { valor: 2, texto: "Poco" },
      { valor: 3, texto: "Moderadamente" },
      { valor: 4, texto: "Mucho" },
      { valor: 5, texto: "Muchísimo" },
    ],
  },
  {
    texto:
      "📝 Describe brevemente una situación emocional reciente y cómo la manejaste.",
    tipo: "texto-libre",
  },
  {
    texto: "💡 ¿Qué haces para manejar el estrés o emociones negativas?",
    tipo: "texto-libre",
  },
];

const app = document.getElementById("app");
const respuestas = [];

function crearTarjetas() {
  preguntas.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    const h2 = document.createElement("h2");
    h2.textContent = `${i + 1}. ${p.texto}`;
    card.appendChild(h2);

    let input;
    if (p.tipo === "opciones") {
      input = document.createElement("select");
      input.innerHTML = `<option value="" disabled selected>Selecciona una opción</option>`;
      p.opciones.forEach((op) => {
        const opt = document.createElement("option");
        opt.value = op.valor;
        opt.textContent = op.texto;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("textarea");
      input.rows = 4;
      input.placeholder = "Escribe tu respuesta...";
    }
    card.appendChild(input);

    const nav = document.createElement("div");
    const btnAnt = document.createElement("button");
    btnAnt.textContent = "Volver";
    btnAnt.onclick = () => mostrarCard(i - 1);
    btnAnt.style.display = i > 0 ? "inline-block" : "none";

    const btnSig = document.createElement("button");
    btnSig.textContent = i === preguntas.length - 1 ? "Finalizar" : "Siguiente";
    btnSig.disabled = true;
    btnSig.onclick = () => {
      respuestas[i] =
        p.tipo === "texto-libre" ? input.value.trim() : parseInt(input.value);
      mostrarCard(i + 1);
    };

    input.addEventListener("input", () => {
      btnSig.disabled =
        p.tipo === "texto-libre" ? !input.value.trim() : !input.value;
    });

    nav.appendChild(btnAnt);
    nav.appendChild(btnSig);
    card.appendChild(nav);
    app.appendChild(card);
  });
}

function mostrarCard(i) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((c) => c.classList.remove("active", "exit"));
  if (cards[i - 1]) cards[i - 1].classList.add("exit");
  if (cards[i]) cards[i].classList.add("active");
  if (i >= preguntas.length) mostrarGrafico();
}

function mostrarGrafico() {
  const ctx = document.getElementById("grafico").getContext("2d");
  const labels = preguntas
    .map((p, i) => ({
      texto: p.texto.slice(0, 30) + "...",
      tipo: p.tipo,
      idx: i,
    }))
    .filter((p) => preguntas[p.idx].tipo === "opciones");
  const data = labels.map((l) => respuestas[l.idx]);
  const total = data.reduce((a, b) => a + b, 0);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels.map((l) => l.texto),
      datasets: [
        {
          data,
          backgroundColor: [
            "#3b82f6",
            "#60a5fa",
            "#93c5fd",
            "#bfdbfe",
            "#dbeafe",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });

  const consejo = document.getElementById("consejo");
  let mensaje = "";
  const promedio = total / data.length;
  if (promedio < 2)
    mensaje =
      "😟 Es importante que cuides tu bienestar emocional. Considera hablar con alguien de confianza.";
  else if (promedio < 3.5)
    mensaje =
      "🙂 Vas por buen camino, pero aún puedes trabajar más en tu inteligencia emocional.";
  else mensaje = "😄 ¡Excelente! Estás manejando muy bien tus emociones.";

  consejo.innerHTML = `<p>Puntaje promedio: <strong>${promedio.toFixed(
    2
  )}</strong></p><p>${mensaje}</p><button onclick="location.reload()">Reiniciar</button>`;
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("theme-toggle").textContent =
    document.body.classList.contains("dark") ? "Modo Claro" : "Modo Oscuro";
});

crearTarjetas();
mostrarCard(0);
