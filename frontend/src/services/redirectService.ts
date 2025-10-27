import axios from "axios";

// const baseUrl = "http://localhost:3000";
const baseUrl = import.meta.env.VITE_SERVER_REDIRECT_URL;

const redirect = async (alias: string) => {
  const response = await axios.get(`${baseUrl}/${alias}`);
  return response.data;
};

export default { redirect };
