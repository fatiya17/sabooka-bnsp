import { API } from "../_api";

export const getTransactions = async () => {
  const response = await API.get("/transactions", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json"
    }
  });
  return response.data;
};

export const createTransaction = async (data) => {
  try {
    const response = await API.post("/transactions", data, {
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

export const deleteTransaction = async (id) => {
  try {
    await API.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json"
      }
    });
    return { message: "Transaction deleted successfully" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};