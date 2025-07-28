import React from "react";
import { useSelector } from "react-redux";
import VideoRoom from "./VideoRoom";
import VoiceRoom from "./VoiceRoom";

function CallRoom() {
  const { inCall, callType, mediaStream, peerConnection, outgoingCall, incomingCall } =
    useSelector((state) => state.call);

  const targetSocketId = outgoingCall?.socketId || incomingCall?.socketId;

  if (!inCall) return null;

  return (
    <>
      {callType === "video" && (
        <VideoRoom
          toSocketId={targetSocketId}
          localStream={mediaStream}
          remoteStream={peerConnection?.remoteStream} // أو تستخرجها من peer مباشرة
        />
      )}

      {callType === "voice" && (
        <VoiceRoom
          toSocketId={targetSocketId}
        />
      )}
    </>
  );
}

export default CallRoom;
