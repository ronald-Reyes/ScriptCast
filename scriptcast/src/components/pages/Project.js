import React, { useRef, useEffect } from "react";
import TexEditor from "../partials/TexEditor";
import styled from "styled-components";
import Header from "../partials/header";
import Player from "../player/Player";
import TTS from "../player/TTS";
import UploadFolder from "../partials/UploadFolder";
import AudioRecorderPanel from "../player/AudioRecorder";
import VideoPreview from "../player/VideoPreview";
import SceneEditor from "../partials/SceneEditor";
import AudioEditor from "../partials/AudioEditor";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";
import { undoRedoThunk } from "../../thunk/thunk";
export const PROJECT_PAGE = "PROJECT_PAGE";

function Project({ onUndo, onRedo, script, undoRedo }) {
  const textEditorRef = useRef();
  const playerRef = useRef();
  const SceneEditorRef = useRef();
  const AudioEditorRef = useRef();
  const TTSRef = useRef();
  const VideoPreviewer = useRef();
  const TimeRef = useRef();
  const wordCounter = useRef(0);
  const Panels = useRef([]);
  const currentSceneIndex = useRef();
  const rawImagesRef = useRef();

  //Resizer is used to resize the dividing panels from the project page, horizontal resizer and resizer for the timeline at the bottom
  const resizer = useRef();
  let x = 0;
  let y = 0;
  let textEditorWidth = 0;
  let textEditorElem = null;
  let bottomPanelHeight = 0;
  let bottomPanelElem = null;

  useEffect(() => {
    const saveToDb = (type) => {
      toast.info(type, {
        ...toastOptions,
        autoClose: 500,
      });
      undoRedo();
    };
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        onUndo();
        saveToDb("Undo");
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Z") {
        onRedo();
        saveToDb("Redo");
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [onRedo, onUndo]);

  const Resizer = ({ type }) => {
    return (
      <div
        className={`resizer ${type}`}
        direction={type}
        ref={resizer}
        onClick={() => {}}
        onMouseDown={(e) => {
          if (type === "horizontal") {
            resizer.current = e.target;
            textEditorElem = resizer.current.previousElementSibling;
            x = e.clientX;
            textEditorWidth = textEditorElem.getBoundingClientRect().width;
          } else if (type === "vertical") {
            resizer.current = e.target;
            y = e.clientY;
            bottomPanelHeight =
              resizer.current.parentNode.getBoundingClientRect().height;
            bottomPanelElem = resizer.current.parentNode;
          }
        }}
      ></div>
    );
  };
  return (
    <MainContainer
      onClick={() => {
        Panels.current[0].style.display = "none";
        Panels.current[1].style.display = "none";
        Panels.current[2].style.display = "none";
        Panels.current[3].style.display = "none";
        Panels.current[4].style.display = "none";
      }}
      onMouseMove={(e) => {
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        switch (resizer.current.getAttribute("direction")) {
          case "vertical":
            const h =
              ((bottomPanelHeight - dy) * 100) /
              resizer.current.parentNode.parentNode.getBoundingClientRect()
                .height;
            if (bottomPanelElem)
              resizer.current.parentNode.style.height = `${h}%`;
            break;
          case "horizontal":
          default:
            const newLeftWidth =
              ((textEditorWidth + dx) * 100) /
              resizer.current.parentNode.getBoundingClientRect().width;
            if (textEditorElem) textEditorElem.style.width = `${newLeftWidth}%`;
            break;
        }
      }}
      onMouseUp={(e) => {
        textEditorElem = null;
        bottomPanelElem = null;
      }}
    >
      <div className="TopSection">
        <Header
          type={PROJECT_PAGE}
          Panels={Panels}
          playerRef={playerRef}
          rawImagesRef={rawImagesRef}
        />
        <div
          className="panel TTSContainer"
          ref={(el) => {
            Panels.current[0] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <TTS ref={TTSRef} Panels={Panels} />
        </div>
        <div
          className="panel RecorderContainer"
          ref={(el) => {
            Panels.current[1] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <AudioRecorderPanel Panels={Panels} />
        </div>
        <div
          className="panel UploaderContainer"
          ref={(el) => {
            Panels.current[2] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <UploadFolder Panels={Panels} />
        </div>
        <div
          className="panel SceneEditorContainer"
          ref={(el) => {
            Panels.current[3] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SceneEditor
            ref={SceneEditorRef}
            VideoPreviewer={VideoPreviewer}
            currentSceneIndex={currentSceneIndex}
            Panels={Panels}
          />
        </div>
        <div
          className="panel AudioEditorContainer"
          ref={(el) => {
            Panels.current[4] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <AudioEditor ref={AudioEditorRef} Panels={Panels} />
        </div>
      </div>
      <div className="MainSection">
        <div className="TextEditor">
          <TexEditor
            ref={textEditorRef}
            wordCounter={wordCounter}
            playerRef={playerRef}
            TTSRef={TTSRef}
            Panels={Panels}
          />
        </div>
        <Resizer type="horizontal" />
        <div className="VidePreViewContainer">
          <VideoPreview
            ref={VideoPreviewer}
            playerRef={playerRef}
            rawImagesRef={rawImagesRef}
          />
        </div>
      </div>
      <div className="BottomSection">
        <Resizer type="vertical" />
        <Player
          ref={playerRef}
          wordCounter={wordCounter}
          textEditorRef={textEditorRef}
          VideoPreviewer={VideoPreviewer}
          Panels={Panels}
          SceneEditorRef={SceneEditorRef}
          currentSceneIndex={currentSceneIndex}
          AudioEditorRef={AudioEditorRef}
          TimeRef={TimeRef}
        />
      </div>
      <ToastContainer />
    </MainContainer>
  );
}
const mapStateToProps = (state) => ({
  script: state.script.present,
});
const mapDispatchToProps = (dispatch) => ({
  onUndo: () => dispatch(UndoActionCreators.undo()),
  onRedo: () => dispatch(UndoActionCreators.redo()),
  undoRedo: () => dispatch(undoRedoThunk()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Project);
const MainContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  .TopSection {
    .panel {
      position: relative;
      display: flex;
      justify-content: center;
      display: none;
      &.TTSContainer {
        display: flex;
      }
      &.SceneEditorContainer {
        justify-content: left;
      }
      &.AudioEditorContainer {
        justify-content: left;
      }
    }
  }
  .MainSection {
    position: relative;
    display: flex;

    .TextEditor {
      width: 50%;
      min-width: 20%;
      resize: horizontal;
    }
    .VidePreViewContainer {
      flex-grow: 1;
      background: grey;
      display: flex;
      justify-content: center;
      .VideoPreview {
        margin-top: 90px;
      }
    }
  }
  .BottomSection {
    position: fixed;
    bottom: 0;
    left: 5%;
    width: 90vw;
    height: 15%;
    min-height: 10%;
    overflow-y: hidden;
    overflow-x: hidden;
    background: white;
    box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);
  }
  .resizer.horizontal {
    width: 5px;
    height: 100%;
    &:hover {
      cursor: col-resize;
    }
  }
  .resizer.vertical {
    width: 100%;
    height: 10px;
    background: #2196f3;
    display: hidden;
    &:hover {
      cursor: row-resize;
    }
  }
`;
