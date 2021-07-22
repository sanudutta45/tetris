class Player {
  constructor(tetris) {
    this.tetris = tetris;
    this.arena = tetris.arena;
    this.piece = tetris.piece;
    this.offset = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
    this.time;
  }

  updateScore() {
    document.querySelector(`.player-${this.tetris.playerId} #score`).innerText = this.score;
  }

  fps() {
    this.time = setInterval(() => this.moveY(), 500);
  }

  stopFps() {
    clearInterval(this.time);
  }

  rotate(dir) {
    console.log("rotate gets called");
    let offset = 0;
    const pos = this.offset.x;
    this.piece.rotate(this.matrix, dir);
    while (this.arena.collide(this)) {
      this.offset.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this.piece.rotate(this.matrix, -dir);
        this.offset.x = pos;
        return;
      }
    }
  }

  moveX(dir) {
    this.offset.x += dir;
    if (this.arena.collide(this)) {
      this.offset.x -= dir;
    }
  }

  moveY() {
    this.offset.y++;
    if (this.arena.collide(this)) {
      this.offset.y--;
      this.arena.update(this.matrix);
      this.tetris.reset();
      this.arena.sweep();
      this.updateScore();
    }
    this.tetris.draw();
    // player.offset.y = 0;
  }
}

export default Player;
