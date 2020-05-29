const gameBoard = (function () {
  const board = [['', '', ''],
                 ['', '', ''],
                 ['', '', '']];
  
  function isValidMove(move) {
    return move.row > -1 && move.row < 3 &&
           move.col > -1 && move.col < 3 &&
           board[move.row][move.col] === '';
  }

  function makeMove(move, mark) {
    isValidMove(move) && (board[move.row][move.col] = mark);
  }

  function reset() {
    board.forEach(function (row) {
      row.forEach(function (_, index){
        row[index] = '';
      });
    });
  }

  function toString() {
    return board.map((row) => row.toString()).join('\n');
  }

  return {isValidMove: isValidMove,
          makeMove: makeMove,
          reset: reset,
          toString: toString};
})();

gameBoard.makeMove({row: 0, col:1}, 'x');
gameBoard.makeMove({row: 2, col:2}, 'o');

console.log(gameBoard.toString());

gameBoard.reset();

console.log(gameBoard.toString());