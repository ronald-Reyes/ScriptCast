import React, { useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { TfiTrash } from "react-icons/tfi";
import { MdSystemUpdateAlt } from "react-icons/md";
import {
  createProjectThunk,
  deleteProjectThunk,
  updateProjectThunk,
} from "../../thunk/thunk";
const CREATE_PROJECT = "CREATE PROJECT";
const UPDATE_PROJECT = "UPDATE PROJECT";

export function RightSideDashboardPanel({
  onCreateBtnClicked,
  onDeleteBtnClicked,
  onUpdateBtnClicked,
  currentUser,
  clickedRef,
  projects,
  panel,
}) {
  const pageTitle = useRef();
  const projectName = useRef();
  const projectCategory = useRef();
  const projectDescription = useRef();
  const handleSubmitBtnClick = () => {
    const actionType = pageTitle.current.innerText;
    console.log(actionType);
    const name =
      projectName.current.value === "" ? undefined : projectName.current.value;
    const description =
      projectDescription.current.value === ""
        ? undefined
        : projectDescription.current.value;
    const category =
      projectCategory.current.value === ""
        ? undefined
        : projectCategory.current.value;
    const authorId = currentUser._id;
    if (actionType === CREATE_PROJECT) {
      onCreateBtnClicked({ name, description, category, authorId });
    } else if (actionType === UPDATE_PROJECT) {
      const projectId = projects[clickedRef.current]._id;
      onUpdateBtnClicked(projectId, clickedRef.current, {
        name,
        description,
        category,
      });
    }

    panel.current.style.display = "none";
  };
  return (
    <div>
      <StyledContainer>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitBtnClick();
          }}
        >
          <div>
            <h3
              className="titleText"
              id="titleText"
              ref={(el) => {
                pageTitle.current = el;
              }}
            >
              CREATE PROJECT
            </h3>
          </div>
          <div className="FieldName">Project Name</div>
          <input
            type="text"
            name=""
            onChange={(e) => {}}
            id="projectPanel-Name"
            ref={(el) => {
              projectName.current = el;
            }}
          />
          <div className="FieldName">Category</div>
          <input
            type="text"
            name=""
            onChange={(e) => {}}
            id="projectPanel-Category"
            ref={(el) => {
              projectCategory.current = el;
            }}
          />
          <div className="FieldName">Description</div>
          <textarea
            className="descriptionInput"
            name="Description"
            rows="4"
            cols="50"
            id="projectPanel-Description"
            ref={(el) => {
              projectDescription.current = el;
            }}
          ></textarea>
          <div className="buttonContainer">
            <button type="submit">
              <MdSystemUpdateAlt size={30} color="green" />
            </button>
            <button
              className="deleteProjectBtn"
              id="deleteProjectBtn"
              onClick={(e) => {
                e.preventDefault();
                onDeleteBtnClicked(
                  projects[clickedRef.current]._id,
                  clickedRef.current
                );
                panel.current.style.display = "none";
              }}
            >
              <TfiTrash size={30} color="red" />
            </button>
          </div>
          <span></span>
        </form>
      </StyledContainer>
    </div>
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.user,
  projects: state.projects,
});
const mapDispatchToProps = (dispatch) => ({
  onCreateBtnClicked: (project) => dispatch(createProjectThunk(project)),
  onDeleteBtnClicked: (projectId, index) =>
    dispatch(deleteProjectThunk(projectId, index)),
  onUpdateBtnClicked: (_id, index, projectUpdate) =>
    dispatch(updateProjectThunk(_id, index, projectUpdate)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSideDashboardPanel);

const StyledContainer = styled.div`
  padding: 20px;
  .form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .titleText {
      margin: 0;
      color: gray;
      text-align: center;
    }
    .FieldName {
      color: gray;
      margin-bottom: 0;
    }
    input {
      height: 1.5rem;
      padding-left: 10px;
    }
    .descriptionInput {
      box-sizing: border-box;
      resize: none;
      resize: vertical;
      width: 100%;
      height: 200px;
      padding: 10px;
    }
    .buttonContainer {
      display: flex;
      justify-content: space-between;
      button {
        border: none;
        cursor: pointer;
      }
    }
  }
`;
