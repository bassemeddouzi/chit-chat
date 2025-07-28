import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FadePage from "../components/animation_Instance/FadePage";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

import { getProfile } from "../api/user";
import socket from "../socket/socketIO";

import NavBar from "../components/navBar/NavBar";
import ConversationLayout from "../layout/Home/ConversationLayout";
import UpdateProfile from "../layout/Home/UpdateProfilLayout";
import { SocketHandler } from "../components/SocketHandler";
import InCallAlert from "../components/InCallAlert";
import OutCallAlert from "../components/OutCallAlert";
import CallRoom from "../components/roomCalling/CallRoom";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    if (!user) {
      if (token) {
        dispatch(getProfile(token));
      } else {
        navigate("/auth");
      }
    }
    if (token && user) {
      socket.connect();
      socket.emit("login", token);
      return () => {
        socket.disconnect();
      };
    }
  }, [user?._id]);

  return (
    <div className="relative">
      <SocketHandler socket={socket} />
    <InCallAlert />
    <OutCallAlert/>
    <CallRoom/>
      <NavBar />
      {loading && (
        <div className="absolute backdrop-blur-sm w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <Loader className="absolute top-1/2 left-1/2 animate-spin " />
        </div>
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <FadePage>
                <ConversationLayout />
              </FadePage>
            }
          />
          <Route path="/profile" element={<UpdateProfile />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default Home;
