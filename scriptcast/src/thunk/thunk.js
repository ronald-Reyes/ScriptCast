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

//Script related actions
export const updateScriptLineThunk =
  (_id, index, line) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, index, line });
      const response = await fetch(
        `http://localhost:5000/api/script/update-line`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        dispatch(updateScriptLine(index, line));
      }
    } catch (e) {
      dispatch();
    }
  };
export const updateCasterThunk =
  (_id, newCaster, index) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, index, caster: newCaster });
      const response = await fetch(
        `http://localhost:5000/api/script/update-caster`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        dispatch(updateCaster(newCaster, index));
      }
    } catch (e) {
      dispatch();
    }
  };

export const addScriptLineThunk =
  (_id, index) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, index: index + 1 });
      const response = await fetch(
        `http://localhost:5000/api/script/add-line`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        dispatch(addScriptLine(index));
      }
    } catch (e) {
      dispatch();
    }
  };

export const deleteAllLinesThunk = (_id) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify({ _id });
    const response = await fetch(
      `http://localhost:5000/api/script/delete-all`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body,
      }
    );
    const res = await response.json();
    if (res.status === true) {
      dispatch(deleteAllLines());
    }
  } catch (e) {
    dispatch();
  }
};

export const deleteScriptLineThunk =
  (_id, index) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, index });
      const response = await fetch(
        `http://localhost:5000/api/script/delete-line`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        dispatch(deleteScriptLine(index));
      }
    } catch (e) {
      dispatch();
    }
  };

export const updateScriptTitleThunk =
  (_id, newTitle) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, title: newTitle });
      const response = await fetch(
        `http://localhost:5000/api/script/update-title`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        dispatch(updateScriptTitle(newTitle));
      }
    } catch (e) {
      dispatch();
    }
  };
