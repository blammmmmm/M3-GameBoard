export const firebaseConfig = {
  "apiKey": "AIzaSyB6a2sk-cYT8LEMmccHdKw1YMV6Z3t5PKk",
  "authDomain": "m3-1v1-game-board.firebaseapp.com",
  "databaseURL": "https://m3-1v1-game-board-default-rtdb.firebaseio.com",
  "projectId": "m3-1v1-game-board",
  "storageBucket": "m3-1v1-game-board.firebasestorage.app",
  "messagingSenderId": "940980296150",
  "appId": "1:940980296150:web:9b9b972e6eb5148ba5ec77"
};

export const avatarOptions = {
  "Marlon": "assets/Marlon Scoreboard.jpeg",
  "Max": "assets/PlaqueBoyMax Scoreboard.webp",
  "Placeholder": "assets/player-placeholder.png"
};

export const iconOptions = {
  "COD": "assets/icons/Bo3.png",
  "Fortnite": "assets/icons/Fortnite.webp",
  "FIFA": "assets/icons/fifa.jpeg",
  "Roblox": "assets/icons/roblox.png",
  "Rocket League": "assets/icons/Rocket League.png",
  "Misc": "assets/icons/misc.png",
  "MW2": "assets/icons/MW2.png"
};

export const defaultSeriesData = {
  player1Name: "Marlon",
  player2Name: "Max",
  player1Avatar: avatarOptions["Marlon"],
  player2Avatar: avatarOptions["Max"],
  game1Icon: iconOptions["COD"],
  game2Icon: iconOptions["Fortnite"],
  game3Icon: iconOptions["Rocket League"],
  game1Winner: "",
  game2Winner: "",
  game3Winner: "",
  animationsEnabled: true,
  winnerAnimation: null
};
