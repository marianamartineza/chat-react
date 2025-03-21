// socket.js
import { io } from 'socket.io-client';

const URL = 'http://192.168.0.213:3001'; // Reemplaza con la URL de tu servidor

const socket = io(URL, { autoConnect: false }); // Evita la conexión automática

export default socket;