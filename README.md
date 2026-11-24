# Vikinggaffel

A game for MakeCode Arcade. A big viking holds a smaller viking upside down
from a longship. Catch drifting plastic on the helmet horns and stay away from
the jellyfish.

Plastic is worth 10 points near the surface, 25 in the middle and 50 at the
seabed. A viking survives one hit; the second one loses that viking. The game
is over when all five are gone. Plastic and jellyfish get faster, and
jellyfish more frequent, the longer you last.

| Control | |
|---|---|
| Left / right | Move the boat |
| Up / down | Raise or lower the viking |
| A | Start, and confirm on the cabinet screens |
| Menu | Pause |

The title, pause, high-score and game-over screens come from the
[arcade-cabinet](https://github.com/LeikGames/arcade-makecode-api) extension,
pinned in `pxt.json`. The score reported to it is the points.

## Do not open this project in the Blocks editor

Blocks can rewrite `main.ts`: it may turn locals into globals and reorder
functions. Use JavaScript only, in MakeCode Arcade or in VS Code with the
MakeCode Arcade extension.

## The code

All game code is in `main.ts`, divided by section headings. In-game text is in
Norwegian, and so is the project description. Everything else is in English.

The images are project assets in `images.g.jres`, with generated code in
`images.g.ts`. `assets.json` is empty on purpose: MakeCode expects the file.

- In `pxt.json`, `images.g.ts` must come before `main.ts`. Otherwise the
  images load as null.
- Image outlines are used for collisions. The `horns` image is never shown:
  its pixels are the area that catches plastic.
- Keep the image sizes, or check the layout constants in `main.ts`.
- The arms, the HUD and message boxes and the text are drawn in
  code, in the Art and Paint sections.
- Harder to replace with images: the arms stretch between two points, the foam,
  seabed and bubbles scroll by formula, and the boat bobs by formula.
