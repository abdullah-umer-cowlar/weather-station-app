import { AuthInfo } from "./types";

export const setSession = (authInfo: AuthInfo) => {
  localStorage.setItem("user", JSON.stringify(authInfo.user));
  localStorage.setItem("jwtToken", JSON.stringify(authInfo.token));
};

export const removeSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwtToken");
};
