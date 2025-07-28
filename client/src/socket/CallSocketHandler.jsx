import socket from "./socketIO";

let peer = null;
let localStream = null;

export const createPeerConnection = ({ toSocketId, callType, dispatch }) => {
  peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", {
        to: toSocketId,
        candidate: event.candidate,
      });
    }
  };

  peer.ontrack = (event) => {
    const remoteStream = event.streams[0];
    dispatch({
      type: "CALL_ACCEPTED",
      payload: {
        peerConnection: peer,
        mediaStream: localStream,
        remoteStream,
      },
    });
  };

  return peer;
};

export const startCall = async ({ toSocketId, callType, dispatch }) => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: callType === "video",
    audio: true,
  });

  const peer = createPeerConnection({ toSocketId, callType, dispatch });

  localStream.getTracks().forEach((track) =>
    peer.addTrack(track, localStream)
  );

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  socket.emit("sendOffer", {
    to: toSocketId,
    offer,
    type: callType,
  });

  dispatch({
    type: "ACCEPT_CALL",
    payload: { peerConnection: peer, mediaStream: localStream },
  });
};

export const handleIncomingOffer = async ({ from, offer, type, dispatch }) => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: type === "video",
    audio: true,
  });

  peer = createPeerConnection({ toSocketId: from, callType: type, dispatch });

  localStream.getTracks().forEach((track) =>
    peer.addTrack(track, localStream)
  );

  await peer.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  socket.emit("sendAnswer", {
    to: from,
    answer,
  });

  dispatch({
    type: "ACCEPT_CALL",
    payload: { peerConnection: peer, mediaStream: localStream },
  });
};

export const handleAnswer = async (answer) => {
  if (peer) {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  }
};

export const handleIceCandidate = async (candidate) => {
  if (peer) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
};

export const endCall = (dispatch) => {
  if (peer) peer.close();
  if (localStream)
    localStream.getTracks().forEach((track) => track.stop());

  peer = null;
  localStream = null;

  dispatch({ type: "END_CALL" });
};
