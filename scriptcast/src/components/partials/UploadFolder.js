import React, { useRef, useEffect } from "react";
import AudioUploader from "../player/AudioUploader";
import styled from "styled-components";
import { connect } from "react-redux";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BsPlayFill } from "react-icons/bs";
import { GoSync } from "react-icons/go";
import { BsFillStopFill } from "react-icons/bs";
import { fetchAllAudioThunk, deleteAudioThunk } from "../../thunk/thunk";
import { useParams } from "react-router-dom";

function UploadFolder({
  audioArray,
  onSynchClicked,
  onDeleteClicked,
  currentUser,
}) {
  const params = useParams();
  const audioSelected = useRef(null);
  useEffect(() => {
    if (currentUser) {
      onSynchClicked(params.projectId);
    }
  }, []);
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
  return (
    <StyledContainer>
      <div className="UploadFiles">
        <h3 className="title">Upload Audio File</h3>
        <AudioUploader />
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
          className="Sync"
          onClick={() => {
            onSynchClicked(params.projectId);
          }}
        >
          <GoSync /> Please Sync Manually to Database
        </div>
      </div>
    </StyledContainer>
  );
}
const mapStateToProps = (state) => ({
  audioArray: state.audioArray,
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onSynchClicked: (projectId) => dispatch(fetchAllAudioThunk(projectId)),
  onDeleteClicked: (_id, index) => dispatch(deleteAudioThunk(_id, index)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadFolder);

const StyledContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);

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
  .Sync {
    text-align: center;
    margin: 20px;
    cursor: pointer;
    &:hover {
      border: 1px solid blue;
    }
  }
`;
