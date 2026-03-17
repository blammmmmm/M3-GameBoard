export const firebaseConfig = {
  "apiKey": "AIzaSyB6a2sk-cYT8LEMmccHdKw1YMV6Z3t5PKk",
  "authDomain": "m3-1v1-game-board.firebaseapp.com",
  "databaseURL": "https://m3-1v1-game-board-default-rtdb.firebaseio.com",
  "projectId": "m3-1v1-game-board",
  "storageBucket": "m3-1v1-game-board.firebasestorage.app",
  "messagingSenderId": "940980296150",
  "appId": "1:940980296150:web:9b9b972e6eb5148ba5ec77"
};

export const DB_PATH = "series";

export const avatarOptions = [
  { label: "Marlon", value: "assets/Marlon Scoreboard.jpeg" },
  { label: "Max", value: "assets/PlaqueBoyMax Scoreboard.webp" },
  { label: "Placeholder", value: "assets/player-placeholder.png" }
];

export const defaultSeriesState = {
  player1Name: "Marlon",
  player2Name: "Max",
  player1Avatar: "assets/Marlon Scoreboard.jpeg",
  player2Avatar: "assets/PlaqueBoyMax Scoreboard.webp",
  player1Color: "#2e6cff",
  player1ColorDark: "#1437bf",
  player2Color: "#ff476f",
  player2ColorDark: "#b8153c",
  game1Label: "COD",
  game2Label: "FN",
  game3Label: "RL",
  game1Icon: "🎯",
  game2Icon: "🚌",
  game3Icon: "🚗",
  game1Winner: "",
  game2Winner: "",
  game3Winner: "",
  animationsEnabled: true,
  autoWinnerEnabled: true,
  confettiEnabled: true,
  winnerBadgeVisible: true,
  winnerAnimation: null
};
