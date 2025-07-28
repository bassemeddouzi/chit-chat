import React, { useState, useEffect, useRef } from "react";
import { Loader } from "lucide-react";

function MediaLoader({ type, src }) {
  const [loading, setLoading] = useState(true);
  const mediaRef = useRef(null);
    const srcRef = useRef(src);
  useEffect(() => {
    setLoading(true);
    console.log(srcRef.current);
    if (type === "image") {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoading(false);
      img.onerror = () => setLoading(false);
    } else {
      const media = mediaRef.current;
      if (!media) return;

      const onCanPlay = () => setLoading(false);
      const onError = () => setLoading(false);

      media.addEventListener("canplaythrough", onCanPlay);
      media.addEventListener("error", onError);

      media.load();

      return () => {
        media.removeEventListener("canplaythrough", onCanPlay);
        media.removeEventListener("error", onError);
      };
    }
  }, [src, type]);

  if (type === "image") {
    return loading ? (
      <div className="flex justify-center items-center p-2">
        <Loader className="animate-spin text-gray-400 w-5 h-5" />
        <span className="ml-2 text-gray-500 text-sm">Loading image...</span>
      </div>
    ) : (
      <img src={src} alt="media content" className="max-w-full rounded" />
    );
  }

  if (type === "audio") {
    return (
      <div >
        {loading && (
          <div className="flex justify-center items-center p-2">
            <Loader className="animate-spin text-gray-400 w-5 h-5" />
            <span className="ml-2 text-gray-500 text-sm">Loading audio...</span>
          </div>
        )}
        <audio
          ref={mediaRef}
          controls
          className={ loading ? "hidden" : ""}
          preload="auto"
        >
          <source src={src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="w-full">
        {loading && (
          <div className="flex justify-center items-center p-2">
            <Loader className="animate-spin text-gray-400 w-5 h-5" />
            <span className="ml-2 text-gray-500 text-sm">Loading video...</span>
          </div>
        )}
        <video
          ref={mediaRef}
          controls
          className={`w-full rounded ${loading ? "hidden" : ""}`}
          preload="auto"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </div>
    );
  }

  return null;
}

export default MediaLoader;
