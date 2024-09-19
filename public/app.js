const socket = io();
const bingoBoard = document.getElementById('bingo-board');
const startGameBtn = document.getElementById('start-game');
const statusDiv = document.getElementById('status');

let playerNumber;

startGameBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

socket.on('playerNumber', (number) => {
    playerNumber = number;
    statusDiv.innerText = `You are player ${number}`;
});

socket.on('updateBoard', (board) => {
    updateBingoBoard(board);
});

function updateBingoBoard(board) {
    bingoBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.innerText = cell;
        cellDiv.addEventListener('click', () => {
            socket.emit('selectCell', index);
        });
        bingoBoard.appendChild(cellDiv);
    });
}

socket.on('gameOver', (message) => {
    statusDiv.innerText = message;
});
