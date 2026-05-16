import { API } from "../_api";

export const getAuthors = async () => {
    const response = await API.get("/authors");
    return response.data;
};

export const createAuthor = async (data) => {
  try {
    const response = await API.post("/authors", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating author:", error);
    throw error;
  }
};

export const showAuthor = async (id) => {
    const response = await API.get(`/authors/${id}`);
    return response.data.data;
};

export const updateAuthor = async (id, data) => {
    try {
        const response = await API.post(`/authors/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json"
          }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating author:", error);
        throw error;
    }
};

export const deleteAuthor = async (id) => {
    try {
        const response = await API.delete(`/authors/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json"
          }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting author:", error);
        throw error;
    }
};