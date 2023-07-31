//Code Reviewed
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { connect } from "react-redux";
import styled from "styled-components";

export const Time = forwardRef(
  ({ script, audioArray, VideoPreviewer, handlePlayHighlights }, ref) => {
    const [timeStr, setTimeStr] = useState(["00", "00", "00"]);
    const [time, setTime] = useState(0);
    const stopTime = useRef();
    const timeRef = useRef(0);
    const mainTimer = useRef();
    const audio = useRef([]);

    //Methods that can be used outside this component
    useImperativeHandle(ref, () => ({
      timerPlay,
      timerPause,
      timerStop,
    }));

    //Recomputes the time using setInterval and plays the frame and audio
    const timerPlay = () => {
      if (!mainTimer.current)
        mainTimer.current = setInterval(() => {
          timeRef.current++;
          setTime(timeRef.current);
          if (timeRef.current >= stopTime.current) {
            timeRef.current = 0;
            setTime(timeRef.current);
            clearInterval(mainTimer.current);
            mainTimer.current = null;
            audio.current = [];
          }
          //Play frame
          playFrame();
          //Play audio
          playAudio();
        }, 1000);
    };
    const timerStop = () => {
      playFrame();
      stopAudio();
      clearInterval(mainTimer.current);
      mainTimer.current = null;
      setTime(0);
      timeRef.current = 0;
    };
    const timerPause = () => {
      clearInterval(mainTimer.current);
      mainTimer.current = null;
    };
    const playFrame = () => {
      let sumTime = 0;
      for (let i = 0; i < script.lines.length; i++) {
        sumTime += script.lines[i].edits.duration / 1000;
        if (sumTime === timeRef.current) {
          handlePlayHighlights(0, script.lines[i + 1].edits.duration, i + 1);
        }
        if (sumTime > timeRef.current) {
          VideoPreviewer.current.handleNextFrame(script.lines[i].edits);
          break;
        }
      }
    };
    const playAudio = () => {
      for (let i = 0; i < audioArray.length; i++) {
        if (audioArray[i].include.startTime === timeRef.current) {
          audio.current[i] = new Audio(audioArray[i].bin64);
          audio.current[i].play();
        }
      }
    };
    const stopAudio = () => {
      for (let i = 0; i < audio.current.length; i++) {
        if (audio.current[i] !== null) {
          audio.current[i].pause();
          audio.current[i] = null;
        }
      }
    };

    //changes the maximum time every changes in script
    useEffect(() => {
      if (script) {
        let sum = 0;
        for (let i = 0; i < script.lines.length; i++) {
          sum = sum + script.lines[i].edits.duration / 1000;
        }
        stopTime.current = sum;
      }
    }, [script]);

    //Updates the displayed time every time the state "time" changes
    useEffect(() => {
      const hourVal = Math.floor(time / 3600);
      const minVal = Math.floor((time % 3600) / 60);
      const secVal = (time % 3600) % 60;
      setTimeStr([
        hourVal.toString().length === 1
          ? `0${hourVal.toString()}`
          : hourVal.toString(),

        minVal.toString().length === 1
          ? `0${minVal.toString()}`
          : minVal.toString(),

        secVal.toString().length === 1
          ? `0${secVal.toString()}`
          : secVal.toString(),
      ]);
    }, [time]);

    return (
      //<div className='Time'>00:00:00</div>
      <StyledContainer>
        {timeStr[0]}:{timeStr[1]}:{timeStr[2]}
      </StyledContainer>
    );
  }
);

const mapStateToProps = (state) => ({
  script: state.script,
  audioArray: state.audioArray,
});
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(Time);

const StyledContainer = styled.div`
  background: rgba(0, 0, 255, 0.5);
  display: flex;
  justify-content: center;
`;
