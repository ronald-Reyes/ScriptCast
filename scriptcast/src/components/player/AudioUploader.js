import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
let a;
const AudioUploader = ({ audioFiles, setAudioFiles, onUploadClicked }) => {
  const [buttonName, setButtonName] = useState("Play");

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
      setAudio({
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleUpload = (e) => {
    const dummyFiles = audioFiles;
    dummyFiles.push(audio);
    setAudioFiles([...dummyFiles]);
    console.log(audioFiles);
  };
  return (
    <div>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleClick}>{buttonName}</button>
      <input type="file" onChange={addFile} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  script: state.script,
});
const mapDispatchToProps = (dispatch) => ({
  onUploadClicked: () => dispatch(),
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioUploader);
