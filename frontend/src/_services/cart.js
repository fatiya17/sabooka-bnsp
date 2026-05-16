import { API } from "../_api";

export const getCart = async () => {
    try {
        const response = await API.get("/cart", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const addToCart = async (data) => {
    try {
        const response = await API.post("/cart", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const updateCartItem = async (id, quantity) => {
    try {
        const response = await API.put(`/cart/${id}`, { quantity }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
};

export const removeCartItem = async (id) => {
    try {
        const response = await API.delete(`/cart/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error removing cart item:", error);
        throw error;
    }
};

export const clearCart = async () => {
    try {
        const response = await API.delete("/cart/clear", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};
