import React from "react";

const LongWord = ({ word, letterLimit = 15 }) =>
  word.length > letterLimit ? (
    <span>
      {word.slice(0, letterLimit)}...
    </span>
  ) : (
    <span>{word} </span>
  );

export default LongWord;
