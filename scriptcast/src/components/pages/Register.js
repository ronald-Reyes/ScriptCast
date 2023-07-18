import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createUser } from "../../thunk/thunk";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerValidator } from "../../inputValidator/inputValidator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../images/ScriptCastLogo.png";

function Register({ onRegisterPressed, currentUser }) {
  const navigate = useNavigate();
  const [userCredetials, setUserCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    draggable: true,
    theme: "colored",
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const status = registerValidator(userCredetials);
    if (status !== "Passed") {
      toast.error(status, toastOptions);
      return;
    }
    onRegisterPressed(userCredetials);
  };
  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);
  return (
    <>
      <StyledContainer>
        <form
          className="form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="login-info">
            <img src={logo}></img>
            <h3>
              <strong>Script</strong>
              <span>Cast</span>
            </h3>
          </div>
          <div className="RegisterText">REGISTER</div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) =>
              setUserCredentials({
                ...userCredetials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={(e) =>
              setUserCredentials({
                ...userCredetials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) =>
              setUserCredentials({
                ...userCredetials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) =>
              setUserCredentials({
                ...userCredetials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <button type="submit">Login</button>
          <span>
            Already have an account? <Link to="/login">LOGIN</Link>
          </span>
        </form>
      </StyledContainer>
      <ToastContainer />
    </>
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onRegisterPressed: ({ username, email, password }) =>
    dispatch(createUser(username, email, password)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
const StyledContainer = styled.div`
      position: relative;
      background-color: black;
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      .form {
        border-radius:20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1.2rem;
        background-color: white;
        text-align:center;
        padding: 3rem 5rem;
        .login-info {
        display: flex;
        flex-direction:row;
        align-items: center;
        gap: 1rem;
        justify-content: center;
       
        img{
          width:50px;
          height:auto;
        }
        h3 {
          color: orange;
          text-transform: uppercase;
        }
        }
        .RegisterText{
          gap:none;
          border-bottom:1px solid black;
          font-size:1.4rem;
          font-weight:bold;
          color:gray;
        }
        input {
          background-color: transparent;
          box-sizing:border-box;
          padding: 1rem;
          border: 0.1rem solid black;
          border-radius: 0.4rem;
          color: black;
          width: 100%;
          font-size: 1rem;
          &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
          }
        }
        button {
          background-color: #4e0eff;
          color: white;
          padding: 1rem 2rem;
          border: none;
          font-weight: bold;
          border-radius: 0.4rem;
          font-size: 1rem;
          text-transform: uppercase;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          &:hover {
            background-color: orange;
          }
        }
        span {
          color: black;
          text-transform: uppercase;
          a {
            color: #4e0eff;
            text-transform: uppercase;
            font-weight: bold;
            text-decoration: none;s
          }
        }
      }
    

`;
