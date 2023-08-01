import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setUser } from "../../thunk/thunk";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginValidator } from "../../inputValidator/inputValidator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../toastify";
import logo from "../../images/ScriptCastLogo.png";
function Login({ onLoginPressed, currentUser }) {
  const navigate = useNavigate();
  const [userCredetials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const status = loginValidator(userCredetials);
    if (status !== "Passed") {
      toast.error(status, toastOptions);
      return;
    }
    onLoginPressed(userCredetials, navigate);
  };

  return (
    <>
      <StyledContainer>
        <div className="mainContainer">
          <section className="leftSection">
            <img src={logo}></img>
            <h1>
              <strong>Script</strong>
              <span>Cast</span>
            </h1>
          </section>
          <section className="rightSection">
            <form
              className="form"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="loginText">
                <h2>LOGIN</h2>
              </div>
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
              <button type="submit">Login</button>
              <span>
                Don't have an account? <Link to="/register">Register</Link>
              </span>
            </form>
          </section>
        </div>
      </StyledContainer>
      <ToastContainer />
    </>
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onLoginPressed: ({ email, password }, navigate) =>
    dispatch(setUser(email, password, navigate)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);

const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;
  .mainContainer {
    position: relative;
    display: flex;
    justify-content: space-between;
    .leftSection{
      height:100vh;
      flex-grow:1;
      background:linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
      display:flex;
      justify-content:center;
      align-items:center;
      font-size:5px;
      img{
        width:150px;
        height:auto;
      }
      h1{
        
        font-size:2.2rem;
        color: orange;
          text-transform: uppercase;
          border-bottom:1px solid grey;
        span{
         color:black;
          
        }
      }
    }
    .rightSection {
      position: relative;
      background-color: white;
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2rem;
        background-color: white;
        padding: 3rem 5rem;
        .loginText {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        border-bottom:1px solid black;
        h2 {
          color: orange;
          text-transform: uppercase;
        }
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
    }
  }
  @media only screen 
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) {

   .mainContainer{
    display:block;
    
   }
 
}
`;
