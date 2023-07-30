//Code Reviewed
import React from "react";
import styled from "styled-components";
import { PiUserCircleGearThin } from "react-icons/pi";
export default function LeftSideDashboardPanel({ currentUser }) {
  //This part only shows the current user name in the dashboard
  return (
    <StyledContainer>
      <div className="mainContainer">
        <div className="profile">
          <PiUserCircleGearThin size={40} strokeWidth="0.01" />
          <span>{currentUser.username}</span>
        </div>
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 20px;
  .mainContainer {
    .profile {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;
