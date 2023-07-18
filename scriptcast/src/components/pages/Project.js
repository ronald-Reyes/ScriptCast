import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

import {
  updateScriptLineThunk,
  updateCasterThunk,
  addScriptLineThunk,
  deleteAllLinesThunk,
  deleteScriptLineThunk,
  updateScriptTitleThunk,
  fetchScriptThunk,
} from "../../thunk/thunk";

function App({
  script,
  onCasterUpdate,
  onUpdateScriptLine,
  onAddScriptLine,
  onDeleteAllLines,
  onDeleteScriptLine,
  onUpdateScriptTitle,
  currentUser,
  onFetchScript,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);
  useEffect(() => {
    if (!currentUser) return navigate("/login");
    onFetchScript(currentUser._id, "64b62da93f00c7429d01f337");
  }, []);
  //Main Variables
  const isEditing = useRef(false);
  const lineElements = useRef([]);
  const casterElements = useRef([]);
  const spanTextElements = useRef({});
  const title = useRef();

  //helper variables
  const textCounter = useRef(0);
  const i = textCounter;
  let myInterval;
  let isPlaying = false;
  const Layers = useRef([]);

  //Player Button Functions
  const handlePlayBtn = (startCount, time = 500) => {
    stopPlayer();
    isPlaying = true;
    removeAllMarks();
    removeCurrentHighLight();
    showLayer1();

    const layer1WordElements = document.querySelectorAll(
      ".scriptContainer .textElement.Layer1"
    );
    const totalWords = layer1WordElements.length;
    console.log(layer1WordElements.length);
    console.log(i.current);
    i.current = startCount;
    //Player has started from 0

    myInterval = setInterval(() => {
      layer1WordElements[i.current].classList.add("blueHighlight");
      if (i.current !== 0)
        layer1WordElements[i.current - 1].classList.remove("blueHighlight");
      i.current++;
      if (i.current >= totalWords) {
        removeCurrentHighLight();
        stopPlayer();
        i.current = 0;
      }
    }, time);
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
    if (i.current !== 0)
      document
        .querySelectorAll(".scriptContainer .textElement.Layer1")
        [i.current - 1].classList.remove("blueHighlight");
  };
  const stopPlayer = () => {
    clearInterval(myInterval);
    isPlaying = false;
    showLayer2();
    console.log(`Last Count: ${i.current}`);
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
    onCasterUpdate(newCaster, index);
  };
  const handleUpdateScriptLine = (i, line) => {
    stopPlayer();
    onUpdateScriptLine(i, line);
    //Rerenders page
  };
  const handleAddLineToLast = () => {
    stopPlayer();
    onAddScriptLine(script.lines.length + 1);
    //Rerenders page
  };
  const handleDeleteAllLines = () => {
    stopPlayer();
    onDeleteAllLines();
  };
  const handleDeleteLine = (index) => {
    stopPlayer();
    onDeleteScriptLine(index);
  };
  const handeInsertLine = (index) => {
    stopPlayer();
    onAddScriptLine(index - 1);
  };
  return (
    <>
      <StyleContainer>
        <div className="buttonsContainer">
          <p
            contentEditable="true"
            suppressContentEditableWarning={true}
            ref={(el) => {
              title.current = el;
            }}
            onBlur={() => {
              onUpdateScriptTitle(title.current.innerText);
            }}
          >
            {script.title}
          </p>
          <button className="removeAllBtn" onClick={handleDeleteAllLines}>
            remove all
          </button>
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
              <div key={i} className="lineContainer">
                <div className="lineBtnsContainer">
                  <button
                    className="removeLineBtn"
                    onClick={() => {
                      handleDeleteLine(i);
                    }}
                  >
                    remove
                  </button>
                  <button
                    className="insertLineBtn"
                    onClick={() => {
                      handeInsertLine(i);
                    }}
                  >
                    insert
                  </button>
                </div>
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
        <div className="PlayerUI">
          <div className="stop" onClick={stopPlayer}>
            <span>-</span>
            <span>Stop</span>
          </div>
          <button
            onClick={() => {
              handlePlayBtn(0, 500);
            }}
          >
            start
          </button>
          <button
            onClick={() => {
              handlePlayBtn(i.current, 500);
            }}
          >
            continue
          </button>
        </div>
      </StyleContainer>
    </>
  );
}

const mapStateToProps = (state) => ({
  script: state.script,
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onFetchScript: (userId, projectId) =>
    dispatch(fetchScriptThunk(userId, projectId)),
  onCasterUpdate: (newCaster, index) =>
    dispatch(updateCasterThunk(newCaster, index)),
  onUpdateScriptLine: (index, line) =>
    dispatch(updateScriptLineThunk(index, line)),
  onAddScriptLine: (index) => {
    dispatch(addScriptLineThunk(index));
  },
  onDeleteAllLines: () => dispatch(deleteAllLinesThunk()),
  onDeleteScriptLine: (index) => dispatch(deleteScriptLineThunk(index)),
  onUpdateScriptTitle: (newTitle) => dispatch(updateScriptTitleThunk(newTitle)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);

const StyleContainer = styled.div`
  position: relative;
  .buttonsContainer {
    position: relative;
    width: 500px;
    p {
      display: inline-block;
      padding: 5px;
    }
    .removeAllBtn {
      position: absolute;
      right: 0;
      color: red;
    }
  }
  .scriptContainer {
    position: absolute;
    padding-bottom: 300px;
    margin-top: 10px;
  }
  .PlayerUI {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  img {
    width: 150px;
    height: 150px;
  }
  .textElement.mark {
    background-color: rgb(240, 230, 140);
  }
  .textElement.blueHighlight {
    background-color: blue;
    padding: 5px;
    border-radius: 8px;
  }
  .individualLine {
    padding: 20px;
    padding-top: 0;
    padding-bottom: 30px;
    width: 500px;
  }
  .lineCaster h4 {
    font-weight: lighter;
    margin: 0;
    padding: 10px;
    display: inline-block;
  }
  .stop {
    cursor: pointer;
  }
  .addLineBtn {
    cursor: pointer;
    margin-top: 50px;
    margin-left: 20px;
  }
  .textElement:hover {
    color: grey;
  }
  .lineBtnsContainer {
    position: absolute;
    right: 0;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .scriptContainer.hide {
    display: none;
  }
  [contenteditable]:focus {
    outline: none;
    border: 0.5px solid blue;
    border-radius: 20px;
  }
`;
