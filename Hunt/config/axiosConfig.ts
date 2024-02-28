import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.0.0.228:3000",
  headers: {},
});
export default instance;
