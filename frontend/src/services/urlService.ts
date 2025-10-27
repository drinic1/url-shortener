import axios from "axios";
import "./axiosInterceptor";
import { type UrlEntry } from "../types/types";

const baseUrl = import.meta.env.VITE_SERVER_API_URL;

// const getAllUrls = async () => {
//   const response = await axios.get<UrlEntry[]>(`${baseUrl}/urls`, {
//     withCredentials: true,
//   });
//   return response.data;
// };

const createNewUrl = async (url: string, alias: string) => {
  const response = await axios.post<UrlEntry>(
    `${baseUrl}/urls`,
    { url, alias },
    { withCredentials: true }
  );
  return response.data;
};

const renameAlias = async (id: string, alias: string) => {
  const response = await axios.patch(
    `${baseUrl}/urls/${id}`,
    { alias },
    { withCredentials: true }
  );
  return response.data;
};

const deleteUrl = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/urls/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export default { createNewUrl, renameAlias, deleteUrl };
