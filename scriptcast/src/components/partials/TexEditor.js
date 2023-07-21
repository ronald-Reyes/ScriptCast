import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { BiFileBlank } from "react-icons/bi";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { SlPencil } from "react-icons/sl";
import { BsMicMute } from "react-icons/bs";

import STT from "./STT";

import {
  updateScriptLineThunk,
  updateCasterThunk,
  addScriptLineThunk,
  deleteAllLinesThunk,
  deleteScriptLineThunk,
  updateScriptTitleThunk,
  fetchScriptThunk,
} from "../../thunk/thunk";

const TextEditor = forwardRef(
  (
    {
      script,
      onCasterUpdate,
      onUpdateScriptLine,
      onAddScriptLine,
      onDeleteAllLines,
      onDeleteScriptLine,
      onUpdateScriptTitle,
      currentUser,
      onFetchScript,
      wordCounter,
    },
    ref
  ) => {
    const navigate = useNavigate();
    const params = useParams();
    const lineBtns = useRef([]);
    const SST = useRef();
    const isListening = useRef();
    const selectedLineElement = useRef();
    const selectedIndex = useRef();
    const prevText = useRef("");

    useEffect(() => {
      if (!currentUser) return navigate("/login");

      const projectId = params.projectId;
      onFetchScript(currentUser._id, projectId);
    }, []);

    const count = wordCounter;
    useImperativeHandle(ref, () => ({
      stopPlayer() {
        clearInterval(myInterval);
        isPlaying = false;
        showLayer2();
        console.log(`Last Count: ${count.current}`);
      },
      handlePlayBtn(startCount, time = 500) {
        stopPlayer();
        isPlaying = true;
        removeAllMarks();
        removeCurrentHighLight();
        showLayer1();

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
            removeCurrentHighLight();
            stopPlayer();
            count.current = 0;
          }
        }, time);
      },
    }));
    //Main Variables
    const isEditing = useRef(false);
    const lineElements = useRef([]);
    const casterElements = useRef([]);
    const spanTextElements = useRef({});
    const title = useRef();

    //helper variables

    let myInterval;
    let isPlaying = false;
    const Layers = useRef([]);

    //Player Button Functions
    const stopPlayer = () => {
      clearInterval(myInterval);
      isPlaying = false;
      showLayer2();
      console.log(`Last Count: ${count.current}`);
    };
    //
    const WordsSeparator = ({ type, line = "", index }) => {
      const wordsArr = line.split(" ");
      return (
        <div>
          {wordsArr.map((word, i) => (
            <span
              className={`textElement ${type}`}
              ref={(el) => {
                spanTextElements.current["" + index + i] = el;
              }}
              key={i}
            >
              {word + " "}
            </span>
          ))}
        </div>
      );
    };
    const removeAllMarks = () => {
      const orderedTextElements = document.querySelectorAll(
        ".scriptContainer .textElement.Layer2"
      );
      orderedTextElements.forEach((element) => {
        element.classList.remove("mark");
      });
    };
    const removeCurrentHighLight = () => {
      if (count.current !== 0)
        document
          .querySelectorAll(".scriptContainer .textElement.Layer1")
          [count.current - 1].classList.remove("blueHighlight");
    };

    const showLayer1 = () => {
      Layers.current[0].classList.remove("hide");
      Layers.current[1].classList.add("hide");
    };
    const showLayer2 = () => {
      Layers.current[0].classList.add("hide");
      Layers.current[1].classList.remove("hide");
    };
    //Successful thunks
    const handleUpdateCaster = (newCaster, index) => {
      stopPlayer();
      onCasterUpdate(script._id, newCaster, index);
    };
    const handleUpdateScriptLine = (i, line) => {
      stopPlayer();
      onUpdateScriptLine(script._id, i, line);
      //Rerenders page
    };
    const handleDeleteAllLines = () => {
      stopPlayer();
      count.current = 0;
      onDeleteAllLines(script._id);
    };
    const handleDeleteLine = (index) => {
      stopPlayer();
      count.current = 0;
      onDeleteScriptLine(script._id, index);
    };
    const handleAddLineToLast = () => {
      stopPlayer();
      onAddScriptLine(script._id, script.lines.length);
      //Rerenders page
    };
    const handeInsertLine = (index) => {
      stopPlayer();
      onAddScriptLine(script._id, index - 1);
    };
    return (
      <>
        <StyleContainer>
          <div className="mainContainer">
            <div className="scriptHeader">
              <div>
                <SlPencil />

                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  ref={(el) => {
                    title.current = el;
                  }}
                  onBlur={() => {
                    onUpdateScriptTitle(script._id, title.current.innerText);
                  }}
                >
                  {script.title}
                </p>
              </div>
              <div>
                <STT
                  SST={SST}
                  isListening={isListening}
                  selected={selectedLineElement}
                  selectedIndex={selectedIndex}
                  prevText={prevText}
                />
                <button className="removeAllBtn" onClick={handleDeleteAllLines}>
                  <BiFileBlank size={20} color="black" opacity={1} />
                </button>
              </div>
            </div>

            <div className="textEditorContainer">
              <div
                className="scriptContainer  hide"
                ref={(el) => {
                  Layers.current.push(el);
                }}
              >
                {script.lines.map((item, i) => (
                  <div key={i} className="lineContainer">
                    <div className="lineCaster">
                      <h4>{script.lines[i].caster}</h4>
                    </div>
                    <div className="individualLine">
                      <WordsSeparator
                        key={i}
                        line={item.line}
                        index={i}
                        type="Layer1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="scriptContainer"
                ref={(el) => {
                  Layers.current.push(el);
                }}
              >
                {script.lines.map((item, i) => (
                  <div
                    key={i}
                    className="lineContainer"
                    onMouseOver={() => {
                      lineBtns.current[i].style.display = "block";
                    }}
                    onMouseLeave={() => {
                      lineBtns.current[i].style.display = "none";
                    }}
                  >
                    <div className="lineCaster">
                      <h4
                        ref={(el) => {
                          casterElements.current[i] = el;
                        }}
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onFocus={() => {
                          isEditing.current = true;
                          showLayer1();
                          stopPlayer();
                        }}
                        onBlur={() => {
                          isEditing.current = false;

                          showLayer1();
                          handleUpdateCaster(
                            casterElements.current[i].innerText,
                            i
                          );
                        }}
                      >
                        {item.caster}
                      </h4>
                      <div
                        className="lineBtnsContainer"
                        ref={(el) => {
                          lineBtns.current[i] = el;
                        }}
                      >
                        <button
                          className="micOn-Off"
                          onClick={() => {
                            prevText.current =
                              lineElements.current[i].innerText;
                            isListening.current
                              ? SST.current.stopListening()
                              : SST.current.startListening();
                            selectedIndex.current = i;
                            selectedLineElement.current =
                              lineElements.current[i];
                          }}
                        >
                          <BsMicMute size={20} color="black" />
                        </button>
                        <button
                          className="insertLineBtn"
                          onClick={() => {
                            handeInsertLine(i);
                          }}
                        >
                          <IoIosAddCircle
                            size={20}
                            color="blue"
                            opacity={0.8}
                          />
                        </button>
                        <button
                          className="removeLineBtn"
                          onClick={() => {
                            handleDeleteLine(i);
                          }}
                        >
                          <IoIosRemoveCircleOutline
                            size={20}
                            color="black"
                            opacity={0.8}
                          />
                        </button>
                      </div>
                    </div>
                    <div
                      className="individualLine"
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      ref={(el) => (lineElements.current[i] = el)}
                      onFocus={() => {
                        isEditing.current = true;
                        showLayer1();

                        stopPlayer();
                      }}
                      onBlur={() => {
                        isEditing.current = false;
                        showLayer1();

                        handleUpdateScriptLine(
                          i,
                          lineElements.current[i].innerText
                        );
                      }}
                    >
                      <WordsSeparator
                        key={i}
                        line={item.line}
                        index={i}
                        type="Layer2"
                      />
                    </div>
                  </div>
                ))}
                <div className="addLineBtn" onClick={handleAddLineToLast}>
                  <span>+</span>
                  <span>Add Line</span>
                </div>
              </div>
            </div>
          </div>
        </StyleContainer>
      </>
    );
  }
);

const mapStateToProps = (state) => ({
  script: state.script,
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onFetchScript: (userId, projectId) =>
    dispatch(fetchScriptThunk(userId, projectId)),
  onCasterUpdate: (_id, newCaster, index) =>
    dispatch(updateCasterThunk(_id, newCaster, index)),
  onUpdateScriptLine: (_id, index, line) =>
    dispatch(updateScriptLineThunk(_id, index, line)),
  onAddScriptLine: (_id, index) => {
    dispatch(addScriptLineThunk(_id, index));
  },
  onDeleteAllLines: (_id) => dispatch(deleteAllLinesThunk(_id)),
  onDeleteScriptLine: (_id, index) =>
    dispatch(deleteScriptLineThunk(_id, index)),
  onUpdateScriptTitle: (_id, newTitle) =>
    dispatch(updateScriptTitleThunk(_id, newTitle)),
});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TextEditor);

const StyleContainer = styled.div`
  position: relative;
  width: 700px;
  box-sizing: border-box;
  padding: 20px;
  padding-top: 0;
  padding-bottom: 200px;
  .scriptHeader {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid darkgray;
    margin-bottom: 20px;
    p {
      margin: none;
      font-size: 1.3rem;
      display: inline-block;
      padding-right: 20px;
      padding-left: 10px;
    }
  }
  .lineCaster {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      margin: 0;
      padding: 10px;
      padding-right: 20px;
      font-weight: lighter;
    }
  }
  .individualLine {
    padding: 20px;
    display: flex;
    justify-content: space-between;
  }
  button {
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .scriptContainer {
    height: 400px;
    overflow-y: scroll;
    border: 0.5px solid darkgray;
  }
  .scriptContainer.hide {
    display: none;
  }
  .lineContainer {
    margin-bottom: 20px;
  }
  .lineBtnsContainer {
    display: none;
  }
  .textElement.mark {
    background-color: rgb(240, 230, 140);
  }
  .textElement.blueHighlight {
    background-color: blue;
    padding: 5px;
    border-radius: 8px;
  }
  .addLineBtn {
    text-align: center;
    cursor: pointer;
  }
  [contentEditable]:focus {
    border-radius: 10px;
    outline: none;
  }
`;
