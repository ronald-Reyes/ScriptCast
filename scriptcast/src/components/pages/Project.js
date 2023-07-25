import React, { useRef } from "react";
import TexEditor from "../partials/TexEditor";
import styled from "styled-components";
import Header from "../partials/header";
import Player from "../player/Player";
import TTS from "../player/TTS";
import UploadFolder from "../partials/UploadFolder";
import AudioRecorderPanel from "../player/AudioRecorder";

export const PROJECT_PAGE = "PROJECT_PAGE";

export default function Project() {
  const textEditorRef = useRef();
  const playerRef = useRef();
  const wordCounter = useRef(0);
  const Panels = useRef([]);

  const TTSRef = useRef();
  return (
    <div
      onClick={() => {
        Panels.current[0].style.display = "none";
        Panels.current[1].style.display = "none";
        Panels.current[2].style.display = "none";
      }}
    >
      <Header type={PROJECT_PAGE} Panels={Panels} />
      <TTSStyledContainer
        ref={(el) => {
          Panels.current[0] = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <TTS ref={TTSRef} />
      </TTSStyledContainer>
      <RecorderStyledContainer
        ref={(el) => {
          Panels.current[1] = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AudioRecorderPanel />
      </RecorderStyledContainer>
      <UploaderStyledContainer
        ref={(el) => {
          Panels.current[2] = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <UploadFolder />
      </UploaderStyledContainer>
      <TextEditorStyledContainer>
        <TexEditor
          ref={textEditorRef}
          wordCounter={wordCounter}
          playerRef={playerRef}
          TTSRef={TTSRef}
        />
      </TextEditorStyledContainer>
      <PlayerControlStyledContainer>
        <Player
          ref={playerRef}
          wordCounter={wordCounter}
          textEditorRef={textEditorRef}
        />
      </PlayerControlStyledContainer>
    </div>
  );
}

const PlayerControlStyledContainer = styled.div`
  .PlayerUI {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;

const TextEditorStyledContainer = styled.div`
  width: 500px;
`;

const TTSStyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  display: none;
`;

const UploaderStyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  display: none;
`;
const RecorderStyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  display: none;
`;
