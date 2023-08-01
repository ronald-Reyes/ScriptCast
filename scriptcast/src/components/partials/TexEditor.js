//Code Reviewed
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  updateScriptLineThunk,
  updateCasterThunk,
  addScriptLineThunk,
  deleteAllLinesThunk,
  deleteScriptLineThunk,
  updateScriptTitleThunk,
  fetchScriptThunk,
} from "../../thunk/thunk";
import { connect } from "react-redux";
import STT from "../player/STT";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { BiFileBlank } from "react-icons/bi";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { SlPencil } from "react-icons/sl";
import { RiSpeakLine } from "react-icons/ri";

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
      playerRef,
      TTSRef,
      Panels,
    },
    ref
  ) => {
    const navigate = useNavigate();
    const params = useParams();
    const lineBtns = useRef([]);
    const lineElements = useRef([]);
    const casterElements = useRef([]);
    const title = useRef();
    const Layers = useRef([]);
    const count = wordCounter;
    const SST = useRef();
    const isListening = useRef();
    const selectedLineElement = useRef();
    const selectedIndex = useRef();
    const prevText = useRef("");

    useImperativeHandle(ref, () => ({
      // removeAllMarks,
      // removeCurrentHighLight,
      showLayer2,
      showLayer1,
      handleDeleteLine,
      handleAddLineToLast,
      handeInsertLine,
    }));

    //If there is no user yet go back to login page
    useEffect(() => {
      if (!currentUser) return navigate("/login");
      const projectId = params.projectId;
      onFetchScript(currentUser._id, projectId);
    }, []);

    //Logic to separate the script line to words
    const WordsSeparator = ({ type, line = "", index }) => {
      const wordsArr = line.split(" ");
      return (
        <div>
          {wordsArr.map((word, i) => (
            <span className={`textElement ${type} line${index}`} key={i}>
              {word + " "}
            </span>
          ))}
        </div>
      );
    };
    // const removeAllMarks = () => {
    //   const orderedTextElements = document.querySelectorAll(
    //     ".scriptContainer .textElement.Layer2"
    //   );
    //   orderedTextElements.forEach((element) => {
    //     element.classList.remove("mark");
    //   });
    // };
    // const removeCurrentHighLight = () => {
    //   if (count.current !== 0)
    //     document
    //       .querySelectorAll(".scriptContainer .textElement.Layer1")
    //       [count.current - 1].classList.remove("blueHighlight");
    // };

    const showLayer1 = () => {
      Layers.current[0].classList.remove("hide");
      Layers.current[1].classList.add("hide");
    };
    const showLayer2 = () => {
      Layers.current[0].classList.add("hide");
      Layers.current[1].classList.remove("hide");
    };

    //Thunks Handler
    const handleUpdateCaster = (newCaster, index) => {
      onCasterUpdate(script._id, newCaster, index);
    };
    const handleUpdateScriptLine = (i, line) => {
      onUpdateScriptLine(script._id, i, line);
    };
    const handleDeleteAllLines = () => {
      playerRef.current.stopPlayer();
      count.current = 0;
      onDeleteAllLines(script._id);
    };
    const handleDeleteLine = (index) => {
      count.current = 0;
      onDeleteScriptLine(script._id, index);
    };
    const handleAddLineToLast = () => {
      onAddScriptLine(script._id, script.lines.length);
    };
    const handeInsertLine = (index) => {
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
                    playerRef.current.stopPlayer();
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
                    onClick={(e) => {
                      e.stopPropagation();
                      Panels.current[3].style.display = "none";
                      TTSRef.current.setText(lineElements.current[i].innerText);
                    }}
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
                          showLayer2();
                          playerRef.current.stopPlayer();
                          count.current = 0;
                        }}
                        onBlur={() => {
                          showLayer2();
                          handleUpdateCaster(
                            casterElements.current[i].innerText,
                            i
                          );
                          playerRef.current.stopPlayer();
                          count.current = 0;
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
                          <RiSpeakLine size={20} color="black" />
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
                        showLayer2();

                        playerRef.current.stopPlayer();
                      }}
                      onBlur={() => {
                        showLayer2();
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
  script: state.script.present,
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
  width: 100%;
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
    &:hover {
      border: 0.5px solid blue;
    }
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
