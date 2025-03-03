import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Call from "./pages/Call";
import VideoCall from "./pages/VideoCall";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/call/:meetingId" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
