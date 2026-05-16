import { API } from "../_api";

export const getUsers = async () => {
  const response = await API.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json"
    }
  });
  return response.data;
};

export const deleteUser = async (id) => {
  try {
    await API.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
