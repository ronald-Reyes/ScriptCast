//Code Reviewed
import * as React from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import styled from "styled-components";
import { connect } from "react-redux";
import { uploadRecordedThunk } from "../../thunk/thunk";
import { useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";

function AudioRecorderPanel({ Panels, onUploadClicked }) {
  const params = useParams();
  const fileBlob = React.useRef();
  const recorder = React.useRef();

  //Initialize audiorecorder controls to be passed in the AudioRecorder object
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );

  //Creates an objectURL and assign to the audio element
  const handleOutput = (blob) => {
    const url = URL.createObjectURL(blob);
    fileBlob.current = blob;
    if (recorder.current !== undefined) {
      recorder.current.src = url;
      recorder.current.controls = true;
    }
  };

  //Upload handler
  const handleUpload = () => {
    if (fileBlob.current) {
      onUploadClicked(
        params.projectId,
        "Recorded Audio File",
        fileBlob.current
      );
      return;
    }
    toast.error("Start Recording First", toastOptions);
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
      <div className="Recorder">
        <div className="close" onClick={handleCloseBtn}>
          <IoCloseCircleOutline size={20} color="red" />
        </div>
        <h3 className="title">Recorder Audio</h3>
        <AudioRecorder
          onRecordingComplete={(blob) => handleOutput(blob)}
          recorderControls={recorderControls}
          // downloadOnSavePress={true}
          downloadFileExtension="mp3"
          showVisualizer={true}
        />
        <audio controls={true} ref={recorder}></audio>
        <button onClick={handleUpload}>Upload</button>
      </div>
      <ToastContainer />
    </StyledContainer>
  );
}
const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: (projectId, name, bin64) =>
    dispatch(uploadRecordedThunk(projectId, name, bin64, toast)),
});
export default connect(null, mapDispatchToProps)(AudioRecorderPanel);

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
  .Recorder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin: 20px;
  }
  .inputText {
    resize: vertical;
  }
  .title {
    text-align: center;
    margin-top: 0;
  }
`;
