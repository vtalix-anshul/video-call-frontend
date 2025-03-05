import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3015";

const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const joinRoom = (appointment_id, token, offer) => {
  socket.emit("join_room", { appointment_id, token, offer });
};

export const listenForJoinSuccess = (callback) => {
  socket.on("joined_successfully", callback);
};

export const listenForErrors = ( callback )=>{
    socket.on("error", callback)
}

export default socket;
