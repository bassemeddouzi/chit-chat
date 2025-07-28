import React, { useEffect, useRef, useState } from "react";

export default function VideoRecorder({ start, stop, setRecordingVideo }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [timer, setTimer] = useState(0);

  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const videoChunksRef = useRef([]);

  // Start/Stop controls based on props
  useEffect(() => {
    if (start && !recording) startRecording();
    if (stop && recording) stopRecording();
  }, [start, stop]);

  // Attach stream to <video> only after it's rendered
  useEffect(() => {
    if (recording && streamRef.current && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = streamRef.current;
      videoPreviewRef.current.play().catch((err) => {
        console.error("🔴 video play() error:", err);
      });
    }
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      videoChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(videoBlob);
        setVideoURL(url);
        setRecordingVideo(videoBlob);
        stopStream();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      startTimer();
    } catch (err) {
      console.error("🎥 Error accessing camera or mic:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setRecording(false);
    stopTimer();
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(14, 5);

  return (
    <div className="flex flex-col items-center space-y-4">
      {recording && (
        <>
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-64 h-40 rounded shadow"
          />
          <div className="text-sm text-gray-600 font-mono">
            {formatTime(timer)}
          </div>
        </>
      )}
      {!recording && videoURL && (
        <video
          controls
          src={videoURL}
          className="w-64 h-40 rounded border shadow"
        />
      )}
    </div>
  );
}
