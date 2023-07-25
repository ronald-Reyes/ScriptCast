import React, { useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const Player = forwardRef(({ textEditorRef, wordCounter }, ref) => {
  const count = wordCounter;
  let myInterval;
  let isPlaying = false;
  useImperativeHandle(ref, () => ({
    stopPlayer,
  }));
  function stopPlayer() {
    clearInterval(myInterval);
    isPlaying = false;
    textEditorRef.current.showLayer2();
    console.log(`Last Count: ${count.current}`);
  }
  function handlePlayBtn(startCount, time = 500) {
    stopPlayer();
    isPlaying = true;
    textEditorRef.current.removeAllMarks();
    textEditorRef.current.removeCurrentHighLight();
    textEditorRef.current.showLayer1();

    const layer1WordElements = document.querySelectorAll(
      ".scriptContainer .textElement.Layer1"
    );
    const totalWords = layer1WordElements.length;
    count.current = startCount;
    //Player has started from 0

    myInterval = setInterval(() => {
      layer1WordElements[count.current].classList.add("blueHighlight");
      if (count.current !== 0)
        layer1WordElements[count.current - 1].classList.remove("blueHighlight");
      count.current++;
      if (count.current >= totalWords) {
        textEditorRef.current.removeCurrentHighLight();
        stopPlayer();
        count.current = 0;
      }
    }, time);
  }

  return (
    <StyledContainer>
      <div className="PlayerBtns">
        <button
          onClick={() => {
            stopPlayer();
          }}
        >
          Stop
        </button>
        <button
          onClick={() => {
            handlePlayBtn(0, 500);
          }}
        >
          start
        </button>
        <button
          onClick={() => {
            handlePlayBtn(wordCounter.current, 500);
          }}
        >
          continue
        </button>
      </div>
    </StyledContainer>
  );
});

export default connect(null, null, null, {
  forwardRef: true,
})(Player);

const StyledContainer = styled.div`
  .PlayerBtns {
    display: flex;
    justify-content: center;
    padding: 5px;
    border-bottom: 1px solid grey;
  }
`;
