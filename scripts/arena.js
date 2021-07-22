class Arena {
  constructor(w, h, tetris) {
    this.board = drawBoard(w, h);
    this.tetris = tetris;
  }

  sweep() {
    let rowCount = 1;
    outer: for (let y = this.board.length - 1; y > 0; y--) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === 0) continue outer;
      }
      const row = this.board.splice(y, 1)[0].fill(0);
      this.board.unshift(row);
      y++;

      this.tetris.player.score += rowCount * 10;
      rowCount *= 2;
    }
  }

  update(matrix) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0)
          this.board[y + this.tetris.player.offset.y][
            x + this.tetris.player.offset.x
          ] = value;
      });
    });
  }

  collide(player) {
    const [m, o] = [player.matrix, player.offset];

    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (
          m[y][x] !== 0 &&
          (this.board[o.y + y] && this.board[o.y + y][o.x + x]) !== 0
        ) {
          return true;
        }
      }
    }

    return false;
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

export default Arena;