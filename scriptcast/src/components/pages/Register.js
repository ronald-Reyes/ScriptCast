import React, { useEffect } from "react";
import styled from "styled-components";
import { createUser } from "../../thunk/thunk";
import { connect } from "react-redux";

function Register({ onRegisterPressed }) {
  useEffect(() => {
    onRegisterPressed("Daddy", "dads@gmail.com", "123");
  }, []);
  return <div>Register</div>;
}

const mapDispatchToProps = (dispatch) => ({
  onRegisterPressed: (username, email, password) =>
    dispatch(createUser(username, email, password)),
});
export default connect(null, mapDispatchToProps)(Register);
const StyledContainer = styled.div``;
