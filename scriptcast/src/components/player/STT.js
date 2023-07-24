import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateScriptLineThunk } from "../../thunk/thunk";
import { BiMicrophoneOff } from "react-icons/bi";
import { BiSolidMicrophone } from "react-icons/bi";

function STT({
  script,
  SST,
  prevText,
  selected,
  selectedIndex,
  isListening,
  onUpdateScriptLine,
}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  SST.current = SpeechRecognition;

  useEffect(() => {
    if (selected.current) {
      selected.current.firstChild.innerText =
        prevText.current + " " + transcript;
    }
  }, [transcript]);
  useEffect(() => {
    if (listening === false && selected.current) {
      onUpdateScriptLine(
        script._id,
        selectedIndex.current,
        selected.current.innerText
      );
    }
  }, [listening]);

  isListening.current = listening;
  if (!browserSupportsSpeechRecognition) {
    return <span>Does not support STT...</span>;
  }

  return (
    <StyledSpan>
      {listening ? (
        <span className="listening">
          Listening...
          <BiSolidMicrophone size={20} />
        </span>
      ) : (
        <span>
          Not Listening...
          <BiMicrophoneOff size={20} />
        </span>
      )}
    </StyledSpan>
  );
}
const mapStateToProps = (state) => ({
  script: state.script,
});
const mapDispatchToProps = (dispatch) => ({
  onUpdateScriptLine: (_id, index, line) =>
    dispatch(updateScriptLineThunk(_id, index, line)),
});
export default connect(mapStateToProps, mapDispatchToProps)(STT);

const StyledSpan = styled.span`
  span {
    font-size: 15px;
    color: darkgray;
  }
  .listening {
    color: rgb(200, 3, 3);
  }
`;