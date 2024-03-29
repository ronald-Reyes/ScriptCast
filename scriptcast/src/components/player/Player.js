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
import { IoIosAddCircle } from "react-icons/io";
import { BsPlayFill } from "react-icons/bs";
import { BsFillStopFill } from "react-icons/bs";
import { deleteAudioThunk } from "../../thunk/thunk";
import Time from "./Time";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";

const Player = forwardRef(
  (
    {
      script,
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
    let highlightInterval;

    useImperativeHandle(ref, () => ({
      stopPlayer,
    }));

    const stopPlayer = () => {
      stopHighlight();
      TimeRef.current.timerStop();
    };

    function handlePlayHighlights(startCount, time = 500, lineIndex) {
      stopHighlight();
      textEditorRef.current.showLayer1();
      //Removes all marks and hightlights
      const allWords = document.querySelectorAll(
        ".scriptContainer .textElement.Layer1"
      );
      allWords.forEach((element) => {
        element.classList.remove("mark");
        element.classList.remove("blueHighlight");
      });
      const selectedLineWordElements = document.querySelectorAll(
        `.scriptContainer .textElement.Layer1.line${lineIndex}`
      );
      const totalWords = selectedLineWordElements.length;
      count.current = startCount;

      highlightInterval = setInterval(() => {
        selectedLineWordElements[count.current].classList.add("blueHighlight");
        if (count.current !== 0)
          selectedLineWordElements[count.current - 1].classList.remove(
            "blueHighlight"
          );

        count.current++;
        if (count.current >= totalWords) {
          stopHighlight();
          count.current = 0;
        }
      }, time / totalWords);
    }

    function stopHighlight() {
      clearInterval(highlightInterval);
      textEditorRef.current.showLayer2();
    }

    return (
      <StyledContainer>
        <Time
          ref={TimeRef}
          VideoPreviewer={VideoPreviewer}
          handlePlayHighlights={handlePlayHighlights}
        />
        <div className="PlayerBtns">
          <button onClick={stopPlayer}>
            <MdStop size={20} />
          </button>
          <button
            onClick={() => {
              if (script.lines.length === 0)
                return toast.error("No Scenes To Play", toastOptions);
              handlePlayHighlights(0, script.lines[0].edits.duration, 0);
              TimeRef.current.timerPlay();
            }}
          >
            <VscDebugStart size={20} />
          </button>
          <button onClick={() => {}}>
            <VscDebugContinueSmall size={20} />
          </button>
        </div>
        <TimeLineConnect
          VideoPreviewer={VideoPreviewer}
          Panels={Panels}
          currentSceneIndex={currentSceneIndex}
          SceneEditorRef={SceneEditorRef}
          AudioEditorRef={AudioEditorRef}
          stopPlayer={stopPlayer}
          textEditorRef={textEditorRef}
        />
      </StyledContainer>
    );
  }
);

const mapStateToProps = (state) => ({
  script: state.script.present,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onDeleteClicked: (_id, index) =>
    dispatch(deleteAudioThunk(_id, index, toast)),
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
  textEditorRef,
  AudioEditorRef,
  onDeleteClicked,
  stopPlayer,
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
    stopPlayer();
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
    stopPlayer();
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IoIosAddCircle
                  size={20}
                  color="blue"
                  opacity={0.8}
                  onClick={() => {
                    textEditorRef.current.handeInsertLine(i);
                  }}
                />

                <IoIosRemoveCircleOutline
                  size={20}
                  color="black"
                  opacity={0.8}
                  onClick={() => {
                    textEditorRef.current.handleDeleteLine(i);
                  }}
                />
              </div>
              <span>{Math.round(line.edits.duration / 1000)} sec</span>
            </div>
          ))}
          <div
            className="lineStrip"
            onClick={(e) => {
              stopPlayer();
              e.stopPropagation();
              textEditorRef.current.handleAddLineToLast();
            }}
          >
            <IoIosAdd size={30} />
          </div>
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <BsPlayFill
                  onClick={() => {
                    handleClick(audio);
                    stopPlayer();
                  }}
                />
                <BsFillStopFill
                  onClick={() => {
                    handleClick(audio);
                    stopPlayer();
                  }}
                />
                <IoIosRemoveCircleOutline
                  onClick={(e) => {
                    onDeleteClicked(audio._id, i);
                    stopPlayer();
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
              stopPlayer();
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
      <ToastContainer />
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
    background: #2196f3;
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
