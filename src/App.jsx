import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Call from "./pages/Call";
import VideoCall from "./pages/VideoCall";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/call/:meetingId" element={<Lobby />} />
        <Route path="/room/:meetingId" element={<Room />} />
        <Route path="/" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
