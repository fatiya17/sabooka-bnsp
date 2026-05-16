import { API } from "../_api";

export const getGenres = async () => {
    const response = await API.get("/genres");
    return response.data;
};

export const createGenre = async (data) => {
  try {
    const response = await API.post("/genres", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating genre:", error);
    throw error;
  }
};

export const showGenre = async (id) => {
    const response = await API.get(`/genres/${id}`);
    return response.data.data;
};

export const updateGenre = async (id, data) => {
    try {
        const response = await API.put(`/genres/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json"
          }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating genre:", error);
        throw error;
    }
};

export const deleteGenre = async (id) => {
    try {
        const response = await API.delete(`/genres/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json"
          }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting genre:", error);
        throw error;
    }
};
