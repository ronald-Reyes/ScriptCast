export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const REGISTER_USER = "REGISTER_USER";

//action creators
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: { user },
});

export const registerUser = (user) => ({
  type: REGISTER_USER,
  payload: { user },
});
