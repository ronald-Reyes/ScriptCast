import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import logo from "../../images/ScriptCastLogo.png";

const VideoPreview = forwardRef(({ script, audioArray }, ref) => {
  const canvas = useRef();
  const frameCount = useRef(0);

  useImperativeHandle(ref, () => ({
    handleNextFrame,
  }));

  useEffect(() => {
    const text = "ScriptCast";
    const position = {
      x: canvas.current.width / 2 - 70,
      y: canvas.current.height / 2 + 50,
    };
    handleNextFrame({ text, position });
    const base_image = new Image();
    base_image.src = logo;
    base_image.onload = function () {
      const ctx = canvas.current.getContext("2d");
      ctx.drawImage(base_image, 280, 90, 100, 100);
    };
  }, []);
  const handleNextFrame = ({
    bgcolor = "black",
    fontcolor = "white",
    text = "Write Text",
    position = {
      x: canvas.current.width / 2 - 70,
      y: canvas.current.height / 2,
    },
    font = "30px Arial",
  }) => {
    frameCount.current++;

    fillBackground(bgcolor);
    writeText(fontcolor, font, text, position);
  };
  const fillBackground = (color) => {
    const ctx = canvas.current.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };
  const writeText = (fontcolor, font, text, position) => {
    const ctx = canvas.current.getContext("2d");
    ctx.fillStyle = fontcolor;
    ctx.font = font;
    ctx.fillText(text, position.x, position.y);
  };
  return (
    <div className="VideoPreview">
      <div>
        <canvas ref={canvas} width={640} height={360}></canvas>
      </div>
      <button
        onClick={() => {
          handleNextFrame({});
        }}
      >
        Play
      </button>
      <button>Stop</button>
    </div>
  );
});

const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: (projectId, name, bin64) => dispatch(),
});
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(VideoPreview);
