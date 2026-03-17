import { dbRef, onValue } from "./shared.js";
import { defaultSeriesState } from "./config.js";
import { computeSeriesWinner } from "./shared.js";

const els = {
  player1Name: document.getElementById("player1Name"),
  player2Name: document.getElementById("player2Name"),
  player1Avatar: document.getElementById("player1Avatar"),
  player2Avatar: document.getElementById("player2Avatar"),
  game1Label: document.getElementById("game1Label"),
  game2Label: document.getElementById("game2Label"),
  game3Label: document.getElementById("game3Label"),
  game1Icon: document.getElementById("game1Icon"),
  game2Icon: document.getElementById("game2Icon"),
  game3Icon: document.getElementById("game3Icon"),
  winnerBanner: document.getElementById("winnerBanner"),
  winnerMiniAvatar: document.getElementById("winnerMiniAvatar"),
  winnerMiniName: document.getElementById("winnerMiniName"),
  confettiLayer: document.getElementById("confettiLayer"),
  marks: {
    p1g1: document.getElementById("p1g1"),
    p1g2: document.getElementById("p1g2"),
    p1g3: document.getElementById("p1g3"),
    p2g1: document.getElementById("p2g1"),
    p2g2: document.getElementById("p2g2"),
    p2g3: document.getElementById("p2g3")
  }
};

let lastData = null;
let lastWinnerAnim = null;

function setMark(el, state, animate) {
  el.className = "mark";
  if (state === "win") {
    el.textContent = "✓";
    el.classList.add("win");
  } else if (state === "loss") {
    el.textContent = "✕";
    el.classList.add("loss");
  } else {
    el.textContent = "•";
    el.classList.add("pending");
  }
  if (animate) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }
}

function applyGame(gameNum, winner, animate) {
  const p1 = els.marks[`p1g${gameNum}`];
  const p2 = els.marks[`p2g${gameNum}`];
  if (winner === "player1") {
    setMark(p1, "win", animate);
    setMark(p2, "loss", animate);
  } else if (winner === "player2") {
    setMark(p1, "loss", animate);
    setMark(p2, "win", animate);
  } else {
    setMark(p1, "pending", false);
    setMark(p2, "pending", false);
  }
}

function triggerConfetti() {
  els.confettiLayer.innerHTML = "";
  const colors = ["#43da7e", "#ff5a74", "#ffffff", "#2e6cff", "#ffd66b"];
  for (let i = 0; i < 22; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti show";
    piece.style.left = `${12 + Math.random() * 76}%`;
    piece.style.top = `${Math.random() * 18}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.transform = `translateY(0) rotate(${Math.random() * 120}deg)`;
    piece.style.animationDelay = `${Math.random() * 120}ms`;
    piece.style.animationDuration = `${1100 + Math.random() * 600}ms`;
    els.confettiLayer.appendChild(piece);
  }
  setTimeout(() => { els.confettiLayer.innerHTML = ""; }, 1800);
}

function showWinnerBanner(data, side) {
  const isP1 = side === "player1";
  const name = isP1 ? data.player1Name : data.player2Name;
  const avatar = isP1 ? data.player1Avatar : data.player2Avatar;
  els.winnerMiniName.textContent = name;
  els.winnerMiniAvatar.style.backgroundImage = `url("${avatar}")`;
  els.winnerBanner.classList.remove("show");
  void els.winnerBanner.offsetWidth;
  els.winnerBanner.classList.add("show");
  document.getElementById(isP1 ? "player1Avatar" : "player2Avatar").classList.add("winner");
  document.getElementById(isP1 ? "player2Avatar" : "player1Avatar").classList.remove("winner");
  if (data.confettiEnabled !== false) triggerConfetti();
}

function applyData(raw) {
  const data = { ...defaultSeriesState, ...raw };
  els.player1Name.textContent = data.player1Name;
  els.player2Name.textContent = data.player2Name;
  els.player1Avatar.style.backgroundImage = `url("${data.player1Avatar}")`;
  els.player2Avatar.style.backgroundImage = `url("${data.player2Avatar}")`;
  els.game1Label.textContent = data.game1Label;
  els.game2Label.textContent = data.game2Label;
  els.game3Label.textContent = data.game3Label;
  els.game1Icon.textContent = data.game1Icon || "🎯";
  els.game2Icon.textContent = data.game2Icon || "🚌";
  els.game3Icon.textContent = data.game3Icon || "🚗";

  const animate = !!lastData && data.animationsEnabled !== false;
  applyGame(1, data.game1Winner, animate && data.game1Winner !== lastData.game1Winner);
  applyGame(2, data.game2Winner, animate && data.game2Winner !== lastData.game2Winner);
  applyGame(3, data.game3Winner, animate && data.game3Winner !== lastData.game3Winner);

  const seriesWinner = computeSeriesWinner(data);
  document.getElementById("player1Avatar").classList.toggle("winner", seriesWinner === "player1" && data.winnerBadgeVisible !== false);
  document.getElementById("player2Avatar").classList.toggle("winner", seriesWinner === "player2" && data.winnerBadgeVisible !== false);

  if (data.winnerAnimation && data.winnerAnimation.id && data.winnerAnimation.id !== lastWinnerAnim) {
    lastWinnerAnim = data.winnerAnimation.id;
    showWinnerBanner(data, data.winnerAnimation.winner || seriesWinner || "player1");
  }

  lastData = data;
}

onValue(dbRef, (snap) => {
  if (!snap.exists()) {
    applyData(defaultSeriesState);
    return;
  }
  applyData(snap.val());
});
