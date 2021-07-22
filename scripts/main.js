import Tetris from "./tetris.js";
document.addEventListener("DOMContentLoaded", () => {
  const canvases = document.querySelectorAll(".player-wrapper canvas");

  [...canvases].forEach((canvas,index) => {
    new Tetris(canvas,index);
  });
});
