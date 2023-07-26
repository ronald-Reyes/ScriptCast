import React, { useRef, useEffect } from "react";

export default function VideoPreview() {
  const canvas = useRef();
  const frameCount = useRef(0);
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
  }, []);
  const handleNextFrame = () => {
    frameCount.current++;
    console.log(frameCount.current);
  };
  const WriteText = (text, position = { top: 0, left: 0 }) => {};
  return (
    <div className="VideoPreview">
      <div>
        <canvas ref={canvas} width={640} height={360}></canvas>
      </div>
      <button onClick={handleNextFrame}>Play</button>
      <button>Stop</button>
    </div>
  );
}
