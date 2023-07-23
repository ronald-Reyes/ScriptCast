import {
  SET_CURRENT_USER,
  REGISTER_USER,
  UPDATE_SCRIPT_LINE,
  ADD_SCRIPT_LINE,
  DELETE_SCRIPT_LINE,
  DELETE_ALL_LINES,
  CREATE_MARKED_LINE,
  DELETE_MARKED_LINE,
  DELETE_ALL_MARKED,
  UPDATE_CASTER,
  UPDATE_SCRIPT_TITLE,
  FETCH_SCRIPT,
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  FETCH_ALL_PROJECTS,
  SET_CURRENT_PROJECT,
  CLEAR_CURRENT_USER,
} from "./actions";

export const user = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_USER: {
      const { user } = payload;
      alert("Susccesfully Logged-in");
      return { ...state, user: user };
    }
    case REGISTER_USER: {
      const { user } = payload;
      alert("Susccesfully Logged-in");
      return { ...state, user: user };
    }
    case CLEAR_CURRENT_USER: {
      return {};
    }

    default: {
      return state;
    }
  }
};

const initProjects = [];
export const projects = (state = initProjects, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_PROJECTS: {
      const { projects } = payload;
      if (projects === null) return state;
      return projects;
    }
    case CREATE_PROJECT: {
      const { project } = payload;
      return [...state, project];
    }
    case DELETE_PROJECT: {
      const { index } = payload;
      return deleteArr(state, index);
    }
    case UPDATE_PROJECT: {
      const { index, projectUpdate } = payload;
      const dummyState = [...state];
      dummyState[index] = { ...dummyState[index], ...projectUpdate };
      return dummyState;
    }

    default: {
      return state;
    }
  }
};

const initScript = {
  _id: 1,
  authorId: 123,
  projectId: 12345,
  title: "Untitled",
  lines: [
    {
      caster: "Caster 0",
      line: "Type Here...",
      marks: [],
    },
  ],
};
export const script = (state = initScript, action) => {
  const { type, payload } = action;

  switch (type) {
    //Done
    case FETCH_SCRIPT: {
      const { dbScript } = payload;
      if (dbScript === null) return state;
      return { ...state, ...dbScript };
    }
    case UPDATE_SCRIPT_LINE: {
      const { index, line } = payload;
      const dummyState = { ...state };
      dummyState.lines[index].line = line;
      return { ...state, ...dummyState };
    }

    case ADD_SCRIPT_LINE: {
      const { index, line = "Input new line here......" } = payload;
      const dummyState = { ...state };

      dummyState.lines = insertArr(
        state.lines,
        {
          caster: `- Caster`,
          line,
          marks: [],
        },
        index
      );
      return { ...state, ...dummyState };
    }
    case DELETE_SCRIPT_LINE: {
      const { index } = payload;
      const dummyState = { ...state };
      dummyState.lines = deleteArr(state.lines, index);
      return { ...state, ...dummyState };
    }
    case DELETE_ALL_LINES: {
      const {} = payload;
      const dummyState = { ...state };
      dummyState.lines = [];
      return { ...state, ...dummyState };
    }
    //Done
    case UPDATE_CASTER: {
      const { newCaster, index } = payload;
      const dummyState = { ...state };
      dummyState.lines[index].caster = newCaster;
      return { ...state, ...dummyState };
    }
    case UPDATE_SCRIPT_TITLE: {
      const { newTitle } = payload;
      const dummyState = { ...state };
      dummyState.title = newTitle;
      return { ...state, ...dummyState };
    }
    default: {
      return state;
    }
  }
};

const insertArr = (array, object, index) => {
  if (index === -1) {
    return [object, ...array];
  }
  let newArr = [];
  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
    if (i === index) break;
  }
  newArr = [...newArr, object, ...array.slice(index + 1, array.length)];
  return newArr;
};
const deleteArr = (array, index) => {
  let newArr = [];
  for (let i = 0; i < array.length; i++) {
    if (i === index) break;
    newArr.push(array[i]);
  }
  newArr = [...newArr, ...array.slice(index + 1, array.length)];
  return newArr;
};
