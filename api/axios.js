import axios from "axios";

const APP_ID = "6c39b851";
const APP_KEY = "0cf0aa66a152d1431aba6dafd98e464b";

const baseURL = "https://api.edamam.com/api/food-database/v2/parser";

const fetchData = (params = {}) => {
  const instance = axios.create({
    baseURL,
    params: {
      app_id: APP_ID,
      app_key: APP_KEY,
      ...params,
    },
  });

  return instance.get(""); // Make a GET request to the baseURL with the provided params
};

export default fetchData;
