import { SignupPayload, LoginPayload } from "../lib/types";
import { POST, GET } from "../lib/methods";

export const signup = async (data: SignupPayload) => {
  return await POST({
    url: "/api/auth/signup",
    data,
  });
};

export const login = async (data: LoginPayload) => {
  return await POST({
    url: "/api/auth/login",
    data,
  });
};

export const getUser = async () => {
  return await GET({
    url: "/api/auth/user",
    // disabling cache to ensure request does not falsely verify a logged out user
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
};
