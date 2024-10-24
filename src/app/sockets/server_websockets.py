import asyncio
import websockets
from app.controller.formatquestion import format_questions, checkanswer
import json
from app.controller.randomid import randomId, checkId

# Diccionario para almacenar los jugadores conectados y sus puntajes
connected_players = {}
player_responses = {}  # Almacena las respuestas de cada jugador para cada pregunta
questions = format_questions()  # Formato de preguntas en Python
room_id = randomId()
current_question_index = 0  # Índice de la pregunta actual
# Manejador de conexiones y lógica del servidor
async def handle_connection(websocket):
    try:
        # Recibir el nombre del jugador
        name_player = await websocket.recv()
        id_player = await websocket.recv()
        score = 0
        print(f"Se ha conectado: {name_player} id: {id_player}")

        # Verificar que el ID sea correcto antes de continuar
        if not checkId(room_id, id_player):
            await websocket.send("Room Id incorrecta")
            return

        # Si hay más de 3 jugadores conectados, rechazar la conexión
        if len(connected_players) >= 2:
            await websocket.send("Maximo numero de jugadores son 3")
            await websocket.close()
            print(f"Conexión cerrada con {name_player} porque hay más de 3 jugadores.")
            return

        # Agregar al jugador conectado con su puntaje inicial
        connected_players[websocket] = {"name": name_player, "score": score}
        player_responses[websocket] = None

        # Si hay menos de 3 jugadores, esperar
        if len(connected_players) < 2:
            await websocket.send("Esperando a otro jugador")

        # Cuando hay 3 jugadores conectados, iniciar el juego
        if len(connected_players) == 2:
            for player in connected_players:
                await player.send("Jugadores completos")
            await send_question_to_all()

        # Escuchar las respuestas del jugador
        async for message in websocket:
            if websocket in connected_players:
                print(f"Mensaje recibido de {connected_players[websocket]['name']}: {message}")
                try:
                    message_data = json.loads(message)
                    player_option = message_data["option_player"]
                except json.JSONDecodeError:
                    print(f"Error en el formato del mensaje recibido de {connected_players[websocket]['name']}")
                    await websocket.send("Error en el formato de la respuesta.")
                    continue

                # Guardar la respuesta del jugador
                player_responses[websocket] = player_option

                # Verificar si ambos jugadores han respondido
                if all(res is not None for res in player_responses.values()):
                    print("Ambos jugadores han respondido")
                    response_results = process_player_responses(player_responses, questions)

                    # Enviar resultados a los jugadores
                    for player, result in zip(connected_players, response_results):
                        player_name = connected_players[player]['name']  # Obtener el nombre del jugador
                        if result['is_correct']:
                            await player.send(f"{player_name}, ¡Respuesta correcta! Tu puntaje actual es {connected_players[player]['score']}")
                            print(f"{player_name} respondió correctamente. Su puntaje actual es {connected_players[player]['score']}")
                            websocket.send(f"{player_name} respondió correctamente. Su puntaje actual es {connected_players[player]['score']}")
                        else:
                            await player.send(f"{player_name}, respuesta incorrecta. La respuesta correcta era {result['correct_answer']}. Tu puntaje actual es {connected_players[player]['score']}")
                            print(f"{player_name} respondió incorrectamente. Su puntaje actual es {connected_players[player]['score']}")
                            websocket.send(f"{player_name} respondió incorrectamente. Su puntaje actual es {connected_players[player]['score']}")


                    await send_next_question_or_finish()
                else:
                    # Enviar mensaje al otro jugador informando que estamos esperando su respuesta
                    for player in connected_players:
                        if player_responses[player] is None:
                            await player.send("Esperando respuesta del otro jugador")
                            print("Esperando respuesta del jugador")

    except websockets.exceptions.ConnectionClosedOK:
        if websocket in connected_players:
            name_player = connected_players[websocket]["name"]
            print(f"Conexión cerrada con {name_player}")

    finally:
        # Eliminar al jugador de la lista cuando se cierre la conexión
        if websocket in connected_players:
            print(f"Eliminando {connected_players[websocket]['name']} de la lista de jugadores conectados")
            del connected_players[websocket]
            del player_responses[websocket]

# Función que procesa las respuestas de los jugadores
def process_player_responses(player_responses, questions):
    response_results = []
    for player, selected_option in player_responses.items():
        current_question = questions[current_question_index]
        correct_answer = current_question["answer"]
        is_correct = checkanswer(selected_option, correct_answer)
        response_results.append({
            "player": connected_players[player]["name"],
            "selected_option": selected_option,
            "is_correct": is_correct,
            "correct_answer": correct_answer
        })
        if is_correct:
            connected_players[player]["score"] += 100
    return response_results


# Función para enviar la pregunta actual a todos los jugadores
async def send_question_to_all():
    current_question = questions[current_question_index]
    formatted_question = json.dumps(current_question)
    message = f"Enviando pregunta: {formatted_question}"
    print(f"Enviando pregunta: {formatted_question}")
    
    for client in connected_players:
        try:
            await client.send(message)  # Enviar la pregunta en el formato especificado
        except websockets.exceptions.ConnectionClosed:
            print(f"Conexión cerrada con {connected_players[client]['name']}")

# Función para enviar la siguiente pregunta o finalizar el juego
async def send_next_question_or_finish():
    global current_question_index
    current_question_index += 1

    # Si hay más preguntas, enviar la siguiente
    if current_question_index < len(questions):
        # Limpiar las respuestas
        for player in player_responses:
            player_responses[player] = None
        await send_question_to_all()
    else:
        # Finalizar el juego
        for player in connected_players:
            await player.send("Juego finalizado")
            print("Juego finalizado")
        current_question_index = 0  # Reiniciar el índice para una nueva partida

# Iniciar el servidor WebSocket
async def start_websocket_server():
    server = await websockets.serve(handle_connection, "localhost", 8765)
    print("Servidor WebSocket corriendo en ws://localhost:8765")
    print(f"La id del juego es {room_id}")
    await server.wait_closed()