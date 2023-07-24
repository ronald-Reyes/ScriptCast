export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const REGISTER_USER = "REGISTER_USER";
export const CLEAR_CURRENT_USER = "CLEAR_CURRENT_USER";

export const FETCH_ALL_PROJECTS = "FETCH_ALL_PROJECTS";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";

export const FETCH_SCRIPT = "FETCH_SCRIPT";
export const UPDATE_SCRIPT_LINE = "UPDATE_SCRIPT_LINE";
export const ADD_SCRIPT_LINE = "ADD_SCRIPT_LINE";
export const DELETE_SCRIPT_LINE = "DELETE_SCRIPT_LINE";
export const DELETE_ALL_LINES = "DELETE_ALL_LINES";
export const CREATE_MARKED_LINE = "CREATE_MARKED_LINE";
export const DELETE_MARKED_LINE = "DELETE_MARKED_LINE";
export const DELETE_ALL_MARKED = "DELETE_ALL_MARKED_LINE";
export const UPDATE_CASTER = "UPDATE_CASTER";
export const UPDATE_SCRIPT_TITLE = "UPDATE_SCRIPT_TITLE";

export const FETCH_ALL_AUDIO = "FETCH_ALL_AUDIO";
export const UPLOAD_AUDIO = "UPLOAD_AUDIO";
export const REMOVE_AUDIO = "REMOVE_AUDIO";
export const SET_AUDIO_INCLUDED = "SET_AUDIO_INCLUDED";

//action creators
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: { user },
});

export const registerUser = (user) => ({
  type: REGISTER_USER,
  payload: { user },
});

export const clearCurrentUser = () => ({
  type: CLEAR_CURRENT_USER,
  payload: {},
});

export const fetchAllProjects = (projects) => ({
  type: FETCH_ALL_PROJECTS,
  payload: { projects },
});
export const createProject = (project) => ({
  type: CREATE_PROJECT,
  payload: { project },
});
export const deleteProject = (index) => ({
  type: DELETE_PROJECT,
  payload: { index },
});
export const updateProject = (index, projectUpdate) => ({
  type: UPDATE_PROJECT,
  payload: { index, projectUpdate },
});

export const fetchScript = (dbScript) => ({
  type: FETCH_SCRIPT,
  payload: { dbScript },
});

export const updateScriptLine = (index, line) => ({
  type: UPDATE_SCRIPT_LINE,
  payload: { index, line },
});
export const addScriptLine = (index) => ({
  type: ADD_SCRIPT_LINE,
  payload: { index },
});
export const deleteScriptLine = (index) => ({
  type: DELETE_SCRIPT_LINE,
  payload: { index },
});
export const deleteAllLines = () => ({
  type: DELETE_ALL_LINES,
  payload: {},
});
export const createMarkedLine = (index, start, end) => ({
  type: CREATE_MARKED_LINE,
  payload: { index, start, end },
});

export const deleteMarkedLine = (index, start, end) => ({
  type: DELETE_MARKED_LINE,
  payload: { index, start, end },
});
export const deleteAllMarks = () => ({
  type: DELETE_ALL_MARKED,
  payload: {},
});

export const updateCaster = (newCaster, index) => ({
  type: UPDATE_CASTER,
  payload: { newCaster, index },
});

export const updateScriptTitle = (newTitle) => ({
  type: UPDATE_SCRIPT_TITLE,
  payload: { newTitle },
});

export const fetchAllAudio = (audioArray) => ({
  type: FETCH_ALL_AUDIO,
  payload: { audioArray },
});
export const uploadAudio = (audio) => ({
  type: UPLOAD_AUDIO,
  payload: { audio },
});
export const deleteAudio = (index) => ({
  type: REMOVE_AUDIO,
  payload: { index },
});
export const setAudioIncluded = (index, include) => ({
  type: SET_AUDIO_INCLUDED,
  payload: { index, include },
});
