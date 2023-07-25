import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { uploadAudioThunk } from "../../thunk/thunk";
import { useParams } from "react-router-dom";
let a;
const AudioUploader = ({ audioFiles, setAudioFiles, onUploadClicked }) => {
  const [buttonName, setButtonName] = useState("Play");
  const event = useRef();
  const refElement = useRef();
  const params = useParams();
  const [audio, setAudio] = useState({});

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setButtonName("Play");
    }
    if (audio) {
      a = new Audio(audio.url);
      a.onended = () => {
        setButtonName("Play");
      };
    }
  }, [audio]);

  const handleClick = () => {
    if (a) {
      if (buttonName === "Play") {
        a.play();
        setButtonName("Pause");
      } else {
        a.pause();
        setButtonName("Play");
      }
    }
  };

  const addFile = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      if (e.target.files[0].type !== "audio/mpeg") {
        return alert("The loaded file is not an audio");
      }
      if (e.target.files[0].size > 10000000) {
        return alert("The loaded file is greater than 10MB");
      }
      setAudio({
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUpload = () => {
    if (event.current) {
      onUploadClicked(
        params.projectId,
        event.current.target.files[0].name,
        event.current
      );
      refElement.current.value = null;
      event.current = null;

      return;
    }
    alert("Choose A File First");
    // const dummyFiles = audioFiles;
    // dummyFiles.push(audio);
    // setAudioFiles([...dummyFiles]);
    // console.log(audioFiles);
  };
  return (
    <div>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleClick}>{buttonName}</button>
      <input
        ref={refElement}
        type="file"
        onChange={addFile}
        onInput={(e) => {
          event.current = e;
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  script: state.script,
});
const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: (projectId, name, bin64) =>
    dispatch(uploadAudioThunk(projectId, name, bin64)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioUploader);
