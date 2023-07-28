import React from "react";
import { connect } from "react-redux";
import { clearCurrentUser } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import logo from "../../images/ScriptCastLogo.png";
import { CiLogout } from "react-icons/ci";
import { TiUser } from "react-icons/ti";
import { BiSearchAlt } from "react-icons/bi";
import { SlHome } from "react-icons/sl";
import { TbSpeakerphone } from "react-icons/tb";
import { PiRecordFill } from "react-icons/pi";
import { RiFolderUploadLine } from "react-icons/ri";
import styled from "styled-components";
import { DASHBOARD_PAGE } from "../pages/Dashboard";
import { PROJECT_PAGE } from "../pages/Project";

function Header({ onClearCurrentUser, type, Panels }) {
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <header className="Header">
        <div className="container">
          <a href="/" className="logo-container">
            <img src={logo} alt="logo" className="Logo"></img>
            <div>
              <strong>Script</strong>
              <span>Cast</span>
            </div>
          </a>
          {type === DASHBOARD_PAGE && (
            <div className="SearchBar">
              <input placeholder="Search project"></input>
              <button>
                <BiSearchAlt size={25} />
              </button>
            </div>
          )}
          {type === PROJECT_PAGE && (
            <div className="recorderOptionsContainer">
              <div className="recorderOptions">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    Panels.current[0].style.display = "flex";
                    Panels.current[1].style.display = "none";
                    Panels.current[2].style.display = "none";
                    Panels.current[3].style.display = "none";
                    Panels.current[4].style.display = "none";
                  }}
                >
                  <TbSpeakerphone size={22} />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    Panels.current[0].style.display = "none";
                    Panels.current[1].style.display = "flex";
                    Panels.current[2].style.display = "none";
                    Panels.current[3].style.display = "none";
                    Panels.current[4].style.display = "none";
                  }}
                >
                  <PiRecordFill size={22} />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    Panels.current[2].style.display = "flex";
                    Panels.current[0].style.display = "none";
                    Panels.current[1].style.display = "none";
                    Panels.current[3].style.display = "none";
                    Panels.current[4].style.display = "none";
                  }}
                >
                  <RiFolderUploadLine size={22} />
                </div>
              </div>
            </div>
          )}
          <nav>
            <ul className="">
              {type !== DASHBOARD_PAGE && (
                <li>
                  <a
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                    }}
                  >
                    <SlHome size={25} />
                  </a>
                </li>
              )}
              <li>
                <a
                  href="/#"
                  onClick={(e) => {
                    e.preventDefault();
                    onClearCurrentUser();
                    navigate("/login");
                  }}
                >
                  <CiLogout size={30} />
                </a>
              </li>
              <li className="menu-container">
                <div className="UserIcon">
                  <div>
                    <TiUser size={30} />
                  </div>
                </div>
                <div className="menu">
                  <a href="/">Profile</a>
                  <a href="/">option2</a>
                  <a href="/">option3</a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </StyledContainer>
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.user,
});
const mapDispatchToProps = (dispatch) => ({
  onClearCurrentUser: () => dispatch(clearCurrentUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);

const StyledContainer = styled.div`
  a {
    cursor: pointer;
    text-decoration: none;
    &:focus {
      text-decoration: none;
    }
  }

  .Header {
    position: relative;
    background: white;
    padding: 0;
    border-bottom: 1px solid rgba(255, 140, 0, 0.5);
    padding: 0 20px;

    .container {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo-container {
        display: flex;
        align-items: center;
      }
      .Logo {
        width: 2rem;
        height: 2rem;
        object-fit: cover;
      }
      .SearchBar {
        display: flex;
        flex-direction: row;
        input {
          font-size: 1.05rem;
          height: 30px;
          width: 500px;
          border: none;
          background-color: whitesmoke;
          border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          padding-left: 10px;
          &:focus {
            outline: none;
          }
        }
        button {
          cursor: pointer;
          display: flex;
          align-items: center;
          border: none;
          background-color: transparent;
        }
      }
      ul {
        display: flex;
        list-style-type: none;
        align-items: center;
        margin: 0;
        a {
          padding: 1rem;
          display: inline-block;
        }
        .menu-container {
          position: relative;

          .UserIcon {
            display: flex;
            flex-direction: column;
          }
          .menu {
            position: absolute;
            z-index: 1;
            background: whitesmoke;
            display: none;
          }
        }
      }
    }
  }
  .recorderOptionsContainer {
    position: absolute;
    left: 50%;
    margin-left: -50px;
    .recorderOptions {
      display: flex;
      gap: 1rem;
      cursor: pointer;
    }
  }
`;
