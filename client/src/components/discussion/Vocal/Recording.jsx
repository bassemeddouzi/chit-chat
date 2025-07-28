import React, { useEffect, useRef, useState } from "react";
// import { WaveVoice } from "../../animation_Instance/wave_voice";

export default function VoiceRecorder({ start, stop, setRecordingVoice,close }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    if (start && !recording) startRecording();
    if (stop && recording) stopRecording();
  }, [start, stop]);

  useEffect(() => {
      if(close) return;
  }, [close]);



  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setRecordingVoice(audioBlob); 
        stopStream();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      startTimer();
    } catch (error) {
      console.error("🎙️ Error accessing mic:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop(); 
    }
    setRecording(false);
    stopTimer();
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

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(14, 5);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* {recording && <WaveVoice />} */}
      {recording && (
        <div className="text-sm text-gray-600 font-mono">
          {formatTime(timer)}
        </div>
      )}
      {!recording && audioURL && (
        <audio
          autoPlay
          controls
          src={audioURL}
          className="w-full rounded border shadow-sm"
        />
      )}
    </div>
  );
}
