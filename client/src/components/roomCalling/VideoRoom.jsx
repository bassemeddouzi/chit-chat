import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import socket from "../../socket/socketIO";

function VideoRoom({ toSocketId, localStream, remoteStream }) {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const handleEndCall = () => {
    socket.emit("endCall", { toSocketId });
    dispatch({ type: "END_CALL" });
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-between items-center p-4 z-50">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-[70%] object-cover rounded-lg"
      />
      <div className="flex justify-between items-center w-full mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-24 h-24 object-cover rounded-lg border"
        />
        <button
          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700"
          onClick={handleEndCall}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default VideoRoom;
