import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const TTS = forwardRef(({ textInput }, ref) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [text, setText] = useState(
    "You can edit the text here and click the play button, or click any line on the text editor to load the text"
  );
  const textElement = useRef();
  //textInput.current = text;

  useImperativeHandle(ref, () => ({
    setText,
    handlePlay,
    handlePause,
    handleStop,
  }));

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(textElement.current.value);
    const voices = synth.getVoices();

    setUtterance(u);
    setVoice(voices[0]);
  }, []);
  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(textElement.current.value);
    setUtterance(u);
    return () => {
      synth.cancel();
    };
  }, [text, voice, pitch, rate, volume]);

  const handlePlay = () => {
    console.log(text);

    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    setUtterance(u);
    if (isPaused) {
      synth.resume();
    } else {
      synth.cancel();
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      synth.speak(utterance);
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
  };

  const handlePitchChange = (event) => {
    setPitch(parseFloat(event.target.value));
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <StyledContainer>
      <div className="TTS">
        <h3 className="title">Speech Synthesis</h3>
        <textarea
          ref={textElement}
          className="inputText"
          rows="4"
          cols="50"
          id="projectPanel-Description"
          value={text}
          onChange={(e) => {
            setText(textElement.current.value);
          }}
        ></textarea>

        <label>
          Voice:
          <select value={voice?.name} onChange={handleVoiceChange}>
            {window.speechSynthesis.getVoices().map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Pitch:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
          />
        </label>

        <label>
          Speed:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
          />
        </label>

        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
        <button onClick={handlePlay}>
          {isPaused ? <span>Resume</span> : <span>Play</span>}
        </button>
        <button
          onClick={() => {
            handlePause();
          }}
        >
          Pause
        </button>
        <button
          onClick={() => {
            handleStop();
          }}
        >
          Stop
        </button>
      </div>
    </StyledContainer>
  );
});

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TTS);

const StyledContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: white;
  box-shadow: -1px 5px 5px 5px rgba(128, 128, 128, 0.4);
  .TTS {
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
`;
