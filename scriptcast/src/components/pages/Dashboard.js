import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { fetchAllProjectsThunk } from "../../thunk/thunk";
import { clearCurrentUser } from "../../redux/actions";
import { useNavigate } from "react-router-dom";

import Header from "../partials/header";
import RightSideDashboardPanel from "../partials/RightSideDashboardPanel";
import LeftSideDashboardPanel from "../partials/LeftSideDashboardPanel";

import styled from "styled-components";
import { RiFilePaper2Line } from "react-icons/ri";
import { VscDiffAdded } from "react-icons/vsc";
import { IoOptionsOutline } from "react-icons/io5";
import { GrAdd } from "react-icons/gr";
import moment from "moment";

const CREATE_PROJECT = "CREATE PROJECT";
const UPDATE_PROJECT = "UPDATE PROJECT";

export const DASHBOARD_PAGE = "DASHBOARD_PAGE";

export function Dashboard({
  onFetchAllProjects,
  currentUser,
  projects,
  onClearCurrentUser,
}) {
  const projectElements = useRef([]);
  const navigate = useNavigate();
  const rightPanel = useRef();
  const clickedId = useRef();

  useEffect(() => {
    if (!currentUser) return navigate("/login");
    onFetchAllProjects(currentUser._id);
  }, []);

  const initializeProjectCreatorPanel = (action) => {
    document.querySelector("#titleText").innerHTML = action;
    document.querySelector("#deleteProjectBtn").style.display = "block";
    if (action === CREATE_PROJECT)
      document.querySelector("#deleteProjectBtn").style.display = "none";
  };
  const fillProjectCreatorPanel = (
    name = "",
    category = "",
    description = ""
  ) => {
    document.querySelector("#projectPanel-Name").value = name;
    document.querySelector("#projectPanel-Category").value = category;
    document.querySelector("#projectPanel-Description").value = description;
  };

  return (
    currentUser && (
      <div
        onClick={() => {
          rightPanel.current.style.display = "none";
        }}
      >
        <StyledDasboard>
          <Header type={DASHBOARD_PAGE} />
          <section className="Dashboard">
            <section className="SidePanel">
              <StyledSidePanel>
                <LeftSideDashboardPanel currentUser={currentUser} />
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
                        <div
                          className="AddProjectBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            rightPanel.current.style.display = "block";
                            initializeProjectCreatorPanel(CREATE_PROJECT);
                            fillProjectCreatorPanel();
                          }}
                        >
                          <VscDiffAdded
                            size={25}
                            color="blue"
                            strokeWidth={0.01}
                          />
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
                              <div
                                className="ProjectOptionsBtn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rightPanel.current.style.display = "block";
                                  initializeProjectCreatorPanel(UPDATE_PROJECT);
                                  const { name, category, description } =
                                    project;
                                  fillProjectCreatorPanel(
                                    name,
                                    category,
                                    description
                                  );
                                  clickedId.current = i;
                                }}
                              >
                                <IoOptionsOutline size={20} />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {projects.length === 0 && (
                    <h3 className="EmptyProject">
                      Create your first project{" "}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          rightPanel.current.style.display = "block";
                          initializeProjectCreatorPanel(CREATE_PROJECT);
                          fillProjectCreatorPanel();
                        }}
                      >
                        <GrAdd size={30} />
                      </div>
                    </h3>
                  )}
                </div>
              </StyledItemsContainer>
            </section>
            <section
              className="RightSidePanel"
              ref={(el) => {
                rightPanel.current = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <RightSideDashboardPanel
                clickedRef={clickedId}
                panel={rightPanel}
              />
            </section>
          </section>
        </StyledDasboard>
      </div>
    )
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
  .Dashboard {
    display: flex;
    position: relative;
  }
  .ProjectsSection {
    flex-grow: 1;
  }
  .SidePanel {
  }
  .RightSidePanel {
    position: absolute;
    width: 30%;
    height: 100vh;
    right: 0;
    top: 0;
    box-shadow: -3px 0px 7px 0px rgba(128, 128, 128, 0.4);
    background: whitesmoke;
    display: none;
  }
`;

const StyledSidePanel = styled.div`
  height: 100vh;
  width: 15rem;
  padding-top: 11.2px;
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
  .mainContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .EmptyProject {
      margin-top: 100px;
      text-align: center;
      color: gray;
      div {
        margin-top: 10px;
        cursor: pointer;
      }
    }
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
