import Piece from "./piece.js";
import Arena from "./arena.js";
import Player from "./player.js";
import {
  ROW,
  COL,
  CELL_SIZE,
  colors,
  letters,
  controllerKeys,
} from "./constant.js";

class Tetris {
  constructor(canvas, id) {
    this.arena = new Arena(COL, ROW, this);
    this.piece = new Piece();
    this.player = new Player(this);
    this.playerId = id;
    this.canvas = canvas;
    this.controller = {};
    this.counter = 0;
    setup(this);
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena.board, { x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.offset);
  }

  drawMatrix = (matrix, offset) => {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.ctx.fillStyle = colors[value];
          this.ctx.fillRect(offset.x + x, offset.y + y, 1, 1);
        }
      });
    });
  };

  stopGame = (ev) => {
    ev.target.classList.add("hide");
    document.removeEventListener("keydown", this.controller);
    ev.target.parentNode.querySelector("#start").classList.remove("hide");
    this.arena.board.forEach((row) => row.fill(0));
    this.player.matrix.forEach((row) => row.fill(0));
    this.player.score = 0;
    this.player.updateScore();
    this.draw();
    this.player.stopFps();
  };

  executeMoves() {
    for (const key in this.controller) {
      if (this.controller[key]?.pressed) this.controller[key]?.func();
    }
  }

  animate = (timestamp = 0) => {
    const elapsed = timestamp - (this.previousTimestamp || 0);
    this.previousTimestamp = timestamp;

    this.counter += elapsed;

    if (this.counter > 80) {
      this.executeMoves();
      this.counter = 0;
    }
    requestAnimationFrame(this.animate);
  };

  startGame = (ev) => {
    ev.target.classList.add("hide");
    document.addEventListener("keydown", (e) => {
      this.controller[e.keyCode].pressed = true;
    });

    document.addEventListener("keyup", (e) => {
      this.controller[e.keyCode].pressed = false;
    });
    ev.target.parentNode.querySelector("#stop").classList.remove("hide");
    this.reset();
    this.player.fps();
    this.animate();
  };

  // controller = (ev) => {
  //   switch (ev.keyCode) {
  //     case controllerKeys[this.playerId].left: {
  //       this.player.moveX(-1);
  //       this.draw();
  //       break;
  //     }
  //     case controllerKeys[this.playerId].right: {
  //       this.player.moveX(+1);
  //       this.draw();
  //       break;
  //     }
  //     case controllerKeys[this.playerId].down: {
  //       this.player.stopFps();
  //       this.player.moveY();
  //       this.player.fps();
  //       break;
  //     }
  //     case controllerKeys[this.playerId].rotateC: {
  //       this.player.rotate(-1);
  //       break;
  //     }
  //     case controllerKeys[this.playerId].rotateCC: {
  //       this.player.rotate(1);
  //       break;
  //     }
  //     default:
  //       return;
  //   }
  // };

  reset() {
    this.player.matrix = this.piece.create(
      letters[(letters.length * Math.random()) | 0]
    );

    this.player.offset.y = 0;
    this.player.offset.x =
      (this.arena.board[0].length / 2 - this.player.matrix[0].length / 2) | 0;

    if (this.arena.collide(this.player)) {
      this.arena.board.forEach((row) => row.fill(0));
    }
  }
}

function setup(tetris) {
  tetris.ctx = tetris.canvas.getContext("2d");

  document
    .querySelector(`.player-${tetris.playerId} #start`)
    .addEventListener("click", tetris.startGame);
  document
    .querySelector(`.player-${tetris.playerId} #stop`)
    .addEventListener("click", tetris.stopGame);

  tetris.canvas.width = CELL_SIZE * COL;
  tetris.canvas.height = CELL_SIZE * ROW;
  tetris.ctx.fillStyle = "#000";
  tetris.ctx.fillRect(0, 0, tetris.canvas.width, tetris.canvas.height);
  tetris.ctx.scale(CELL_SIZE, CELL_SIZE);

  const keys = controllerKeys[tetris.playerId];

  tetris.controller[keys.left] = {
    pressed: false,
    func: () => {
      tetris.player.moveX(-1);
      tetris.draw();
    },
  };

  tetris.controller[keys.right] = {
    pressed: false,
    func: () => {
      tetris.player.moveX(1);
      tetris.draw();
    },
  };

  tetris.controller[keys.down] = {
    pressed: false,
    func: () => {
      tetris.player.stopFps();
      tetris.player.moveY();
      tetris.player.fps();
    },
  };

  tetris.controller[keys.rotateC] = {
    pressed: false,
    func: () => {
      tetris.player.rotate(-1);
      tetris.draw();
    },
  };

  tetris.controller[keys.rotateCC] = {
    pressed: false,
    func: () => {
      tetris.player.rotate(1);
      tetris.draw();
    },
  };
}

export default Tetris;
