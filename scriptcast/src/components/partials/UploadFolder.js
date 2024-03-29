//Code Reviewed
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BsPlayFill } from "react-icons/bs";
import { PiRecordFill } from "react-icons/pi";
import { BsFillStopFill } from "react-icons/bs";
import {
  fetchAllAudioThunk,
  deleteAudioThunk,
  uploadAudioThunk,
} from "../../thunk/thunk";
import { useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";

//Upload Folder
function UploadFolder({
  audioArray,
  onSynchClicked,
  onDeleteClicked,
  currentUser,
  Panels,
}) {
  const params = useParams();
  const audioSelected = useRef(null);

  //fetch the audio from the database
  useEffect(() => {
    if (currentUser) {
      onSynchClicked(params.projectId);
    }
  }, []);

  //Pause/Play the uploaded audio
  const handleClick = (audio) => {
    if (audioSelected.current === null) {
      audioSelected.current = new Audio(audio.bin64);
      audioSelected.current.className = "AudioPlayer";
      audioSelected.current.play();
      return;
    }
    audioSelected.current.pause();
    audioSelected.current = null;
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
      <div className="UploadFiles">
        <div className="close" onClick={handleCloseBtn}>
          <IoCloseCircleOutline size={20} color="red" />
        </div>
        <h3 className="title">Upload Audio File</h3>
        <AudioUploaderConnect />
        {audioArray.map((audio, i) => {
          return (
            <div className="audio" key={i} onMouseOver={() => {}}>
              <div>{audio.name}</div>
              <div>
                <BsPlayFill
                  onClick={() => {
                    handleClick(audio);
                  }}
                />
                <BsFillStopFill
                  onClick={() => {
                    handleClick(audio);
                  }}
                />
                <IoIosRemoveCircleOutline
                  onClick={(e) => {
                    onDeleteClicked(audio._id, i);
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          className="recordPointer"
          onClick={() => {
            Panels.current[0].style.display = "none";
            Panels.current[1].style.display = "flex";
            Panels.current[2].style.display = "none";
            Panels.current[3].style.display = "none";
            Panels.current[4].style.display = "none";
          }}
        >
          Or Record Audio <PiRecordFill />
        </div>
      </div>
      <ToastContainer />
    </StyledContainer>
  );
}
const mapStateToProps = (state) => ({
  audioArray: state.audioArray,
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onSynchClicked: (projectId) => dispatch(fetchAllAudioThunk(projectId)),
  onDeleteClicked: (_id, index) =>
    dispatch(deleteAudioThunk(_id, index, toast)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadFolder);

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
  .UploadFiles {
    display: flex;
    flex-direction: column;
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
  .audio {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    cursor: pointer;
  }
  .recordPointer {
    text-align: center;
    margin: 20px;
    cursor: pointer;
    &:hover {
      border: 1px solid blue;
    }
  }
`;

//Uploader Component
let a;
const AudioUploader = ({ onUploadClicked }) => {
  const [buttonName, setButtonName] = useState("Play");
  const event = useRef();
  const refElement = useRef();
  const params = useParams();
  const [audio, setAudio] = useState({});

  // handles play and pause of initial audio selected for upload
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
  // adds audio
  const addFile = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      if (e.target.files[0].type !== "audio/mpeg") {
        return toast.error("The loaded file is not an audio", toastOptions);
      }
      if (e.target.files[0].size > 10000000) {
        return toast.error(
          "The loaded file is greater than 10mb",
          toastOptions
        );
      }
      setAudio({
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  // upload button handler
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
    toast.error("Upload an audio first", toastOptions);
  };

  //Setting temporary audio variable
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

const AudioUploaderConnect = connect(
  (state) => ({
    script: state.script.present,
  }),
  (dispatch) => ({
    onUploadClicked: (projectId, name, bin64) =>
      dispatch(uploadAudioThunk(projectId, name, bin64, toast)),
  })
)(AudioUploader);
