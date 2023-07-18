import React, { useEffect, useRef } from "react";
import { fetchAllProjectsThunk } from "../../thunk/thunk";
import { clearCurrentUser } from "../../redux/actions";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/ScriptCastLogo.png";
import styled from "styled-components";
import moment from "moment";
import { RiFilePaper2Line } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { TiUser } from "react-icons/ti";
import { BiSearchAlt } from "react-icons/bi";
import { VscDiffAdded } from "react-icons/vsc";

export function Dashboard({
  onFetchAllProjects,
  currentUser,
  projects,
  onClearCurrentUser,
}) {
  const projectElements = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) onFetchAllProjects(currentUser._id);
  }, []);
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);

  return (
    <>
      <StyledDasboard>
        <header className="Header">
          <div className="container">
            <a href="/" className="logo-container">
              <img src={logo} alt="logo" className="Logo"></img>
              <div>
                <strong>Script</strong>
                <span>Cast</span>
              </div>
            </a>
            <div className="SearchBar">
              <input placeholder="Search project"></input>
              <button>
                <BiSearchAlt size={25} />
              </button>
            </div>
            <nav>
              <ul className="">
                <li>
                  <a
                    href="/login"
                    onClick={() => {
                      onClearCurrentUser();
                    }}
                  >
                    <CiLogout size={30} />
                  </a>
                </li>
                <li className="menu-container">
                  <div className="UserIcon">
                    <a>
                      <TiUser size={30} />
                    </a>
                  </div>
                  <div className="menu">
                    <a>Profile</a>
                    <a>option2</a>
                    <a>option3</a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <section className="Dashboard">
          <section className="SidePanel">
            <StyledSidePanel>
              <div></div>
            </StyledSidePanel>
          </section>
          <section className="ProjectsSection">
            <StyledItemsContainer>
              <div className="mainContainer">
                {projects && (
                  <ul>
                    <li className="placeholder">
                      <div>
                        <p>Projects</p>
                      </div>
                      <div>
                        <p>Author</p>
                      </div>

                      <div>
                        <p>Category</p>
                      </div>
                      <div>
                        <p>Date Created</p>
                      </div>
                      <div>
                        <p>Date Modified</p>
                      </div>
                      <div>
                        <VscDiffAdded size={25} color="blue" />
                      </div>
                    </li>
                    {projects.map((project, i) => {
                      return (
                        <li
                          key={i}
                          ref={(el) => {
                            projectElements.current[i] = el;
                          }}
                          onClick={() => {
                            navigate(`/project/${project._id}`);
                          }}
                        >
                          <div className="Icon">
                            <RiFilePaper2Line size={20} />
                            <div>
                              <p className="projectName">{project.name}</p>
                            </div>
                          </div>
                          <div>
                            <p>{currentUser.username}</p>
                          </div>

                          <div>
                            <p>{project.category}</p>
                          </div>
                          <div>
                            <p>
                              {moment(currentUser.createdAt).format(
                                "YYYY/MM/DD"
                              )}
                            </p>
                          </div>
                          <div>
                            <p>
                              {moment(currentUser.createdAt).format(
                                "YYYY/MM/DD"
                              )}
                            </p>
                          </div>
                          <div>
                            <select>
                              <option></option>
                              <option></option>
                              <option></option>
                              <option></option>
                            </select>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="itemsContainer"></div>
              </div>
            </StyledItemsContainer>
          </section>
        </section>
      </StyledDasboard>
    </>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.user,
  projects: state.projects,
});
const mapDispatchToProps = (dispatch) => ({
  onFetchAllProjects: (authorId) => dispatch(fetchAllProjectsThunk(authorId)),
  onClearCurrentUser: () => dispatch(clearCurrentUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const StyledDasboard = styled.div`
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
  .Dashboard {
    display: flex;
  }
  .ProjectsSection {
    flex-grow: 1;
  }
  .SidePanel {
  }
`;

const StyledSidePanel = styled.div`
  height: 100vh;
  width: 15rem;
`;

const StyledItemsContainer = styled.div`
  .placeholder {
    p {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.7);
    }
    background: whitesmoke;
    border-bottom: 1px solid skyblue;
  }
  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    padding-top: 20px;
    gap: 20px;
    font-size: 0.7rem;
    li {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      border-bottom: 1px solid #e4e4e4;
      &:hover {
        background: whitesmoke;
        cursor: pointer;
        border-bottom: 1px solid skyblue;
      }
      .projectName {
        font-size: 0.75rem;
      }
      .Icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    img {
      width: 3rem;
      height: 3rem;
      object-fit: cover;
    }
  }
`;
