import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig, DB_PATH, defaultSeriesState } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, DB_PATH);

export { db, dbRef, get, set, update, onValue, ref };

export async function ensureDefaultState() {
  const snap = await get(dbRef);
  if (!snap.exists()) {
    await set(dbRef, defaultSeriesState);
    return { ...defaultSeriesState };
  }
  const data = snap.val() || {};
  const merged = { ...defaultSeriesState, ...data };
  await set(dbRef, merged);
  return merged;
}

export function computeSeriesWinner(data) {
  const winners = [data.game1Winner, data.game2Winner, data.game3Winner];
  const p1 = winners.filter(v => v === "player1").length;
  const p2 = winners.filter(v => v === "player2").length;
  if (p1 >= 2) return "player1";
  if (p2 >= 2) return "player2";
  return "";
}

export function nextAnimation(side, avatar, name) {
  return {
    id: Date.now(),
    winner: side,
    avatar,
    name
  };
}
