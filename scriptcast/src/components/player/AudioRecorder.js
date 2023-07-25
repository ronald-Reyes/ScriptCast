import * as React from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import styled from "styled-components";
import { connect } from "react-redux";
import { uploadRecordedThunk } from "../../thunk/thunk";
import { useParams } from "react-router-dom";

function AudioRecorderPanel({ onUploadClicked }) {
  const params = useParams();
  const fileBlob = React.useRef();
  const recorder = React.useRef();
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );
  const handleUpload = () => {
    if (fileBlob.current) {
      onUploadClicked(
        params.projectId,
        "Recorded Audio File",
        fileBlob.current
      );
      return;
    }
    alert("Please Start Recording");
  };
  const handleOutput = (blob) => {
    const url = URL.createObjectURL(blob);
    fileBlob.current = blob;
    if (recorder.current !== undefined) {
      recorder.current.src = url;
      recorder.current.controls = true;
    }
  };

  return (
    <StyledContainer>
      <div className="Recorder">
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
    </StyledContainer>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: (projectId, name, bin64) =>
    dispatch(uploadRecordedThunk(projectId, name, bin64)),
});
export default connect(null, mapDispatchToProps)(AudioRecorderPanel);

const StyledContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);
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
