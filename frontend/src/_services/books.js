import { API } from "../_api";

export const getBooks = async () => {
    const response = await API.get("/books");
    return response.data;
};

export const createBook = async (data) => {
  try {
    const response = await API.post("/books", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const showBook = async (id) => {
  try {
    const {data} = await API.get(`/books/${id}`);
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateBook = async (id, data) => {
  try {
    const response = await API.post(`/books/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    await API.delete(`/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return { message: "Book deleted successfully" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};