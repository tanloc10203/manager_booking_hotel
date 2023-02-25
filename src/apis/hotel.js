import instance from "./axios";
import FormData from "form-data";

const host = "/hotels";

const hotelAPI = {
  create: (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key]) && key !== "tags") {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else if (key === "tags") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    return instance.post(host, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll: (filters) => {
    return instance.get(host, filters);
  },
};

export default hotelAPI;
