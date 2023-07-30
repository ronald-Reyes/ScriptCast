//Code Reviewed
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
import { useNavigate, useParams } from "react-router-dom";
const MAIN_CANVAS = "MAIN_CANVAS";
const RAW_FOLDER_CANVAS = "RAW_FOLDER_CANVAS";

//VideoPreview Component
const VideoPreview = forwardRef(
  ({ script, audioArray, onDownloadClicked }, ref) => {
    const canvas = useRef();
    const frameCount = useRef(0);
    const lastFrame = useRef();
    const rawFolderCanvasRef = useRef();

    //Method that is used outside this component
    useImperativeHandle(ref, () => ({
      handleNextFrame,
    }));

    //Initializes the first frame of video previewer, it is the scripcast logo
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
        lastFrame.current = canvas.current.toDataURL("image/png");
      };
    }, []);

    //This method changes the current frame by filling the whole canvas and adding the text
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

    const fillBackground = (color, type = MAIN_CANVAS) => {
      let ctx;
      if (type === MAIN_CANVAS) ctx = canvas.current.getContext("2d");
      else if (type === RAW_FOLDER_CANVAS)
        ctx = rawFolderCanvasRef.current.getContext("2d");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    };

    const writeText = (fontcolor, font, text, position, type = MAIN_CANVAS) => {
      let ctx;
      if (type === MAIN_CANVAS) ctx = canvas.current.getContext("2d");
      else if (type === RAW_FOLDER_CANVAS)
        ctx = rawFolderCanvasRef.current.getContext("2d");
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
        <RawFolder
          script={script}
          onDownloadClicked={onDownloadClicked}
          lastFrame={lastFrame}
          audioArray={audioArray}
          fillBackground={fillBackground}
          writeText={writeText}
          rawFolderCanvasRef={rawFolderCanvasRef}
        />
      </StyledContainer>
    );
  }
);
const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onDownloadClicked: (images, config, navigate) =>
    dispatch(renderVideoThunk(images, config, navigate)),
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
    justify-content: center;
    gap: 5px;
    cursor: pointer;
  }
  .SpaceBottom {
    width: 100px;
    height: 300px;
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

//RawFolder component
//Contains the raw images
const RawFolder = forwardRef(
  (
    {
      script,
      onDownloadClicked,
      lastFrame,
      audioArray,
      fillBackground,
      writeText,
      rawFolderCanvasRef,
    },
    ref
  ) => {
    const [rawImages, setRawImages] = useState([]);
    const RenderCanvas = useRef(document.createElement("canvas"));
    rawFolderCanvasRef.current = RenderCanvas.current;
    const imagesContainer = useRef();
    const params = useParams();
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      setRawImages,
    }));

    //sets the raw images when there are changes in the script state
    useEffect(() => {
      RenderCanvas.current.width = 640;
      RenderCanvas.current.height = 360;
      const raw = [];
      script.lines.map((scene, i) => {
        const { bgcolor, fontcolor, font, text, position } = scene.edits;
        fillBackground(bgcolor, RAW_FOLDER_CANVAS);
        writeText(fontcolor, font, text, position, RAW_FOLDER_CANVAS);
        raw[i] = RenderCanvas.current.toDataURL("image/png");
      });
      raw.push(lastFrame.current);
      setRawImages(raw);
    }, [script]);

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
              onDownloadClicked(
                rawImages,
                {
                  projectId: params.projectId,
                  script,
                  audioArray,
                },
                navigate
              );
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
          <div className="SpaceBottom"></div>
        </RawFolderStyled>
      </div>
    );
  }
);
