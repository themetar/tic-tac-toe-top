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

  function winner() {
    return  board[0][0] === board[0][1] && board[0][1] === board[0][2] && board[0][0] ||
            board[1][0] === board[1][1] && board[1][1] === board[1][2] && board[1][0] ||
            board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][0] ||
      
            board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[0][0] ||
            board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[0][1] ||
            board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[0][2] ||
      
            board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] ||
            board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0] || '';
  }

  function isWon() {
    return  winner() !== '';
  }

  function isTied() {
    return board.every(function(row) {
      return row.every(function (mark) { return mark !== ''; });
    } ) && !isWon();;
  }

  function isOver() { return isWon() || isTied(); }

  return {isValidMove: isValidMove,
          makeMove: makeMove,
          reset: reset,
          at: at,
          isTied: isTied,
          isWon: isWon,
          isOver: isOver,
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
            currentPlayer: function() { return players[currentPlayer]; },
            resetStarting: function() { currentPlayer = 'x'; }
  };
})();

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
    if (gameStateManager.canPlay() && !gameBoard.isOver() && gameBoard.isValidMove(move)) {
      gameBoard.makeMove(move, playerManager.currentPlayer().getMark());
      if (!gameBoard.isOver()) playerManager.switchPlayer();
      
      if (gameBoard.isOver()){
        if (gameBoard.isWon()) gameStateManager.gameEnded(playerManager.currentPlayer());
        if (gameBoard.isTied()) gameStateManager.gameEnded();
      }
      
      refresh();
    }
  }

  function refresh() {
    for(let cell of board_div.children) {
      const row = parseInt(cell.getAttribute('data-row'));
      const col = parseInt(cell.getAttribute('data-col'));
      const mark = gameBoard.at(row, col);
      if (mark == '') {
        cell.classList.remove('X');
        cell.classList.remove('O');
      } else {
        cell.classList.add(mark.toUpperCase());
      }
    }
  }

  return {reset: function () {
                  gameBoard.reset();
                  refresh();
                }};
})();

const gameStateManager = (function (form, message){
  let state = 'pre-game';

  form.addEventListener('submit', function (event){
    event.preventDefault();

    // get names
    const x_name = form.querySelector('input[id="player-x-name"]').value || form.querySelector('input[id="player-x-name"]').placeholder;
    const o_name = form.querySelector('input[id="player-o-name"]').value || form.querySelector('input[id="player-o-name"]').placeholder;

    // set up players
    playerManager.setPlayerX(playerManager.Player(x_name));
    playerManager.setPlayerO(playerManager.Player(o_name));
    playerManager.resetStarting();

    state = 'playing';

    form.classList.add('closed');
    message.classList.add('closed');

    message.classList.remove('X');
    message.classList.remove('O');

    boardUIController.reset();
  });

  function gameEnded(winner = null) {
    if (winner) {
      message.textContent = winner.getName() + " WON!";
      message.classList.add(winner.getMark().toUpperCase());
    } else {
      message.textContent = "It's a TIE.";
    }
    message.classList.remove('closed');

    state = 'pre-game';

    form.classList.remove('closed');
  }

  return {canPlay: function () { return state === 'playing'; },
          gameEnded: gameEnded};
  
})(document.querySelector('form'), document.querySelector('#message'));
