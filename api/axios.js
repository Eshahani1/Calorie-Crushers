import axios from "axios";

const APP_ID = "6c39b851";
const APP_KEY = "fd1b79de7c8c514b08a2a898e279151a";

const baseURL = "https://api.edamam.com/api/food-database/v2/parser";

const fetchData = (barcode) => {
  const instance = axios.create({
    baseURL,
    params: {
      app_id: APP_ID,
      app_key: APP_KEY,
      upc: barcode, 
    },
  });

  return instance.get(""); 
};

export default fetchData;
