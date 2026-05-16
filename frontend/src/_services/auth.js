import { useJwt } from "react-jwt";
import { API } from "../_api";

export const login = async ({email, password}) => {
  try {
    const {data} = await API.post("/login", {
      email,
      password
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const logout = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    await API.post("/logout", {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
  }
}

export const useDecodeToken = (token) => {
  const {decodedToken, isExpired} = useJwt(token);

  try {
    if (isExpired) {
      return {
        success: false,
        message: "Token expired",
        data: null
      }
    }
    return {
      success: true,
      message: "Token valid",
      data: decodedToken
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    }
  }
}

export const register = async ({name, username, email, password}) => {
  try {
    const {data} = await API.post("/register", {
      name,
      username,
      email,
      password
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}