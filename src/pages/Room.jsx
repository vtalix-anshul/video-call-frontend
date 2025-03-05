import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../redux/socketSlice";
import { io } from "socket.io-client";

const Room = () => {
  const { meetingId } = useParams(); // Get meeting ID from URL
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || { id: "vta", role: "patient" }; // Get user info

  useEffect(() => {
    const newSocket = io("http://localhost:3015", {
      auth: {
        token: localStorage.getItem("token"), // JWT for authentication 
      },
      query: { meetingId },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server with ID:", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [meetingId]);

  const handleJoinRoom = () => {
    if (!socket) return;
    socket.emit("join_room", { meetingId, userId: user.id, role: user.role });

    // Update the backend with user's socket ID
    fetch(`http://localhost:3015/api/v1/signalling/update-socket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ meetingId, userId: user.id, role: user.role, socketId: socket.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Socket ID updated in backend:", data);
        setIsJoined(true);
      })
      .catch((err) => console.error("Error updating socket ID:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Waiting Room</h1>
      <p>Meeting ID: {meetingId}</p>
      <p>User: {user.id} ({user.role})</p>
      {!isJoined ? (
        <button onClick={handleJoinRoom} className="mt-4 bg-blue-500 px-4 py-2 rounded">
          Join Room
        </button>
      ) : (
        <p className="mt-4 text-green-400">You have joined the room!</p>
      )}
    </div>
  );
};

export default Room;
