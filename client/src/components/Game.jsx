import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cell from './Cell';

let socket;

export default function Game() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('');
  const [current, setCurrent] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');
  const [pendingWinner, setPendingWinner] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [roomFull, setRoomFull] = useState(false);

  useEffect(() => {
    try {
      socket = io('http://localhost:3000', {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        timeout: 5000
      });

      socket.on('connect', () => {
        setConnected(true);
      });

      socket.on('connect_error', (err) => {
        setError('Unable to connect to game server.');
        console.error('Connection error:', err.message);
      });

      socket.on('playerAssignment', setPlayer);

      socket.on('waitingForPlayer', () => {
        setWaiting(true);
      });

      socket.on('gameState', ({ gameState, currentPlayer }) => {
        setGameState(gameState);
        setCurrent(currentPlayer);
        setWaiting(false);
        setStatus('');
      });

      socket.on('gameEnd', (winner) => {
        if (winner === null) {
          setResult('');
          setPendingWinner(null);
          return;
        }
        setPendingWinner(winner);
      });

      socket.on('roomFull', () => {
        setRoomFull(true);
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      setError('Something went wrong while connecting.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!pendingWinner || !player) return;

    if (pendingWinner === 'draw') {
      setResult("It's a draw!");
    } else if (pendingWinner === player) {
      setResult("You win!");
    } else {
      setResult("You lose!");
    }

    setPendingWinner(null);
  }, [pendingWinner, player]);

  function handleClick(index) {
    if (!gameState[index] && current === player && !result && !waiting) {
      socket.emit('makeMove', index);
    }
  }

  function reset() {
    if (socket && connected && result) {
      setResult('');
      setPendingWinner(null);
      socket.emit('resetGame');
    }
  }

  if (error) {
    return <div style={{ color: 'red', padding: '1rem' }}>{error}</div>;
  }

  if (!connected) {
    return <div style={{ padding: '1rem' }}>Connecting to server...</div>;
  }

  if (roomFull) {
    return (
      <div style={{ color: 'red', fontWeight: 'bold', padding: '1rem' }}>
        Room is full. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <p>You are: {player}</p>

      {waiting && (
        <p style={{ fontStyle: 'italic', color: 'orange' }}>
          Waiting for another player to join...
        </p>
      )}

      {result ? (
        <p style={{
          fontSize: '1.2rem',
          color: result.includes("win") ? "green" :
                 result.includes("lose") ? "red" : "orange"
        }}>
          {result}
        </p>
      ) : !waiting && (
        <p>{`Turn: ${current}`}</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {gameState.map((val, idx) => (
          <Cell key={idx} value={val} onClick={() => handleClick(idx)} />
        ))}
      </div>

      <button
        onClick={reset}
        disabled={!result}
        style={{
          marginTop: '1rem',
          cursor: result ? 'pointer' : 'not-allowed',
          opacity: result ? 1 : 0.5
        }}
      >
        Reset Game
      </button>
    </div>
  );
}
