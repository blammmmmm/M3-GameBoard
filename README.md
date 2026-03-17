# M3 GameBoard Icons Update

Upload **all files** in this package to the root of your `M3-GameBoard` repo.

## Required repo structure

- overlay.html
- controller.html
- overlay.css
- controller.css
- overlay.js
- controller.js
- shared.js
- config.js
- README.md
- assets/
  - player-placeholder.png
  - Marlon Scoreboard.jpeg
  - PlaqueBoyMax Scoreboard.webp
  - icons/
    - misc.png
    - Rocket League.png
    - roblox.png
    - fifa.jpeg
    - Bo3.png
    - Fortnite.webp

## Firebase rules

```json
{
  "rules": {
    "series": {
      ".read": true,
      ".write": true
    }
  }
}
```

## URLs after GitHub Pages

- overlay.html
- controller.html
