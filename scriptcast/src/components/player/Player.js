//needs refractoring
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { VscDebugStart, VscDebugContinueSmall } from "react-icons/vsc";
import { MdStop } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BsPlayFill } from "react-icons/bs";
import { BsFillStopFill } from "react-icons/bs";
import { deleteAudioThunk } from "../../thunk/thunk";
import Time from "./Time";

const Player = forwardRef(
  (
    {
      textEditorRef,
      wordCounter,
      VideoPreviewer,
      Panels,
      currentSceneIndex,
      SceneEditorRef,
      AudioEditorRef,
      TimeRef,
    },
    ref
  ) => {
    const count = wordCounter;
    let myInterval;

    useImperativeHandle(ref, () => ({
      stopPlayer,
    }));
    function stopPlayer() {
      TimeRef.current.timerStop();
      clearInterval(myInterval);

      textEditorRef.current.showLayer2();
    }
    function handlePlayBtn(startCount, time = 500) {
      stopPlayer();
      TimeRef.current.timerPlay();

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
        <Time ref={TimeRef} VideoPreviewer={VideoPreviewer} />
        <div className="PlayerBtns">
          <button
            onClick={() => {
              stopPlayer();
            }}
          >
            <MdStop size={20} />
          </button>
          <button
            onClick={() => {
              handlePlayBtn(0, 500);
            }}
          >
            <VscDebugStart size={20} />
          </button>
          <button
            onClick={() => {
              handlePlayBtn(wordCounter.current, 500);
            }}
          >
            <VscDebugContinueSmall size={20} />
          </button>
        </div>
        <TimeLineConnect
          VideoPreviewer={VideoPreviewer}
          Panels={Panels}
          currentSceneIndex={currentSceneIndex}
          SceneEditorRef={SceneEditorRef}
          AudioEditorRef={AudioEditorRef}
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
  onDeleteClicked: (_id, index) => dispatch(deleteAudioThunk(_id, index)),
});
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(Player);

//Timeline Component
const TimeLine = ({
  script,
  audioArray,
  VideoPreviewer,
  Panels,
  currentSceneIndex,
  SceneEditorRef,
  AudioEditorRef,
  onDeleteClicked,
}) => {
  const audioSelected = useRef(null);
  const SceneRef = useRef([]);

  //changes the background of the timeline element when script changes
  useEffect(() => {
    SceneRef.current.map((el, i) => {
      if (script.lines[i] !== undefined) {
        if (script.lines[i].edits.bgcolor === "black")
          return (el.style.background = "transparent");
        el.style.background = script.lines[i].edits.bgcolor;
      }
    });
  }, [script]);

  //plays or stops the audio from the timeline
  const handleClick = (audio) => {
    if (audioSelected.current === null) {
      audioSelected.current = new Audio(audio.bin64);
      audioSelected.current.className = "AudioPlayer";
      audioSelected.current.play();
      return;
    }
    audioSelected.current.pause();
    audioSelected.current = null;
  };
  //when a scene in the timeline is selected, panel for scene editor will show, and the video preview changes
  const handleSceneSelect = (e, line, i) => {
    VideoPreviewer.current.handleNextFrame(line.edits);
    e.stopPropagation();
    Panels.current[3].style.display = "flex";
    Panels.current[0].style.display = "none";
    Panels.current[1].style.display = "none";
    Panels.current[2].style.display = "none";
    Panels.current[4].style.display = "none";
    currentSceneIndex.current = i;
    SceneEditorRef.current.setCurrentSceneIndex(i);
  };
  //Whem an audio is selected from timeline, panel will appear
  const handleAudioSelected = (e, i) => {
    e.stopPropagation();
    Panels.current[3].style.display = "none";
    Panels.current[0].style.display = "none";
    Panels.current[1].style.display = "none";
    Panels.current[2].style.display = "none";
    Panels.current[4].style.display = "flex";
    AudioEditorRef.current.setCurrentAudioIndex(i);
  };

  return (
    <StripContainer>
      <div className="Container">
        <section className="linesStrip">
          <span>
            <strong>Scenes</strong>
          </span>
          {script.lines.map((line, i) => (
            <div
              ref={(el) => {
                SceneRef.current[i] = el;
              }}
              key={i}
              className="lineStrip"
              onClick={(e) => {
                handleSceneSelect(e, line, i);
              }}
            >
              <span>{Math.round(line.edits.duration / 1000)} sec</span>
            </div>
          ))}
        </section>
        <section className="audioStrips">
          <span>
            <strong>Audios</strong>
          </span>
          {audioArray.map((audio, i) => (
            <div
              key={i}
              className="audioStrip"
              onClick={(e) => {
                handleAudioSelected(e, i);
              }}
            >
              <div>
                <BsPlayFill
                  onClick={() => {
                    handleClick(audio);
                  }}
                />
                <BsFillStopFill
                  onClick={() => {
                    handleClick(audio);
                  }}
                />
                <IoIosRemoveCircleOutline
                  onClick={(e) => {
                    onDeleteClicked(audio._id, i);
                  }}
                />
              </div>
              <div className="startTime">
                <span>{audio.name}</span>
              </div>
            </div>
          ))}
          <div
            className="audioStrip"
            onClick={(e) => {
              e.stopPropagation();
              Panels.current[3].style.display = "none";
              Panels.current[0].style.display = "none";
              Panels.current[1].style.display = "none";
              Panels.current[2].style.display = "flex";
              Panels.current[4].style.display = "none";
            }}
          >
            <IoIosAdd size={30} />
          </div>
        </section>
        <section className="newStrip"></section>
      </div>
    </StripContainer>
  );
};

const TimeLineConnect = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TimeLine);

const StyledContainer = styled.div`
  .PlayerBtns {
    display: flex;
    justify-content: center;
    padding: 5px;
    border-bottom: 1px solid grey;
    background: rgba(0, 0, 255, 0.5);
  }
  button {
    cursor: pointer;
    border: none;
    background: transparent;
  }
`;
const StripContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  .Container {
    width: 99%;
    overflow-x: scroll;

    .linesStrip {
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      margin-top: 5px;
      border-bottom: 1px solid grey;
      padding-bottom: 5px;
      gap: 5px;
      height: 50px;

      .lineStrip {
        cursor: pointer;
        min-width: 100px;
        max-width: 100px;
        height: 50px;
        resize: none;
        border: 1px solid black;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
    .audioStrips {
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      margin-top: 5px;
      margin-bottom: 5px;
      border-bottom: 1px solid grey;
      padding-bottom: 5px;
      gap: 5px;
      height: 50px;

      .audioStrip {
        //position: absolute;
        background: rgba(255, 140, 0, 0.5);
        cursor: pointer;
        min-width: 100px;
        max-width: 100px;
        height: 50px;
        resize: none;
        border: 1px solid rgba(255, 140, 0, 0.5);
        overflow-x: auto;
        .startTime {
          text-align: center;
        }

        &:last-child {
          border: none;
          min-width: 50px;
          max-width: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    height: 7px;
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: gainsboro;
    border-radius: 7px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 5px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
