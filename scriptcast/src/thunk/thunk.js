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
  uploadAudio,
  fetchAllAudio,
  deleteAudio,
  updateEdits,
  updateAudio,
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
      //delete also the script attached to this project
      const body2 = JSON.stringify({ projectId: _id });
      await fetch(`http://localhost:5000/api/script/delete-script`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: body2,
      });
      //delete also the audio attached to this project
      await fetch(`http://localhost:5000/api/audio/deleteMany`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: body2,
      });

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

export const updateEditsThunk =
  (_id, index, line) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, index, line });
      const response = await fetch(
        `http://localhost:5000/api/script/update-edits`,
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
        dispatch(updateEdits(index, line));
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

//Audio Thunks

async function audioToBase64(e) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(e.target.files[0]);
  });
}
export const uploadAudioThunk =
  (projectId, name, file) => async (dispatch, getState) => {
    try {
      const bin64 = await audioToBase64(file);
      const formData = new FormData();
      formData.append("bin64", bin64);
      formData.append("projectId", projectId);
      formData.append("name", name);

      const response = await fetch(`http://localhost:5000/api/audio/upload`, {
        method: "post",
        body: formData,
      });
      const res = await response.json();
      if (res.status === true) {
        alert("Successfully added to database.");
        dispatch(uploadAudio(res.audioCreated));
      }
    } catch (e) {
      dispatch();
    }
  };

const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
export const uploadRecordedThunk =
  (projectId, name, file) => async (dispatch, getState) => {
    try {
      const bin64 = await blobToBase64(file);
      const formData = new FormData();
      formData.append("bin64", bin64);
      formData.append("projectId", projectId);
      formData.append("name", name);

      const response = await fetch(`http://localhost:5000/api/audio/upload`, {
        method: "post",
        body: formData,
      });
      const res = await response.json();
      if (res.status === true) {
        alert("Successfully added to database.");
        dispatch(uploadAudio(res.audioCreated));
      }
    } catch (e) {
      dispatch();
    }
  };
export const fetchAllAudioThunk = (projectId) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify({ projectId });
    const response = await fetch(`http://localhost:5000/api/audio/getAll`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const res = await response.json();
    if (res.status === true) {
      dispatch(fetchAllAudio(res.audioArray));
    }
  } catch (e) {
    dispatch();
  }
};

export const deleteAudioThunk = (_id, index) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify({ _id });
    const response = await fetch(`http://localhost:5000/api/audio/remove`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const res = await response.json();
    if (res.status === true) {
      alert("Successfully deleted from database.");
      dispatch(deleteAudio(index));
    }
  } catch (e) {
    dispatch();
  }
};

export const updateAudioThunk =
  (_id, index, audio) => async (dispatch, getState) => {
    try {
      const body = JSON.stringify({ _id, audio });
      const response = await fetch(
        `http://localhost:5000/api/audio/updateAudio`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );
      const res = await response.json();
      if (res.status === true) {
        alert("Successfully updated from database.");
        dispatch(updateAudio(index, audio));
      }
    } catch (e) {
      dispatch();
    }
  };
export const renderVideoThunk =
  (images, config) => async (dispatch, getState) => {
    try {
      const formData = new FormData();
      for (const image of images) {
        formData.append("images", image);
      }

      formData.append("config", JSON.stringify(config));

      const response = await fetch(`http://localhost:5000/api/video/render`, {
        method: "post",
        body: formData,
      });
      const res = await response.json();
      if (res.status === true) {
        alert("Video successfully converted, Please reload the page");
      }
    } catch (e) {}
  };
