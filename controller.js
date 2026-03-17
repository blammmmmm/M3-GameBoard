import { avatarOptions, iconOptions, defaultSeriesData } from "./config.js";
import { ensureSeriesDefaults, subscribeSeries, updateSeries, resetSeries } from "./shared.js";

const els = {
  player1Name: document.getElementById("player1Name"),
  player2Name: document.getElementById("player2Name"),
  player1Avatar: document.getElementById("player1Avatar"),
  player2Avatar: document.getElementById("player2Avatar"),
  game1Icon: document.getElementById("game1Icon"),
  game2Icon: document.getElementById("game2Icon"),
  game3Icon: document.getElementById("game3Icon"),
  saveNames: document.getElementById("saveNames"),
  manualWinnerP1: document.getElementById("manualWinnerP1"),
  manualWinnerP2: document.getElementById("manualWinnerP2"),
  toggleAnimations: document.getElementById("toggleAnimations"),
  resetAll: document.getElementById("resetAll"),
  status: document.getElementById("status"),
};

let currentData = null;

function fillSelect(select, optionsMap) {
  select.innerHTML = "";
  Object.entries(optionsMap).forEach(([label, value]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
}

function status(text) {
  els.status.textContent = text;
}

function triggerWinner(winner) {
  return updateSeries({
    winnerAnimation: {
      id: Date.now(),
      winner
    }
  });
}

function countWins(data) {
  const p1Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player1").length;
  const p2Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player2").length;
  return { p1Wins, p2Wins };
}

async function maybeAutoWinner(nextData) {
  const { p1Wins, p2Wins } = countWins(nextData);
  if (p1Wins >= 2) await triggerWinner("player1");
  if (p2Wins >= 2) await triggerWinner("player2");
}

fillSelect(els.player1Avatar, avatarOptions);
fillSelect(els.player2Avatar, avatarOptions);
fillSelect(els.game1Icon, iconOptions);
fillSelect(els.game2Icon, iconOptions);
fillSelect(els.game3Icon, iconOptions);

await ensureSeriesDefaults();

subscribeSeries((data) => {
  currentData = data;
  els.player1Name.value = data.player1Name || "";
  els.player2Name.value = data.player2Name || "";
  els.player1Avatar.value = data.player1Avatar || defaultSeriesData.player1Avatar;
  els.player2Avatar.value = data.player2Avatar || defaultSeriesData.player2Avatar;
  els.game1Icon.value = data.game1Icon || defaultSeriesData.game1Icon;
  els.game2Icon.value = data.game2Icon || defaultSeriesData.game2Icon;
  els.game3Icon.value = data.game3Icon || defaultSeriesData.game3Icon;
  els.toggleAnimations.textContent = `Animations: ${data.animationsEnabled !== false ? "ON" : "OFF"}`;
});

els.saveNames.addEventListener("click", async () => {
  await updateSeries({
    player1Name: els.player1Name.value.trim() || "Player 1",
    player2Name: els.player2Name.value.trim() || "Player 2",
    player1Avatar: els.player1Avatar.value,
    player2Avatar: els.player2Avatar.value,
    game1Icon: els.game1Icon.value,
    game2Icon: els.game2Icon.value,
    game3Icon: els.game3Icon.value,
  });
  status("Saved names, avatars, and game icons.");
});

document.querySelectorAll("[data-game][data-winner]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const game = btn.dataset.game;
    const winner = btn.dataset.winner;
    const patch = { [`game${game}Winner`]: winner };
    await updateSeries(patch);
    status(`Marked Game ${game}: ${winner}.`);
    const nextData = { ...currentData, ...patch };
    await maybeAutoWinner(nextData);
  });
});

document.querySelectorAll("[data-clear]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const game = btn.dataset.clear;
    await updateSeries({ [`game${game}Winner`]: "" });
    status(`Cleared Game ${game}.`);
  });
});

els.manualWinnerP1.addEventListener("click", async () => {
  await triggerWinner("player1");
  status("Triggered winner animation for Player 1.");
});

els.manualWinnerP2.addEventListener("click", async () => {
  await triggerWinner("player2");
  status("Triggered winner animation for Player 2.");
});

els.toggleAnimations.addEventListener("click", async () => {
  const enabled = currentData?.animationsEnabled !== false;
  await updateSeries({ animationsEnabled: !enabled });
  status(`Animations turned ${!enabled ? "on" : "off"}.`);
});

els.resetAll.addEventListener("click", async () => {
  await resetSeries({
    player1Avatar: els.player1Avatar.value || defaultSeriesData.player1Avatar,
    player2Avatar: els.player2Avatar.value || defaultSeriesData.player2Avatar,
    game1Icon: els.game1Icon.value || defaultSeriesData.game1Icon,
    game2Icon: els.game2Icon.value || defaultSeriesData.game2Icon,
    game3Icon: els.game3Icon.value || defaultSeriesData.game3Icon,
    player1Name: els.player1Name.value || "Marlon",
    player2Name: els.player2Name.value || "Max",
  });
  status("Reset all games.");
});
