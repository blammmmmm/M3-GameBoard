# M3 GameBoard

Best-of-3 series tracker overlay for OBS.

## Files
- `overlay.html` — add this to OBS as a Browser Source
- `controller.html` — open this to control the overlay
- `config.js` — Firebase config + default values
- `assets/` — avatar images

## GitHub Pages
Repo:
- `https://github.com/blammmmmm/M3-GameBoard`


## Firebase Rules
Use:

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

## Realtime DB Path
The app reads/writes from:

`series/`

## OBS Setup
- Browser Source URL: `overlay.html` GitHub Pages URL
- Width: `1920`
- Height: `1080`

## Current Avatar Presets
- Marlon → `assets/Marlon Scoreboard.jpeg`
- Max → `assets/PlaqueBoyMax Scoreboard.webp`
- Placeholder → `assets/player-placeholder.png`
