import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig, defaultSeriesData } from "./config.js";

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const seriesRef = ref(db, "series");

export async function ensureSeriesDefaults() {
  const snap = await get(seriesRef);
  if (!snap.exists()) {
    await set(seriesRef, defaultSeriesData);
  }
}

export async function updateSeries(patch) {
  await update(seriesRef, patch);
}

export async function resetSeries(extra = {}) {
  await set(seriesRef, { ...defaultSeriesData, ...extra, winnerAnimation: null });
}

export function subscribeSeries(callback) {
  return onValue(seriesRef, (snapshot) => {
    callback(snapshot.val() || defaultSeriesData);
  });
}
