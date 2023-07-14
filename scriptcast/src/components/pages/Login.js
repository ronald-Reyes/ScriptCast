import React, { useEffect } from "react";
import styled from "styled-components";
import { setUser } from "../../thunk/thunk";
import { connect } from "react-redux";

function Login({ onLoginPressed }) {
  useEffect(() => {
    onLoginPressed("tmq.ronald.r@gmail.com", "12345");
  }, []);
  return (
    <StyledContainer>
      <form onSubmit={(e) => {}}></form>
    </StyledContainer>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onLoginPressed: (email, password) => dispatch(setUser(email, password)),
});
export default connect(null, mapDispatchToProps)(Login);
const StyledContainer = styled.div``;
