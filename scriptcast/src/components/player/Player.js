import React, { useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const Player = forwardRef(
  ({ textEditorRef, wordCounter, script, audioArray }, ref) => {
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
          layer1WordElements[count.current - 1].classList.remove(
            "blueHighlight"
          );
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
        <TimeLine script={script} audioArray={audioArray} />
      </StyledContainer>
    );
  }
);
const TimeLine = ({ script, audioArray }) => {
  console.log(script.lines);
  return (
    <StripContainer>
      <div className="Container">
        <section className="linesStrip">
          {script.lines.map((line, i) => (
            <div key={i} className="lineStrip">
              {line.caster}
            </div>
          ))}
        </section>
        <section className="audioStrips">
          {audioArray.map((audio, i) => (
            <div key={i} className="audioStrip">
              {audio.name}
            </div>
          ))}
        </section>
        <section className="newStrip"></section>
      </div>
    </StripContainer>
  );
};

const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: (projectId, name, bin64) => dispatch(),
});
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(Player);

const StyledContainer = styled.div`
  .PlayerBtns {
    display: flex;
    justify-content: center;
    padding: 5px;
    border-bottom: 1px solid grey;
    background: rgba(255, 140, 0, 0.5);
  }
`;
const StripContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  .Container {
    width: 80%;
    overflow-x: scroll;

    .linesStrip {
      display: flex;
      margin-top: 5px;
      border-bottom: 1px solid blue;
      .lineStrip {
        min-width: 100px;
        max-width: 100px;
        height: 50px;
        resize: none;
        border: 1px solid black;
      }
    }
    .audioStrips {
      display: flex;
      margin-top: 5px;
      margin-bottom: 5px;
      .audioStrip {
        //position: absolute;
        min-width: 100px;
        max-width: 100px;
        height: 50px;
        resize: none;
        border: 1px solid black;
        overflow: hidden;
      }
    }
    &::-webkit-scrollbar {
      height: 7px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: gainsboro;
      border-radius: 7px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 140, 0, 0.5);
      border-radius: 5px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;
