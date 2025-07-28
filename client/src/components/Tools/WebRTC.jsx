import { useRef } from "react";

export default function WebRTC({ onStream, onClose }) {
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };

  const createPeer = async (isInitiator, socket, remoteSocketId) => {
    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.ontrack = (event) => {
      remoteStream.current.addTrack(event.track);
      if (onStream) onStream(remoteStream.current);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, localStream.current)
    );

    if (onStream) onStream(localStream.current, true);

    if (isInitiator) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        to: remoteSocketId,
        offer,
      });
    }
  };

  const handleOffer = async (offer, socket, remoteSocketId) => {
    await peerConnection.current.setRemoteDescription(offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", {
      to: remoteSocketId,
      answer,
    });
  };

  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(answer);
  };

  const handleCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (e) {
      console.error("Error adding ICE candidate:", e);
    }
  };

  const close = () => {
    peerConnection.current?.close();
    localStream.current?.getTracks().forEach((track) => track.stop());
    onClose?.();
  };

  return {
    createPeer,
    handleOffer,
    handleAnswer,
    handleCandidate,
    close,
  };
}
