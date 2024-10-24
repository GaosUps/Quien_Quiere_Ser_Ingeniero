import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';  // Importando desde la carpeta components
import QuestionLabel from '../components/QuestionLabel';  // Importando desde la carpeta components
import OptionButton from '../components/OptionButton';  // Importando desde la carpeta components

export default function QuizPage({ socketConnection }) {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Cargar preguntas del localStorage si ya existen
  useEffect(() => {
    const storedQuestions = localStorage.getItem('questionsData');
    if (storedQuestions) {
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        if (Array.isArray(parsedQuestions)) {
          console.log("Preguntas cargadas desde localStorage:", parsedQuestions);
          setQuestionsData(parsedQuestions);
        } else {
          console.error("El contenido de localStorage no es un array:", parsedQuestions);
          localStorage.removeItem('questionsData');
        }
      } catch (error) {
        console.error('Error al cargar las preguntas del localStorage:', error);
      }
    }
  }, []);

  // Escuchar preguntas desde el WebSocket
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
        console.log("Preguntas recibidas:", parsedData);

        if (Array.isArray(parsedData)) {
          setQuestionsData(parsedData); // Actualizar las preguntas en el estado
          localStorage.setItem('questionsData', JSON.stringify(parsedData)); // Guardar en localStorage
          console.log("Preguntas guardadas en localStorage:", parsedData);
        } else {
          console.error('El mensaje recibido no es un array:', parsedData);
        }
      } catch (error) {
        console.error('Error al parsear las preguntas:', error);
      }
    };

    return () => {
      console.log('WebSocket sigue conectado');
    };
  }, [socketConnection]);

  const handleOptionClick = (option) => {
    console.log('Opción seleccionada:', option);

    if (socketConnection) {
      socketConnection.send(JSON.stringify({ option_player: option }));
    }

    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Fin del quiz");
    }
  };

  const currentQuestion = questionsData[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/Background.webp')" }}>
      <Logo />

      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-96">
        {currentQuestion ? (
          <>
            <QuestionLabel 
              question={currentQuestion.question} 
              label="Selecciona la respuesta correcta"
            />
            <div className="grid grid-cols-2 gap-4">
              <OptionButton option={currentQuestion.option1} onClick={() => handleOptionClick(currentQuestion.option1)} />
              <OptionButton option={currentQuestion.option2} onClick={() => handleOptionClick(currentQuestion.option2)} />
              <OptionButton option={currentQuestion.option3} onClick={() => handleOptionClick(currentQuestion.option3)} />
              <OptionButton option={currentQuestion.option4} onClick={() => handleOptionClick(currentQuestion.option4)} />
            </div>
          </>
        ) : (
          <p className="text-white">Esperando la pregunta...</p>
        )}
        <div className="mt-6 flex justify-center">
          <img src="/GaosMini_blackbg.webp" alt="GAOS Mini Logo" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}