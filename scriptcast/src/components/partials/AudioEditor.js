//Code Reviewed
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateAudioThunk } from "../../thunk/thunk";
import { IoCloseCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";

const AudioEditor = forwardRef(({ audioArray, onSubmitEdits, Panels }, ref) => {
  const [initialEdits, setInitialEdits] = useState(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState();

  useImperativeHandle(ref, () => ({
    setCurrentAudioIndex,
  }));

  //changes the content of the audio editor panel when currentAudioIndex changes
  useEffect(() => {
    if (currentAudioIndex != null) {
      const removedBase64 = { ...audioArray[currentAudioIndex] };
      delete removedBase64.bin64;

      setInitialEdits({
        ...removedBase64,
      });
    }
  }, [currentAudioIndex]);

  //set the currentAudioIndex to null, to prevent error when an audio is removed from the array while it is being selected
  useEffect(() => {
    setCurrentAudioIndex(null);
  }, [audioArray]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitEdits(
      audioArray[currentAudioIndex]._id,
      currentAudioIndex,
      initialEdits
    );
  };
  const handleChange = (e) => {
    if (e.target.name === "include") {
      const dummyEdits = initialEdits;
      dummyEdits.include.startTime = Number(e.target.value);
      setInitialEdits({
        ...initialEdits,
        ...dummyEdits,
      });
    } else {
      setInitialEdits({
        ...initialEdits,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleCloseBtn = () => {
    Panels.current[0].style.display = "none";
    Panels.current[1].style.display = "none";
    Panels.current[2].style.display = "none";
    Panels.current[3].style.display = "none";
    Panels.current[4].style.display = "none";
  };
  return (
    <StyledContainer>
      {currentAudioIndex !== null && initialEdits && (
        <form className="AudioEditor" onSubmit={handleSubmit}>
          <div className="close" onClick={handleCloseBtn}>
            <IoCloseCircleOutline size={20} color="red" />
          </div>
          <h2 className="title">Audio {currentAudioIndex}</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={initialEdits.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Start At (sec):</label>
            <input
              type="number"
              name="include"
              value={
                initialEdits.include.startTime
                  ? initialEdits.include.startTime
                  : undefined
              }
              onChange={handleChange}
            />
          </div>
          <button type="Submit">Save</button>
        </form>
      )}
      <ToastContainer />
    </StyledContainer>
  );
});
const mapStateToProps = (state) => ({
  script: state.script.present,
  audioArray: state.audioArray,
});
const mapDispatchToProps = (dispatch) => ({
  onSubmitEdits: (_id, index, audio) =>
    dispatch(updateAudioThunk(_id, index, audio, toast)),
});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(AudioEditor);

const StyledContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .AudioEditor {
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
