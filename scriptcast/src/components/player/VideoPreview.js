import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import logo from "../../images/ScriptCastLogo.png";
import { FaImages } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { renderVideoThunk } from "../../thunk/thunk";

const VideoPreview = forwardRef(
  ({ script, audioArray, onDownloadClicked }, ref) => {
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
      <StyledContainer>
        <div className="VideoPreview">
          <div>
            <canvas ref={canvas} width={640} height={360}></canvas>
          </div>
        </div>
        <RawFolder script={script} onDownloadClicked={onDownloadClicked} />
      </StyledContainer>
    );
  }
);

const RawFolder = forwardRef(({ script, onDownloadClicked }, ref) => {
  const [rawImages, setRawImages] = useState([]);
  const RenderCanvas = useRef(document.createElement("canvas"));
  const imagesContainer = useRef();

  useImperativeHandle(ref, () => ({
    setRawImages,
  }));
  useEffect(() => {
    RenderCanvas.current.width = 640;
    RenderCanvas.current.height = 360;
    const raw = [];
    script.lines.map((scene, i) => {
      const { bgcolor, fontcolor, font, text, position } = scene.edits;
      fillBackground(bgcolor);
      writeText(fontcolor, font, text, position);
      raw[i] = RenderCanvas.current.toDataURL("image/png");
    });

    setRawImages(raw);
  }, [script]);

  const fillBackground = (bgcolor) => {
    const ctx = RenderCanvas.current.getContext("2d");
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, RenderCanvas.current.width, RenderCanvas.current.height);
  };
  const writeText = (fontcolor, font, text, position) => {
    const ctx = RenderCanvas.current.getContext("2d");
    ctx.fillStyle = fontcolor;
    ctx.font = font;
    ctx.fillText(text, position.x, position.y);
  };
  return (
    <div>
      <div className="previewBtns">
        <div
          className="RawFolder"
          onClick={() => {
            imagesContainer.current.style.display === "none"
              ? (imagesContainer.current.style.display = "block")
              : (imagesContainer.current.style.display = "none");
          }}
        >
          <FaImages size={30} />
        </div>
        <div
          onClick={() => {
            onDownloadClicked(rawImages, { hi: "hello" });
            console.log(rawImages);
          }}
        >
          <IoIosSave size={30} />
        </div>
      </div>

      <RawFolderStyled ref={imagesContainer}>
        <div className="Images">
          {rawImages.map((rawImage, i) => {
            return <img key={i} src={rawImage} alt="imageObject" />;
          })}
        </div>
      </RawFolderStyled>
    </div>
  );
});
const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onDownloadClicked: (images, config) =>
    dispatch(renderVideoThunk(images, config)),
});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoPreview);

const StyledContainer = styled.div`
  .RawFolder {
    position: relative;
  }
  .previewBtns {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
`;

const RawFolderStyled = styled.div`
  position: relative;
  display: none;
  .Images {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;
