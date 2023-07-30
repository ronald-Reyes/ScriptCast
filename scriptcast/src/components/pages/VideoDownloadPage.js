import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../partials/header";

export default function VideoDownloadPage() {
  const params = useParams();
  return (
    <>
      <Header />
      <StyledContainer>
        <video
          width={640}
          height={360}
          controls
          autoPlay
          crossOrigin="anonymous"
        >
          <source
            src={`http://localhost:5000/api/video/${params.projectId}`}
            type="video/mp4"
          ></source>
        </video>
      </StyledContainer>
    </>
  );
}

const StyledContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;
