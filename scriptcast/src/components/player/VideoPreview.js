import React, { useRef, useEffect } from "react";

export default function VideoPreview() {
  const canvas = useRef();
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.fillText(
      "Text",
      canvas.current.width / 2 - 17,
      canvas.current.height / 2 + 8
    );
  }, []);
  const handleNextFrame = () => {};
  return (
    <div className="VideoPreview">
      <div>
        <canvas ref={canvas} width={500} height={250}></canvas>
      </div>
      <button onClick={handleNextFrame}>Play</button>
      <button>Stop</button>
    </div>
  );
}
