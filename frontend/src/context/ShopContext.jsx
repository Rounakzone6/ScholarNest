import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ensure axios requests include the token automatically
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["token"];
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`);
      if (data.success) {
        setUser(data.data);
      } else {
        setToken("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setToken("");
      }
    }
  }, [token, backendUrl]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = () => {
    setToken("");
    toast.success("Signed out successfully");
    navigate("/");
  };

  const value = {
    currency,
    token,
    setToken,
    user,
    setUser,
    backendUrl,
    navigate,
    logout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
