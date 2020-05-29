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

  function at(row, col) {
    return board[row][col];
  }

  return {isValidMove: isValidMove,
          makeMove: makeMove,
          reset: reset,
          at: at,
          toString: toString};
})();

gameBoard.makeMove({row: 0, col:1}, 'x');
gameBoard.makeMove({row: 2, col:2}, 'o');

console.log(gameBoard.toString());

gameBoard.reset();

console.log(gameBoard.toString());

const playerManager = (function (){
  let players = {x: null, o: null};
  let currentPlayer = 'x';

  function Player(name) {
    function getName() { return name; }

    function getMark() {
      for(let mark in players){
        if (players[mark] === this) return mark;
      }
    }

    return {getName: getName,
            getMark: getMark};
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
  }

  function setPlayerX(player) {
    players.x = player;
  }

  function setPlayerO(player) {
    players.o = player;
  }

  return { Player: Player,
            switchPlayer: switchPlayer,
            setPlayerX: setPlayerX,
            setPlayerO: setPlayerO,
            currentPlayer: function() { return players[currentPlayer]; }
  };
})();

playerManager.setPlayerX(playerManager.Player("Some Name"));
playerManager.setPlayerO(playerManager.Player("Person Otherman"));

const boardUIController = (function(){
  const board_div = document.querySelector('#board');
  
  // make cells
  for(let r = 0; r < 3; r++) {
    for(let c = 0; c < 3; c++) {
      let cell = document.createElement('div');
      cell.setAttribute('data-row', r);
      cell.setAttribute('data-col', c);
      cell.addEventListener("click", clickHandler);
      board_div.appendChild(cell);
    }
  }

  function clickHandler(event) {
    const row = parseInt(this.getAttribute('data-row'));
    const col = parseInt(this.getAttribute('data-col'));
    const move = {row: row, col: col};
    if (gameBoard.isValidMove(move)) {
      gameBoard.makeMove(move, playerManager.currentPlayer().getMark());
      refresh();
      playerManager.switchPlayer();
    }
  }

  function refresh() {
    for(let cell of board_div.children) {
      const row = parseInt(cell.getAttribute('data-row'));
      const col = parseInt(cell.getAttribute('data-col'));
      const mark = gameBoard.at(row, col);
      if (mark == '') {
        0;
      } else {
        cell.classList.add(mark.toUpperCase());
      }
    }
  }
})();