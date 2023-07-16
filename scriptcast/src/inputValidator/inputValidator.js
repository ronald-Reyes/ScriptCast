export const loginValidator = ({ email, password }) => {
  if (email === "") return "Username is required";
  else if (password === "") return "Password is required";

  return "Passed";
};

export const registerValidator = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  if (username === "") return "Username is required";
  else if (username.length < 3)
    return "Username should be greater than 3 characters";
  else if (email === "") return "Email is required";
  else if (password === "") return "Password is required";
  else if (password.length < 8) return "Password should at least 8 characters";
  else if (password !== confirmPassword) return "Password does not matched";
  return "Passed";
};
