import { SET_CURRENT_USER, REGISTER_USER } from "./actions";

export const user = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_USER: {
      const { user } = payload;
      return { ...state, user: user };
    }
    case REGISTER_USER: {
      const { user } = payload;
      return { ...state, user: user };
    }

    default: {
      return state;
    }
  }
};
