import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Logins from "./pages/Logins";
import { AppContext, socket } from "./context/AppContext";
import { useState } from "react";
import Cursor from "./components/Cursor";
import VideoCall from "./components/VideoCall";
import Video from "./components/Video";
import Mouse from "./components/MouseFollower";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state) => state.user);
  return (
    <div className="app">
      <AppContext.Provider
        value={{
          socket,
          currentRoom,
          setCurrentRoom,
          members,
          setMembers,
          messages,
          setMessages,
          privateMemberMsg,
          setPrivateMemberMsg,
          rooms,
          setRooms,
          newMessages,
          setNewMessages,
        }}
      >
        <BrowserRouter>
          <Cursor />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            {!user && (
              <>
                <Route path="/login" element={<Logins />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset/:id/:token" element={<Reset />}></Route>
              </>
            )}
            <Route path="/chat" element={<Chat />} />
            <Route path="/video" element={<Video />} />
            <Route path="/videoCall" element={<VideoCall />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
