import { subscribeSeries, ensureSeriesDefaults } from "./shared.js";

const ids = {
  player1Name: document.getElementById("player1Name"),
  player2Name: document.getElementById("player2Name"),
  player1Avatar: document.getElementById("player1Avatar"),
  player2Avatar: document.getElementById("player2Avatar"),
  p1Shell: document.getElementById("p1Shell"),
  p2Shell: document.getElementById("p2Shell"),
  game1Icon: document.getElementById("game1Icon"),
  game2Icon: document.getElementById("game2Icon"),
  game3Icon: document.getElementById("game3Icon"),
  winnerBanner: document.getElementById("winnerBanner"),
  winnerPfp: document.getElementById("winnerPfp"),
  winnerText: document.getElementById("winnerText"),
  confetti: document.getElementById("confetti"),
};

let lastWinnerAnimId = null;
let prevState = {};

function setResult(cell, state, animate) {
  cell.className = "result-cell";
  if (state === "win") {
    cell.classList.add("win");
    cell.textContent = "✓";
  } else if (state === "loss") {
    cell.classList.add("loss");
    cell.textContent = "✕";
  } else {
    cell.classList.add("empty");
    cell.textContent = "·";
  }
  if (animate) {
    cell.classList.add("animate");
    setTimeout(() => cell.classList.remove("animate"), 430);
  }
}

function applyWinnerState(data) {
  const p1Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player1").length;
  const p2Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player2").length;
  ids.p1Shell.classList.toggle("winner", p1Wins > p2Wins && p1Wins >= 2);
  ids.p2Shell.classList.toggle("winner", p2Wins > p1Wins && p2Wins >= 2);
}

function playWinnerAnimation(data, payload) {
  const winner = payload?.winner === "player2" ? "player2" : "player1";
  const name = winner === "player1" ? data.player1Name : data.player2Name;
  const avatar = winner === "player1" ? data.player1Avatar : data.player2Avatar;

  ids.winnerPfp.src = avatar;
  ids.winnerText.textContent = `${name} Winner`;
  ids.winnerBanner.classList.remove("show");
  void ids.winnerBanner.offsetWidth;
  ids.winnerBanner.classList.add("show");

  ids.confetti.innerHTML = "";
  const colors = ["#45f08f","#ff5f7f","#7dc6ff","#ffd86b","#ffffff"];
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${8 + Math.random()*84}%`;
    piece.style.top = `${-10 - Math.random()*50}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random()*0.18}s`;
    piece.style.transform = `rotate(${Math.random()*140}deg)`;
    ids.confetti.appendChild(piece);
  }
  ids.confetti.classList.remove("play");
  void ids.confetti.offsetWidth;
  ids.confetti.classList.add("play");
  setTimeout(() => ids.confetti.classList.remove("play"), 1350);
}

function render(data) {
  ids.player1Name.textContent = data.player1Name || "Marlon";
  ids.player2Name.textContent = data.player2Name || "Max";
  ids.player1Avatar.src = data.player1Avatar || "assets/player-placeholder.png";
  ids.player2Avatar.src = data.player2Avatar || "assets/player-placeholder.png";
  ids.game1Icon.src = data.game1Icon || "assets/icons/misc.png";
  ids.game2Icon.src = data.game2Icon || "assets/icons/misc.png";
  ids.game3Icon.src = data.game3Icon || "assets/icons/misc.png";

  const mappings = [
    ["g1p1","g1p2","game1Winner"],
    ["g2p1","g2p2","game2Winner"],
    ["g3p1","g3p2","game3Winner"],
  ];

  mappings.forEach(([p1id, p2id, key]) => {
    const prev = prevState[key];
    const cur = data[key] || "";
    const animate = data.animationsEnabled !== false && prev !== undefined && prev !== cur;
    setResult(document.getElementById(p1id), cur === "player1" ? "win" : cur === "player2" ? "loss" : "", animate);
    setResult(document.getElementById(p2id), cur === "player2" ? "win" : cur === "player1" ? "loss" : "", animate);
  });

  applyWinnerState(data);

  if (data.winnerAnimation?.id && data.winnerAnimation.id !== lastWinnerAnimId) {
    lastWinnerAnimId = data.winnerAnimation.id;
    if (data.animationsEnabled !== false) {
      playWinnerAnimation(data, data.winnerAnimation);
    }
  }

  prevState = {
    game1Winner: data.game1Winner || "",
    game2Winner: data.game2Winner || "",
    game3Winner: data.game3Winner || "",
  };
}

await ensureSeriesDefaults();
subscribeSeries(render);
