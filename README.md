
---

# Servidor WebSocket para Juego de Preguntas

Este proyecto es un servidor WebSocket diseñado para un juego de preguntas en tiempo real. El backend está desarrollado en Python usando la librería websockets para la comunicación entre el servidor y los clientes conectados. Obtiene las preguntas del quiz desde una base de datos SQL SERVER y gestiona las respuestas y puntajes de los jugadores durante la partida.

El frontend de este proyecto está construido con React y se conecta al servidor WebSocket para actualizaciones en tiempo real y la interacción del juego.

Para más detalles técnicos, revisa la [Documentación Técnica](TECHNICAL_DOCUMENTATION.md).

## Autores
- Francisco López
- Juan Donoso
- Mateo Montenegro
- Hugo

## Estructura del Proyecto

```plaintext
src/
├── app/
│   ├── controller/
│   │   ├── formatquestion.py   # Gestiona el formato de las preguntas y la verificación de respuestas
│   │   ├── randomid.py         # Maneja los IDs de las salas y jugadores
│   └── db/
│       ├── connection.py       # Configuración de la conexión a la base de datos SQL SERVER
│       └── queries.py          # Consultas para obtener las preguntas del quiz de la base de datos
|       sockets/
|       ├── __init__.py
|       ├── server.py           # Servidor WebSocket
├── __init__.py
└── main.py                     #Ejecucion principal
```

## Descripción del Servidor WebSocket

El servidor WebSocket maneja lo siguiente:
- Conexiones de jugadores (Gestionado por la configuracion del proyecto QQI config).
- Gestión de preguntas y respuestas durante el juego.
- Cálculo de puntajes basado en las respuestas correctas.

### Dependencias

Este proyecto requiere las siguientes dependencias de Python:

```bash
pip install websockets pyodbc
```

### Lista de Paquetes Instalados:

```plaintext
Package         Version
--------------- -------
blinker         1.8.2
click           8.1.7
colorama        0.4.6
Flask           3.0.3
itsdangerous    2.2.0
Jinja2          3.1.4
MarkupSafe      3.0.1
pip             24.2
psycopg2        2.9.9
psycopg2-binary 2.9.9
psycopg2-pool   1.2
pyodbc          5.2.0
python-dotenv   1.0.1
websockets      13.1
Werkzeug        3.0.4
```

---