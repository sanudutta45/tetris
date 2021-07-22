class Piece {
  constructor() {
  }

  create(type) {
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

  rotate(matrix, dir) {
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
  
}

export default Piece;
