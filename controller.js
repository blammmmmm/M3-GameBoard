import { avatarOptions, defaultSeriesState } from "./config.js";
import { dbRef, ensureDefaultState, update, set } from "./shared.js";
import { computeSeriesWinner, nextAnimation } from "./shared.js";

const formIds = [
  "player1Name","player2Name","player1Avatar","player2Avatar",
  "player1Color","player1ColorDark","player2Color","player2ColorDark",
  "game1Label","game2Label","game3Label","game1Icon","game2Icon","game3Icon",
  "animationsEnabled","autoWinnerEnabled","confettiEnabled","winnerBadgeVisible"
];

const els = Object.fromEntries(formIds.map(id => [id, document.getElementById(id)]));
const saveNote = document.getElementById("saveNote");
let state = null;

function setNote(text) {
  saveNote.textContent = text;
  setTimeout(() => { if (saveNote.textContent === text) saveNote.textContent = ""; }, 1600);
}

function fillAvatarSelect(el, value) {
  el.innerHTML = "";
  avatarOptions.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    el.appendChild(option);
  });
  if (![...el.options].some(o => o.value === value)) {
    const extra = document.createElement("option");
    extra.value = value;
    extra.textContent = value;
    el.appendChild(extra);
  }
  el.value = value;
}

function applyToForm(data) {
  state = { ...defaultSeriesState, ...data };
  els.player1Name.value = state.player1Name;
  els.player2Name.value = state.player2Name;
  fillAvatarSelect(els.player1Avatar, state.player1Avatar);
  fillAvatarSelect(els.player2Avatar, state.player2Avatar);
  els.player1Color.value = state.player1Color;
  els.player1ColorDark.value = state.player1ColorDark;
  els.player2Color.value = state.player2Color;
  els.player2ColorDark.value = state.player2ColorDark;
  els.game1Label.value = state.game1Label;
  els.game2Label.value = state.game2Label;
  els.game3Label.value = state.game3Label;
  els.game1Icon.value = state.game1Icon;
  els.game2Icon.value = state.game2Icon;
  els.game3Icon.value = state.game3Icon;
  els.animationsEnabled.checked = !!state.animationsEnabled;
  els.autoWinnerEnabled.checked = !!state.autoWinnerEnabled;
  els.confettiEnabled.checked = !!state.confettiEnabled;
  els.winnerBadgeVisible.checked = state.winnerBadgeVisible !== false;
}

async function saveFields() {
  const patch = {
    player1Name: els.player1Name.value.trim() || "Player 1",
    player2Name: els.player2Name.value.trim() || "Player 2",
    player1Avatar: els.player1Avatar.value,
    player2Avatar: els.player2Avatar.value,
    player1Color: els.player1Color.value,
    player1ColorDark: els.player1ColorDark.value,
    player2Color: els.player2Color.value,
    player2ColorDark: els.player2ColorDark.value,
    game1Label: els.game1Label.value.trim() || "G1",
    game2Label: els.game2Label.value.trim() || "G2",
    game3Label: els.game3Label.value.trim() || "G3",
    game1Icon: els.game1Icon.value || "🎯",
    game2Icon: els.game2Icon.value || "🚌",
    game3Icon: els.game3Icon.value || "🚗",
    animationsEnabled: els.animationsEnabled.checked,
    autoWinnerEnabled: els.autoWinnerEnabled.checked,
    confettiEnabled: els.confettiEnabled.checked,
    winnerBadgeVisible: els.winnerBadgeVisible.checked
  };
  state = { ...state, ...patch };
  await update(dbRef, patch);
  setNote("Saved");
}

async function setGameWinner(gameNum, winner) {
  const key = `game${gameNum}Winner`;
  const patch = { [key]: winner };
  const next = { ...state, ...patch };
  if (next.autoWinnerEnabled) {
    const seriesWinner = computeSeriesWinner(next);
    if (seriesWinner) {
      patch.winnerAnimation = nextAnimation(
        seriesWinner,
        seriesWinner === "player1" ? next.player1Avatar : next.player2Avatar,
        seriesWinner === "player1" ? next.player1Name : next.player2Name
      );
    }
  }
  state = { ...state, ...patch };
  await update(dbRef, patch);
  setNote(`Game ${gameNum} updated`);
}

async function triggerWinner(winner) {
  const patch = {
    winnerAnimation: nextAnimation(
      winner,
      winner === "player1" ? state.player1Avatar : state.player2Avatar,
      winner === "player1" ? state.player1Name : state.player2Name
    )
  };
  state = { ...state, ...patch };
  await update(dbRef, patch);
  setNote("Winner triggered");
}

async function resetSeries() {
  const patch = { game1Winner: "", game2Winner: "", game3Winner: "", winnerAnimation: null };
  state = { ...state, ...patch };
  await update(dbRef, patch);
  setNote("Series reset");
}

async function resetEverything() {
  state = { ...defaultSeriesState };
  await set(dbRef, state);
  applyToForm(state);
  setNote("Everything reset");
}

for (const id of formIds) {
  const el = els[id];
  el.addEventListener(el.type === "checkbox" ? "change" : "input", () => {
    clearTimeout(el._saveTimer);
    el._saveTimer = setTimeout(saveFields, 250);
  });
}

document.querySelectorAll("[data-game]").forEach(btn => {
  btn.addEventListener("click", async () => {
    await setGameWinner(btn.dataset.game, btn.dataset.win);
  });
});

document.getElementById("triggerP1").addEventListener("click", () => triggerWinner("player1"));
document.getElementById("triggerP2").addEventListener("click", () => triggerWinner("player2"));
document.getElementById("resetSeries").addEventListener("click", resetSeries);
document.getElementById("resetEverything").addEventListener("click", resetEverything);

(async () => {
  const initial = await ensureDefaultState();
  applyToForm(initial);
})();
