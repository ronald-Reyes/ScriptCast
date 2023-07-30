//Code Reviewed
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const TTS = forwardRef(({}, ref) => {
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [text, setText] = useState(
    "Welcome to scriptcast, make things at your own style."
  );
  const textElement = useRef();

  //These methods can be used outside this component
  useImperativeHandle(ref, () => ({
    setText,
    handlePlay,
    handlePause,
    handleStop,
  }));

  //Loads initial STT configuration when the page is first loaded
  useEffect(() => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    setVoice(voices[1]);
  }, []);

  //restarts TTS every time there are changes in the specified state variables
  useEffect(() => {
    if (text && voice && pitch && rate && volume) {
      const synth = window.speechSynthesis;
      synth.cancel();
      handlePlay();
    }
  }, [text, voice, pitch, rate, volume]);

  //Sets other config for speech synthesis and calls the speak method when conditions are met
  const handlePlay = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textElement.current.value);
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

export default connect(null, null, null, {
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
