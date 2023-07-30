//Code Reviewed
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateEditsThunk } from "../../thunk/thunk";

const SceneEditor = forwardRef(
  ({ script, VideoPreviewer, onSubmitEdits }, ref) => {
    const [initialEdits, setInitialEdits] = useState({});
    const [currentSceneIndex, setCurrentSceneIndex] = useState();

    useImperativeHandle(ref, () => ({
      setCurrentSceneIndex,
    }));

    //Initialiaze initial edits when the current scene index selected changes
    useEffect(() => {
      if (currentSceneIndex != null) {
        setInitialEdits({
          ...script.lines[currentSceneIndex].edits,
          Xposition: script.lines[currentSceneIndex].edits.position.x,
          Yposition: script.lines[currentSceneIndex].edits.position.y,
        });
      }
    }, [currentSceneIndex]);

    //Save the final changes when save button is clicked
    const handleSubmit = (e) => {
      e.preventDefault();

      const dummyLine = script.lines[currentSceneIndex];
      dummyLine.edits = initialEdits;

      onSubmitEdits(script._id, currentSceneIndex, dummyLine);
    };

    //Reflect initial changes in the video preview
    const handleChange = (e) => {
      if (e.target.name === "x" || e.target.name === "y") {
        initialEdits.position[e.target.name] = Number(e.target.value);
        if (e.target.name === "x") {
          setInitialEdits({
            ...initialEdits,
            [e.target.name]: e.target.value,
            Xposition: e.target.value,
          });
        } else {
          setInitialEdits({
            ...initialEdits,
            [e.target.name]: e.target.value,
            Yposition: e.target.value,
          });
        }
      } else if (e.target.name === "duration") {
        setInitialEdits({
          ...initialEdits,
          [e.target.name]: Number(e.target.value),
        });
      } else {
        setInitialEdits({
          ...initialEdits,
          [e.target.name]: e.target.value,
        });
      }
    };
    useEffect(() => {
      if (initialEdits) {
        VideoPreviewer.current.handleNextFrame(initialEdits);
      }
    }, [initialEdits]);

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
              <textarea
                name="text"
                rows="4"
                cols="50"
                value={initialEdits.text}
                onChange={handleChange}
              ></textarea>
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
              <label>Position:{"( X:"}</label>
              <input
                type="number"
                name="x"
                value={initialEdits.Xposition}
                onChange={handleChange}
              />
              , Y:
              <input
                type="number"
                name="y"
                value={initialEdits.Yposition}
                onChange={handleChange}
              />
              {")"}
            </div>
            <div>
              <label>Duration:</label>
              <input
                type="number"
                name="duration"
                value={initialEdits.duration}
                onChange={handleChange}
              />
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
