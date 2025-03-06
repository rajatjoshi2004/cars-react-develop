import axios from "axios";

const apiRequest =  axios.create({
  baseURL: "https://cars.asicompany.com/api",
  // withCredentials: true,
});

export default apiRequest;
