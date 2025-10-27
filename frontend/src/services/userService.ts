import axios from "axios";
import type { User } from "../types/types";

const baseUrl = import.meta.env.VITE_SERVER_API_URL;

const signup = async (username: string, email: string, password: string) => {
  const response = await axios.post<User>(
    `${baseUrl}/auth/register`,
    { username, email, password },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const signin = async (email: string, password: string) => {
  const response = await axios.post<User>(
    `${baseUrl}/auth/login`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return response.data;
};

const checkStatus = async () => {
  const response = await axios.get<User>(`${baseUrl}/users/me`, {
    withCredentials: true,
  });
  return response.data;
};

const signout = async () => {
  const response = await axios.post(
    `${baseUrl}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export default { signup, signin, checkStatus, signout };
