import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

export const WaveVoice = ({ stop }) => {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const recordPluginRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wave = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#qsdd",
      cursorColor: "#333",
    });

    const recordPlugin = RecordPlugin.create({
      bufferSize: 4096,
      numberOfInputChannels: 1,
      numberOfOutputChannels: 1,
      scrollingWaveform: true,
    });

    wave.registerPlugin(recordPlugin);

    recordPluginRef.current = recordPlugin;

    recordPlugin.startMic();

    waveRef.current = wave;

    return () => {
      if (recordPluginRef.current && recordPluginRef.current.mediaStream) {
        recordPluginRef.current.stopMic();
      }
      wave.destroy();
    };
  }, []);

  useEffect(() => {
  if (stop && recordPluginRef.current) {
    recordPluginRef.current.stopMic();
    waveRef.current?.destroy();
  }
}, [stop]);

  return (
    <div className="w-full bg-gray-100 rounded overflow-hidden">
      <div ref={containerRef} className="w-full h-24" />
    </div>
  );
};
