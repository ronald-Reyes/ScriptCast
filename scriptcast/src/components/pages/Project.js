import React, { useRef } from "react";
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

export const PROJECT_PAGE = "PROJECT_PAGE";

let x = 0;
let y = 0;
let textEditorWidth = 0;
let textEditorElem = null;
let bottomPanelHeight = 0;
let bottomPanelElem = null;

export default function Project() {
  const textEditorRef = useRef();
  const playerRef = useRef();
  const wordCounter = useRef(0);
  const Panels = useRef([]);
  const TTSRef = useRef();
  const VideoPreviewer = useRef();
  const SceneEditorRef = useRef();
  const currentSceneIndex = useRef();
  const AudioEditorRef = useRef();

  //needed for resize
  const resizer = useRef();

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
        <Header type={PROJECT_PAGE} Panels={Panels} />
        <div
          className="panel TTSContainer"
          ref={(el) => {
            Panels.current[0] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <TTS ref={TTSRef} />
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
          <AudioRecorderPanel />
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
          <UploadFolder />
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
          <AudioEditor ref={AudioEditorRef} />
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
          <VideoPreview ref={VideoPreviewer} />
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
        />
      </div>
    </MainContainer>
  );
}
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
    height: 20%;
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
    background: rgba(0, 0, 255, 0.5);
    display: hidden;
    &:hover {
      cursor: row-resize;
    }
  }
`;
