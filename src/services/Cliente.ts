import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/movAlmacen",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
