import { checkWinner } from "../game/logic.js";

let players = {};
let gameState = Array(9).fill(null);
let currentPlayer = "X";

function registerGameHandlers(io, socket) {
  if (Object.keys(players).length >= 2) {
    socket.emit("roomFull");
    return;
  }

  const playerSymbol = Object.values(players).includes("X") ? "O" : "X";
  players[socket.id] = playerSymbol;

  socket.emit("playerAssignment", playerSymbol);
  if (Object.keys(players).length === 2) {
    io.emit("gameState", { gameState, currentPlayer });
  } else {
    socket.emit("waitingForPlayer");
  }

  socket.on("makeMove", (index) => {
    if (gameState[index] || currentPlayer !== players[socket.id]) return;

    gameState[index] = players[socket.id];
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    const winner = checkWinner(gameState);

    if (winner) {
      io.emit("gameEnd", winner);
    } else if (gameState.every(Boolean)) {
      io.emit("gameEnd", "draw");
    }

    io.emit("gameState", { gameState, currentPlayer });
  });

  socket.on("resetGame", () => {
    if (players[socket.id]) {
      gameState = Array(9).fill(null);
      currentPlayer = "X";
      io.emit("gameEnd", null);
      io.emit("gameState", { gameState, currentPlayer });
    }
  });


  socket.on("disconnect", () => {
    delete players[socket.id];
    gameState = Array(9).fill(null);
    currentPlayer = "X";
    io.emit("gameEnd", null);
    io.emit("gameState", { gameState, currentPlayer });
    if (Object.keys(players).length === 1) {
      const remainingSocketId = Object.keys(players)[0];
      io.to(remainingSocketId).emit("waitingForPlayer");
    }
  });
}

export default registerGameHandlers;
