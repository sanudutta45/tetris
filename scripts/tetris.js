import { ROW, COL, CELL_SIZE, MIN_X, MAX_X } from "./constant.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tetris");
  const ctx = canvas.getContext("2d");

  document.getElementById("start").addEventListener("click", startGame);
  document.getElementById("stop").addEventListener("click", stopGame);

  canvas.width = CELL_SIZE * COL;
  canvas.height = CELL_SIZE * ROW;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let arena = drawBoard(25, 35);

  const player = {
    offset: { x: 0, y: 0 },
    matrix: null,
    score: 0,
  };

  const colors = [
    null,
    "red",
    "blue",
    "pink",
    "violet",
    "grey",
    "green",
    "orange",
  ];

  function updateScore() {
    document.getElementById("score").innerText = player.score;
  }
  function areaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; y--) {
      for (let x = 0; x < arena[y].length; x++) {
        if (arena[y][x] === 0) continue outer;
      }
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      y++;

      player.score += rowCount * 10;
      rowCount *= 2;
    }
  }

  let interval;

  function createPiece(type) {
    switch (type) {
      case "T": {
        return [
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 1],
        ];
      }
      case "I": {
        return [
          [0, 2, 0, 0],
          [0, 2, 0, 0],
          [0, 2, 0, 0],
          [0, 2, 0, 0],
        ];
      }
      case "J": {
        return [
          [0, 0, 3],
          [0, 0, 3],
          [0, 3, 3],
        ];
      }
      case "L": {
        return [
          [4, 0, 0],
          [4, 0, 0],
          [4, 4, 0],
        ];
      }
      case "O": {
        return [
          [5, 5],
          [5, 5],
        ];
      }
      case "Z": {
        return [
          [6, 6, 0],
          [0, 6, 0],
          [0, 6, 6],
        ];
      }
      case "S": {
        return [
          [0, 7, 7],
          [0, 7, 0],
          [7, 7, 0],
        ];
      }
      default:
        return [
          [0, 0],
          [0, 0],
        ];
    }
  }

  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.offset);
  }

  function collide(arena, player) {
    const [m, o] = [player.matrix, player.offset];

    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (
          m[y][x] !== 0 &&
          (arena[o.y + y] && arena[o.y + y][o.x + x]) !== 0
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }

    if (dir > 0) {
      matrix.forEach((row) => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  function playerRotate(dir) {
    let offset = 0;
    const pos = player.offset.x;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
      player.offset.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.matrix[0].length) {
        rotate(player.matrix, -dir);
        player.offset.x = pos;
        return;
      }
    }
  }

  function drawBoard(w, h) {
    let board = [];
    for (let i = 0; i < h; i++) {
      board.push([]);
      for (let j = 0; j < w; j++) {
        board[i].push(0);
      }
    }
    return board;
  }

  function mergeMatrix(fromMatrix, toMatrix) {
    fromMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0)
          toMatrix[y + player.offset.y][x + player.offset.x] = value;
      });
    });
  }

  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = colors[value];
          ctx.fillRect(
            offset.x * CELL_SIZE + x * CELL_SIZE,
            offset.y * CELL_SIZE + y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      });
    });
  }

  function reset() {
    const pieceLetter = "IJLOZTS";

    player.matrix = createPiece(
      pieceLetter[(pieceLetter.length * Math.random()) | 0]
    );

    player.offset.y = 0;
    player.offset.x = (arena[0].length / 2 - player.matrix[0].length / 2) | 0;

    if (collide(arena, player)) {
      arena.forEach((row) => row.fill(0));
    }
  }

  function dropDown() {
    player.offset.y++;
    if (collide(arena, player)) {
      player.offset.y--;
      mergeMatrix(player.matrix, arena);
      reset();
      areaSweep();
      updateScore();
    }
    draw();
    // player.offset.y = 0;
  }

  function playerMove(dir) {
    player.offset.x += dir;
    if (collide(arena, player)) {
      player.offset.x -= dir;
    }
  }

  function fps() {
    interval = setInterval(() => dropDown(), 500);
  }

  function stopGame(ev) {
    ev.target.classList.add("hide");
    document.removeEventListener("keydown", controller);
    document.getElementById("start").classList.remove("hide");
    arena.forEach((row) => row.fill(0));
    player.matrix.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
    draw();
    clearInterval(interval);
  }

  function startGame(ev) {
    ev.target.classList.add("hide");
    document.addEventListener("keydown", controller);
    document.getElementById("stop").classList.remove("hide");
    reset();
    fps();
  }

  function controller(ev) {
    switch (ev.keyCode) {
      case 37: {
        // if(player.offset.x > MIN_X && player.offset.x < MAX_X)
        playerMove(-1);
        draw();
        break;
      }
      case 39: {
        playerMove(+1);
        draw();
        break;
      }
      case 40: {
        clearInterval(interval);
        dropDown();
        fps();
        break;
      }
      case 65: {
        playerRotate(-1);
        break;
      }
      case 68: {
        playerRotate(1);
        break;
      }
      default:
        return;
    }
  }
});
