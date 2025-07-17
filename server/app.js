import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import registerGameHandlers from './socket/gameSocket.js';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],  }
});

io.on('connection', (socket) => {
  registerGameHandlers(io, socket);
});

export default server;
