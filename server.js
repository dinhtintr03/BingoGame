const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];
let bingoBoard = Array(25).fill(null).map((_, i) => i + 1);

app.use(express.static('public'));

io.on('connection', (socket) => {
    if (players.length < 2) {
        players.push(socket.id);
        const playerNumber = players.indexOf(socket.id) + 1;
        socket.emit('playerNumber', playerNumber);
    }

    socket.on('startGame', () => {
        shuffleBoard();
        io.emit('updateBoard', bingoBoard);
    });

    socket.on('selectCell', (index) => {
        bingoBoard[index] = 'X';
        io.emit('updateBoard', bingoBoard);
        if (checkBingo()) {
            io.emit('gameOver', `Player ${players.indexOf(socket.id) + 1} wins!`);
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(id => id !== socket.id);
    });
});

function shuffleBoard() {
    bingoBoard = Array(25).fill(null).map((_, i) => i + 1).sort(() => Math.random() - 0.5);
}

function checkBingo() {
    const winningPatterns = [
        // Rows
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        // Columns
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        // Diagonals
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    return winningPatterns.some(pattern => 
        pattern.every(index => bingoBoard[index] === 'X')
    );
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
