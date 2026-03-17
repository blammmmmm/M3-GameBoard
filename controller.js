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
  saveSetup: document.getElementById("saveSetup"),
  manualWinnerP1: document.getElementById("manualWinnerP1"),
  manualWinnerP2: document.getElementById("manualWinnerP2"),
  toggleAnimations: document.getElementById("toggleAnimations"),
  resetAll: document.getElementById("resetAll"),
  status: document.getElementById("status"),
};

let currentData = null;

function setStatus(text) {
  els.status.textContent = text;
}

function fillSelect(select, optionsMap) {
  select.innerHTML = "";
  for (const [label, value] of Object.entries(optionsMap)) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    select.appendChild(opt);
  }
}

function ensureCurrentValue(select, value, fallbackLabel = "Current") {
  if (!value) return;
  const exists = Array.from(select.options).some(opt => opt.value === value);
  if (!exists) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${fallbackLabel} (${value.split("/").pop()})`;
    select.prepend(opt);
  }
}

function countWins(data) {
  const p1Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player1").length;
  const p2Wins = ["game1Winner","game2Winner","game3Winner"].filter(k => data[k] === "player2").length;
  return { p1Wins, p2Wins };
}

async function triggerWinner(winner) {
  await updateSeries({ winnerAnimation: { id: Date.now(), winner } });
}

async function maybeAutoWinner(nextData) {
  const { p1Wins, p2Wins } = countWins(nextData);
  if (p1Wins >= 2) await triggerWinner("player1");
  else if (p2Wins >= 2) await triggerWinner("player2");
}

fillSelect(els.player1Avatar, avatarOptions);
fillSelect(els.player2Avatar, avatarOptions);
fillSelect(els.game1Icon, iconOptions);
fillSelect(els.game2Icon, iconOptions);
fillSelect(els.game3Icon, iconOptions);

await ensureSeriesDefaults();

subscribeSeries((data) => {
  currentData = data;

  ensureCurrentValue(els.player1Avatar, data.player1Avatar, "Saved avatar");
  ensureCurrentValue(els.player2Avatar, data.player2Avatar, "Saved avatar");
  ensureCurrentValue(els.game1Icon, data.game1Icon, "Saved icon");
  ensureCurrentValue(els.game2Icon, data.game2Icon, "Saved icon");
  ensureCurrentValue(els.game3Icon, data.game3Icon, "Saved icon");

  els.player1Name.value = data.player1Name || "";
  els.player2Name.value = data.player2Name || "";
  els.player1Avatar.value = data.player1Avatar || defaultSeriesData.player1Avatar;
  els.player2Avatar.value = data.player2Avatar || defaultSeriesData.player2Avatar;
  els.game1Icon.value = data.game1Icon || defaultSeriesData.game1Icon;
  els.game2Icon.value = data.game2Icon || defaultSeriesData.game2Icon;
  els.game3Icon.value = data.game3Icon || defaultSeriesData.game3Icon;
  els.toggleAnimations.textContent = `Animations: ${data.animationsEnabled !== false ? "ON" : "OFF"}`;
});

els.saveSetup.addEventListener("click", async () => {
  await updateSeries({
    player1Name: els.player1Name.value.trim() || "Marlon",
    player2Name: els.player2Name.value.trim() || "Max",
    player1Avatar: els.player1Avatar.value,
    player2Avatar: els.player2Avatar.value,
    game1Icon: els.game1Icon.value,
    game2Icon: els.game2Icon.value,
    game3Icon: els.game3Icon.value,
  });
  setStatus("Saved names, avatars, and icons.");
});

document.querySelectorAll("[data-game][data-winner]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const game = btn.dataset.game;
    const winner = btn.dataset.winner;
    const patch = { [`game${game}Winner`]: winner };
    await updateSeries(patch);
    await maybeAutoWinner({ ...currentData, ...patch });
    setStatus(`Marked Game ${game}.`);
  });
});

document.querySelectorAll("[data-clear]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const game = btn.dataset.clear;
    await updateSeries({ [`game${game}Winner`]: "" });
    setStatus(`Cleared Game ${game}.`);
  });
});

els.manualWinnerP1.addEventListener("click", async () => {
  await triggerWinner("player1");
  setStatus("Triggered winner for Player 1.");
});

els.manualWinnerP2.addEventListener("click", async () => {
  await triggerWinner("player2");
  setStatus("Triggered winner for Player 2.");
});

els.toggleAnimations.addEventListener("click", async () => {
  const enabled = currentData?.animationsEnabled !== false;
  await updateSeries({ animationsEnabled: !enabled });
  setStatus(`Animations ${!enabled ? "on" : "off"}.`);
});

els.resetAll.addEventListener("click", async () => {
  await resetSeries({
    player1Name: els.player1Name.value.trim() || "Marlon",
    player2Name: els.player2Name.value.trim() || "Max",
    player1Avatar: els.player1Avatar.value || currentData?.player1Avatar || defaultSeriesData.player1Avatar,
    player2Avatar: els.player2Avatar.value || currentData?.player2Avatar || defaultSeriesData.player2Avatar,
    game1Icon: els.game1Icon.value || currentData?.game1Icon || defaultSeriesData.game1Icon,
    game2Icon: els.game2Icon.value || currentData?.game2Icon || defaultSeriesData.game2Icon,
    game3Icon: els.game3Icon.value || currentData?.game3Icon || defaultSeriesData.game3Icon,
  });
  setStatus("Reset all games.");
});
