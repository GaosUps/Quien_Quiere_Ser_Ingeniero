import React, { useState, useEffect } from 'react';
import PlayerScore from '../components/PlayerScore';
import Logo from '../components/Logo';
export default function ScorePage({ socketConnection }) {
  const [player1Name, setPlayer1Name] = useState("Jugador 1");
  const [player2Name, setPlayer2Name] = useState("Jugador 2");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  useEffect(() => {
    if (!socketConnection) {
      console.error('No hay conexión WebSocket disponible');
      return;
    }
    console.log('WebSocket conectado');
    socketConnection.onmessage = (event) => {
      console.log('Mensaje recibido del servidor:', event.data);
      try {
        const parsedData = JSON.parse(event.data);
        console.log("Datos recibidos:", parsedData);

        if (parsedData.player1Name) {
          setPlayer1Name(parsedData.player1Name);
        }
        if (parsedData.player1Score !== undefined) {
          setPlayer1Score(parsedData.player1Score);
        }
        if (parsedData.player2Name) {
          setPlayer2Name(parsedData.player2Name);
        }
        if (parsedData.player2Score !== undefined) {
          setPlayer2Score(parsedData.player2Score);
        }
      } catch (error) {
        console.error('Error al parsear los datos:', error);
      }
    };

    return () => {
      console.log('WebSocket desconectado');
    };
  }, [socketConnection]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/Background.webp')" }}>
      <Logo />

      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Puntuaciones</h1>
        
        <div className="flex justify-around mb-8">
          <PlayerScore player={player1Name} score={player1Score} />
          <PlayerScore player={player2Name} score={player2Score} />
        </div>

        <div className="mt-6 flex justify-center">
          <img src="/GaosMini_blackbg.webp" alt="GAOS Mini Logo" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}