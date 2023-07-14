import { setCurrentUser } from "../redux/actions";
import { registerUser } from "../redux/actions";
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
    dispatch(setCurrentUser(res.user));
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
      dispatch(registerUser(res.user));
    } catch (e) {
      dispatch();
    }
  };
