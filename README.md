#  Tic-Tac-Toe Game

A real-time, browser-based Tic-Tac-Toe game that supports **two players playing simultaneously** over the internet. Built with **React (Vite)** for the frontend and **Node.js + Express + Socket.IO** for the backend.

---

##  Project Overview

🔗 **Live Demo:** [https://tictactoe-seven-lac.vercel.app/](https://tictactoe-seven-lac.vercel.app/)

This app allows two players to connect and play Tic-Tac-Toe in real-time. The game ensures only 2 players can join at a time, handles disconnects, shows waiting messages, prevents early resets, and reflects win/lose/draw results instantly.

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time Engine:** Socket.IO (WebSockets)
---

## Implemented Features

- Real-time gameplay using **WebSockets** (via Socket.IO)
- Assigns player as either `X` or `O`
- Shows turn indicator and live board state
- Displays results: "You win", "You lose", or "It's a draw"
- Prevents resetting during active gameplay
- Reset button appears only after game ends
- Shows message when only one player is in the room:"Waiting for another player to join..."
- Shows message if third user tries to join: "Room is full"
- Handles player disconnects and updates to another player

---

## How to Run This Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/rohitp-dev/tictactoe.git
cd tictactoe
```

---

### 2. Setup Backend (Node.js + Socket.IO)

```bash
cd server
npm install
```

To start the backend server:

```bash
node server.js
```

Server runs on: `http://localhost:3000`

---

### 3. Setup Frontend (React + Vite)

Open a new terminal:

```bash
cd client
npm install
```

To start the frontend app:

```bash
npm run dev
```

App opens on: `http://localhost:5173`

> Open the app in two browser windows/tabs to simulate multiplayer.

---

### 4. Play the Game

- One player joins first and sees: _"Waiting for another player..."_
- Second player joins and game starts
- Both play turns in real time
- Game ends with **Win / Lose / Draw** result
- Reset is only enabled after game ends

---

### 5. Notes

- Only two players allowed at a time
- Third player sees "Room is full"
- If one player leaves, the other sees: _"Waiting for another player..."_
- Reset button is disabled during active game
---