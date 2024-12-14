import { io } from 'socket.io-client';
import { toast } from '@/components/ui/use-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/socket.io';

export const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['polling', 'websocket'], // Start with polling first
  withCredentials: true,
  autoConnect: false, // Don't connect automatically
  reconnection: true,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5
});

let isFirstConnection = true;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  reconnectAttempts = 0;
  
  if (!isFirstConnection) {
    toast({
      title: "Connecté",
      description: "Connexion au serveur établie"
    });
  }
  isFirstConnection = false;
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  reconnectAttempts++;

  if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: `Tentative de reconnexion ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`
    });
  } else {
    socket.disconnect();
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: "Impossible de se connecter au serveur après plusieurs tentatives."
    });
  }
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  
  if (reason === 'io server disconnect') {
    socket.connect();
  }
  
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    toast({
      variant: "destructive",
      title: "Déconnecté",
      description: "La connexion au serveur a été perdue. Tentative de reconnexion..."
    });
  }
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
  toast({
    variant: "destructive",
    title: "Erreur",
    description: "Une erreur est survenue avec la connexion"
  });
});

// Connect only when needed
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect when not needed
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;