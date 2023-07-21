import React, { useRef } from "react";
import TexEditor from "../partials/TexEditor";
import styled from "styled-components";
import Header from "../partials/header";

export const PROJECT_PAGE = "PROJECT_PAGE";

export default function Project() {
  const textEditor = useRef();
  const wordCounter = useRef(0);
  return (
    <div>
      <Header type={PROJECT_PAGE} />
      <TextEditorStyledContainer>
        <TexEditor ref={textEditor} wordCounter={wordCounter} />
      </TextEditorStyledContainer>
      <PlayerControlStyledContainer>
        <div className="PlayerUI">
          <button
            onClick={() => {
              textEditor.current.stopPlayer();
            }}
          >
            Stop
          </button>
          <button
            onClick={() => {
              textEditor.current.handlePlayBtn(0, 500);
            }}
          >
            start
          </button>
          <button
            onClick={() => {
              textEditor.current.handlePlayBtn(wordCounter.current, 500);
            }}
          >
            continue
          </button>
        </div>
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
