function setEmotion(value) {
  const input = document.getElementById("emotion");
  input.value = value;
  getQuotes();
}



// function saveHistory(emotion) {
//   const data = JSON.parse(localStorage.getItem("history") || "[]");

//   data.push({
//     emotion,
//     date: new Date().toISOString()
//   });

//   localStorage.setItem("history", JSON.stringify(data));
// }

// function renderHistory() {
//   const history = JSON.parse(localStorage.getItem("history") || "[]");
//   const list = document.getElementById("history");
//   list.innerHTML = "";

//   history.sort((a,b) => new Date(b.date) - new Date(a.date));

//   history.forEach(h => {
//     const li = document.createElement("li");
//     li.innerText = `${h.emotion} — ${new Date(h.date).toLocaleString()}`;
//     list.appendChild(li);
//   });
// }

// function renderStats() {
//   const history = JSON.parse(localStorage.getItem("history") || "[]");
//   const today = new Date().toDateString();

//   const count = {};

//   history.forEach(h => {
//     if (new Date(h.date).toDateString() === today) {
//       count[h.emotion] = (count[h.emotion] || 0) + 1;
//     }
//   });

//   const stats = document.getElementById("stats");
//   stats.innerHTML = "";

//   for (let e in count) {
//     const li = document.createElement("li");
//     li.innerText = `${e} : ${count[e]}`;
//     stats.appendChild(li);
//   }
// }

async function saveHistory(emotion) {
  await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emotion })
  });
}

async function renderHistory() {
  const res = await fetch("/api/history");
  const history = await res.json();

  const list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = `${h.emotion} — ${new Date(h.date).toLocaleString()}`;
    list.appendChild(li);
  });
}

async function renderStats() {
  const res = await fetch("/api/history");
  const history = await res.json();

  const count = {};
  const today = new Date().toDateString();

  history.forEach(h => {
    if (new Date(h.date).toDateString() === today) {
      count[h.emotion] = (count[h.emotion] || 0) + 1;
    }
  });

  const stats = document.getElementById("stats");
  stats.innerHTML = "";

  for (let e in count) {
    const li = document.createElement("li");
    li.innerText = `${e} : ${count[e]}`;
    stats.appendChild(li);
  }
}


async function getQuotes() {
  const emotion = document.getElementById("emotion").value.trim();
  if (!emotion) return;

  const res = await fetch(`/api/quotes?emotion=${encodeURIComponent(emotion)}`);
  const data = await res.json();

  const list = document.getElementById("result");
  list.innerHTML = "";

  data.forEach(q => {
    const li = document.createElement("li");
    li.innerText = `"${q.quote}" — ${q.author}`;
    list.appendChild(li);
  });

  await saveHistory(emotion);
  await renderHistory();
  await renderStats();
}

function toggleHistory() {
  const panel = document.getElementById("historyPanel");
  panel.style.display = panel.style.display === "none" || panel.style.display === ""
    ? "block"
    : "none";
}




renderHistory();
renderStats();
