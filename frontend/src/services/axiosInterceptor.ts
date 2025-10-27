import axios, { AxiosError } from "axios";
import { MessageError } from "../types/types";

export default axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    if (!(error instanceof AxiosError)) return Promise.reject(error);

    if (error.response && error.response.data.error instanceof Array) {
      let message = "";
      for (const err of error.response.data.error) {
        message += `${err.path[0]}: ${err.message}\n`;
      }

      return Promise.reject(new MessageError("Error occured", message));
    } else if (typeof error.response?.data.error === "string") {
      return Promise.reject(
        new MessageError("Error occured", error.response?.data.error)
      );
    }
    return Promise.reject(error);
  }
);
