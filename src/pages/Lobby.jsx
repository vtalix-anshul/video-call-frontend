// import { useEffect, useRef, useState } from "react";
// import { connectSocket, joinRoom, listenForJoinSuccess, listenForErrors } from "../services/socket";
// // import { useParams } from "react-router-dom";

// const Lobby = () => {

//   const appointment_id = "vtalix_appointment_9"; // Example ID
//   const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InZ0YWxpeF80Iiwicm9sZSI6InBhdGllbnQiLCJpYXQiOjE3NDEwMDI2OTUsImV4cCI6MTc0MTI2MTg5NX0.oVIpon0yGtcVSQiECNIc9dP__icNciS0u4g59eJcWZk`;

//   const [mediaError, setMediaError] = useState(null);
//   const [socketError, setSocketError] = useState(null);
//   const localVideoRef = useRef();

//     const [stream, setStream] = useState(null);
//     const [isCameraOn, setIsCameraOn] = useState(true);
//     const isCameraref = useRef(true);
//     const [isMicOn, setIsMicOn] = useState(true);

//   const getDeviceMedia = async () => {
//     // console.log("Requesting media permissions...");
  
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setMediaError("Your browser does not support camera access.");
//       return;
//     }
  
//     try {
//       const new_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       if (localVideoRef.current) {
//         setStream(new_stream);
//         localVideoRef.current.srcObject = new_stream;
//         setIsCameraOn(true);
//         isCameraref.current = true;
//       }
//       setMediaError(null); // Clear error if successful
//       console.log("Media stream received.");
//     } catch (err) {
//       console.error("Media access error:", err);
  
//       if (err.name === "NotAllowedError") {
//         setMediaError(
//           "Camera access is blocked. Please allow camera and microphone in browser settings or refresh the page."
//         );
//       } else if (err.name === "NotFoundError") {
//         setMediaError("No camera or microphone found on this device.");
//       } else {
//         setMediaError("Failed to access media devices. Try again.");
//       }
//     }
//   };
  

//   useEffect(() => {
//     // Connect socket
//     connectSocket();

//     getDeviceMedia();

//     // Handle successful join
//     listenForJoinSuccess((message) => {
//       console.log("Joined Room:", message);
//       setSocketError(null); // Clear any previous errors
//     });

//     // Handle socket errors
//     listenForErrors((errorMessage) => {
//       console.error("Socket Error:", errorMessage);
//       setSocketError(errorMessage.message);
//     });


//     return () => {
//       console.log("Socket disconnected");
//     };
//   }, []);

//   const handleJoinRoom = () => {
//     joinRoom(appointment_id, token);
//   };
// const toggleCamera = () => {
//     if (stream) {
//       const videoTrack = stream.getVideoTracks()[0];
//       if (videoTrack) {
//         if (isCameraref.current) {
//             videoTrack.stop(); // Completely stop the camera
//             localVideoRef.current.srcObject = null; // Remove video feed
//             const invertRef = !isCameraref.current;
//             isCameraref.current = invertRef;
//         } else {
//             getDeviceMedia(); // Restart the camera
//         }
//       }
//     }
//   };
  
 
//   // Function to toggle the microphone
//   const toggleMic = () => {
//     const audioTrack = stream?.getAudioTracks()[0];
//     if (audioTrack) {
//       const newState = !audioTrack.enabled;
//       audioTrack.enabled = newState;
//     //   setIsMicEnabled(newState);
//     }
//   };

//     return (
//         <div>
//             <h1>Lobby</h1>
//             {mediaError && <p style={{ color: "red" }}>{mediaError} <button onClick={()=>getDeviceMedia()}>Allow kr</button></p>}
//             {socketError && <p style={{ color: "red" }}>Error: {socketError}</p>}
//             {!mediaError && <>
//             <div className="bg-red-900 p-8">
//                 <video ref={localVideoRef} autoPlay playsInline className="scale-x-[-1]" />

//                 <div className="flex gap-5">
//                     <button className="bg-green-500" onClick={()=>toggleCamera()}>camera</button>
//                     <button className="bg-green-500" onClick={()=>toggleMic()}>mic</button>
//                 </div>
//             </div>

//             </>}
//             <button onClick={() => handleJoinRoom}  className="bg-red-900 p-8">Join Room</button>
//         </div>
//     );
// };

// export default Lobby;


import { useEffect, useRef, useState } from "react";
import { connectSocket, joinRoom, listenForJoinSuccess, listenForErrors } from "../services/socket";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
    const appointment_id = "vtalix_appointment_105";
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InZ0YWxpeF80Iiwicm9sZSI6InBhdGllbnQiLCJpYXQiOjE3NDEwMDI2OTUsImV4cCI6MTc0MTI2MTg5NX0.oVIpon0yGtcVSQiECNIc9dP__icNciS0u4g59eJcWZk`;

    const [mediaError, setMediaError] = useState(null);
    const [socketError, setSocketError] = useState(null);
    const localVideoRef = useRef();

    const [stream, setStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const isCameraref = useRef(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const peerConnection = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDeviceMedia();
        
        listenForJoinSuccess(() => {
            console.log("Joined Room");
            setSocketError(null);
        });

        listenForErrors((errorMessage) => {
            console.error("Socket Error:", errorMessage);
            setSocketError(errorMessage.message);
        });

        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
            }
        };
    }, []);

    const getDeviceMedia = async () => {
    //     // console.log("Requesting media permissions...");
          
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMediaError("Your browser does not support camera access.");
            return;
        }

        try {
            const new_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                setStream(new_stream);
                localVideoRef.current.srcObject = new_stream;
                setIsCameraOn(true);
                isCameraref.current = true;
            }
            setMediaError(null); // Clear error if successful
            console.log("Media stream received.");
        } catch (err) {
            console.error("Media access error:", err);

            if (err.name === "NotAllowedError") {
                setMediaError(
                    "Camera access is blocked. Please allow camera and microphone in browser settings or refresh the page."
                );
            } else if (err.name === "NotFoundError") {
                setMediaError("No camera or microphone found on this device.");
            } else {
                setMediaError("Failed to access media devices. Try again.");
            }
        }
    };
    
    const handleJoinRoom = async () => {
        connectSocket();
        const offer = await createOffer();
        joinRoom(appointment_id, token, offer);
    };

    // will toggle the camera
    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                if (isCameraref.current) {
                    videoTrack.stop(); // Completely stop the camera
                    localVideoRef.current.srcObject = null; // Remove video feed
                    const invertRef = !isCameraref.current;
                    isCameraref.current = invertRef;
                } else {
                    getDeviceMedia(); // Restart the camera
                }
            }
        }
    };
    // Function to toggle the microphone
    const toggleMic = () => {
        const audioTrack = stream?.getAudioTracks()[0];
        if (audioTrack) {
            const newState = !audioTrack.enabled;
            audioTrack.enabled = newState;
            //   setIsMicEnabled(newState);
        }
    };

    const createOffer = async () => {
        peerConnection.current = new RTCPeerConnection();

        // stream.getTracks().forEach((track) => {
        //     peerConnection.current.addTrack(track, stream);
        // });

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        return offer;
        // sendOffer(appointment_id, offer);
        // navigate("/room");
    };

    const sendOffer = (appointmentId, offer) => {
        console.log("Sending offer to server:", appointmentId, offer);
        
        // This function will later be updated to send the offer via WebSocket
    };

    return (
        <div>
            <h1>Lobby</h1>
            {mediaError && <p style={{ color: "red" }}>{mediaError}</p>}
            {socketError && <p style={{ color: "red" }}>Error: {socketError}</p>}
            {!mediaError && <>
                <div className="bg-red-900 p-8">
                    <video ref={localVideoRef} autoPlay playsInline className="scale-x-[-1]" />
                    <div className="flex gap-5">
                        <button className="bg-green-500" onClick={() => toggleCamera()}>camera</button>
                        <button className="bg-green-500" onClick={() => toggleMic()}>mic</button>
                    </div>
                </div>
            </>
            }
            <button onClick={handleJoinRoom}>Join Room</button>
        </div>
    );
};

export default Lobby;
