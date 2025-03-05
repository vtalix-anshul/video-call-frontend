import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Call from "./pages/Call";
import VideoCall from "./pages/VideoCall";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/call/:meetingId" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
