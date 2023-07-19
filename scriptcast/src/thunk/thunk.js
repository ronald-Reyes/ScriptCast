import { useNavigate } from "react-router-dom";
import {
  registerUser,
  setCurrentUser,
  updateScriptLine,
  updateCaster,
  addScriptLine,
  deleteAllLines,
  deleteScriptLine,
  updateScriptTitle,
  fetchScript,
  fetchAllProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../redux/actions";

export const setUser = (email, password) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify({ email: email, password: password });
    const response = await fetch("http://localhost:5000/api/user/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body,
    });
    const res = await response.json();
    if (res.status === true) {
      return dispatch(setCurrentUser(res.user));
    }
    alert(res.msg);
  } catch (e) {
    dispatch();
  }
};

export const createUser =
  (username, email, password) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({
        email: email,
        username: username,
        password: password,
      });
      const response = await fetch("http://localhost:5000/api/user/register", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      });
      const res = await response.json();
      if (res.status === true) {
        return dispatch(registerUser(res.user));
      }
      alert(res.msg);
    } catch (e) {
      dispatch();
    }
  };

export const fetchAllProjectsThunk =
  (authorId) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({
        authorId,
      });
      const response = await fetch(`http://localhost:5000/api/project/getAll`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      });
      const res = await response.json();
      if (res.status === true) dispatch(fetchAllProjects(res.projects));
    } catch (e) {
      dispatch();
    }
  };
export const createProjectThunk = (project) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify(project);
    const response = await fetch(`http://localhost:5000/api/project/create`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body,
    });
    const res = await response.json();
    if (res.status === true) dispatch(createProject(res.projectCreated));
  } catch (e) {
    dispatch();
  }
};
export const deleteProjectThunk =
  (_id, index) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id });
      const response = await fetch(`http://localhost:5000/api/project/delete`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      });
      const res = await response.json();
      if (res.status === true) dispatch(deleteProject(index));
    } catch (e) {
      dispatch();
    }
  };
export const updateProjectThunk =
  (_id, index, projectUpdate) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, projectUpdate });
      const response = await fetch(`http://localhost:5000/api/project/update`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      });
      const res = await response.json();
      if (res.status === true) {
        dispatch(updateProject(index, projectUpdate));
      }
    } catch (e) {
      dispatch();
    }
  };
export const fetchScriptThunk =
  (authorId, projectId) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({
        authorId,
      });
      const response = await fetch(
        `http://localhost:5000/api/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) dispatch(fetchScript(res.project.script));
    } catch (e) {
      dispatch();
    }
  };

export const updateScriptLineThunk =
  (index, line) => async (dispatch, getState) => {
    dispatch(updateScriptLine(index, line));
  };
export const updateCasterThunk =
  (newCaster, index) => async (dispatch, getState) => {
    dispatch(updateCaster(newCaster, index));
  };

export const addScriptLineThunk =
  (index, line) => async (dispatch, getState) => {
    dispatch(addScriptLine(index));
  };

export const deleteAllLinesThunk = () => async (dispatch, getState) => {
  dispatch(deleteAllLines());
};

export const deleteScriptLineThunk = (index) => async (dispatch, getState) => {
  dispatch(deleteScriptLine(index));
};

export const updateScriptTitleThunk =
  (newTitle) => async (dispatch, getState) => {
    dispatch(updateScriptTitle(newTitle));
  };
