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
import { IoCloseCircleOutline } from "react-icons/io5";

const TTS = forwardRef(({ Panels }, ref) => {
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [text, setText] = useState(
    "Welcome to scriptcast, make things at your own style."
  );
  const textElement = useRef();
  const [isEnabled, setIsEnabled] = useState(true);

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

  useEffect(() => {
    if (!isEnabled) {
      const synth = window.speechSynthesis;
      synth.pause();
    }
  }, [isEnabled]);

  //Sets other config for speech synthesis and calls the speak method when conditions are met
  const handlePlay = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textElement.current.value);
    if (isPaused) {
      if (isEnabled) synth.resume();
    } else {
      synth.cancel();
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      if (isEnabled) synth.speak(utterance);
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
  const handleCloseBtn = () => {
    Panels.current[0].style.display = "none";
    Panels.current[1].style.display = "none";
    Panels.current[2].style.display = "none";
    Panels.current[3].style.display = "none";
    Panels.current[4].style.display = "none";
  };

  return (
    <StyledContainer>
      <div className="TTS">
        <div className="close" onClick={handleCloseBtn}>
          <IoCloseCircleOutline size={20} color="red" />
        </div>
        <h3 className="title">
          Speech Synthesis{" "}
          <label className="switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => {
                setIsEnabled(!isEnabled);
              }}
            />
            <span className="slider round"></span>
          </label>
        </h3>

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
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
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

  //toggle
  .switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 1px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;
