import React, { useState } from "react";

function TextShowMore({ text, wordLimit = 10 }) {
  const [expanded, setExpanded] = useState(false);

  if (!(text.split(" ").length > wordLimit)) 
    return <span>{text}</span>;

  return (
    <span>
      {expanded ? (
        <>
          {text}{" "}
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-600 underline cursor-pointer"
          >
            show less
          </button>
        </>
      ) : (
        <>
          {text.split(" ").slice(0, wordLimit).join(" ")}...{" "}
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 underline cursor-pointer"
          >
            show more
          </button>
        </>
      )}
    </span>
  );
}

export default TextShowMore;
