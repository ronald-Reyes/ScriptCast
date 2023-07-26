import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateEditsThunk } from "../../thunk/thunk";

const SceneEditor = forwardRef(
  ({ audioArray, script, VideoPreviewer, onSubmitEdits }, ref) => {
    const [initialEdits, setInitialEdits] = useState({});

    const [currentSceneIndex, setCurrentSceneIndex] = useState();

    useImperativeHandle(ref, () => ({
      setCurrentSceneIndex,
    }));
    useEffect(() => {
      if (initialEdits) {
        VideoPreviewer.current.handleNextFrame(initialEdits);
        console.log(initialEdits);
      }
    }, [initialEdits]);
    useEffect(() => {
      if (currentSceneIndex != null) {
        setInitialEdits(script.lines[currentSceneIndex].edits);
      }
    }, [currentSceneIndex]);
    const handleSubmit = (e) => {
      e.preventDefault();

      const dummyLine = script.lines[currentSceneIndex];
      dummyLine.edits = initialEdits;

      onSubmitEdits(script._id, currentSceneIndex, dummyLine);
    };
    const handleChange = (e) => {
      if (e.target.name === "x" || e.target.name === "y") {
        initialEdits.position[e.target.name] = Number(e.target.value);
        setInitialEdits({
          ...initialEdits,
          [e.target.name]: e.target.value,
        });
      } else {
        setInitialEdits({
          ...initialEdits,
          [e.target.name]: e.target.value,
        });
      }
    };
    return (
      <StyledContainer>
        {currentSceneIndex != null && (
          <form className="SceneEditor" onSubmit={handleSubmit}>
            <h2 className="title">Scene {currentSceneIndex}</h2>
            <div>
              <label>Background Color:</label>
              <input
                type="color"
                name="bgcolor"
                value={initialEdits.bgcolor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Text:</label>
              <input
                type="input"
                name="text"
                value={initialEdits.text}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Font Style:</label>
              <input
                type="input"
                name="font"
                value={initialEdits.font}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Font Color:</label>
              <input
                type="color"
                name="fontcolor"
                value={initialEdits.fontcolor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Position:{"("}</label>
              <input
                type="number"
                name="x"
                defaultValue={320}
                onChange={handleChange}
              />
              ,
              <input
                type="number"
                name="y"
                defaultValue={180}
                onChange={handleChange}
              />
              {")"}
            </div>
            <button type="Submit">Save</button>
          </form>
        )}
      </StyledContainer>
    );
  }
);
const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onSubmitEdits: (_id, index, line) =>
    dispatch(updateEditsThunk(_id, index, line)),
});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(SceneEditor);

const StyledContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);

  .SceneEditor {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 20px;
  }

  .title {
    text-align: center;
    margin-top: 0;
  }
`;
