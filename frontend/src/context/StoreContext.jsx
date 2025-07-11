import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const url = window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://food-delivery-mern-full-stack-project.onrender.com";

  const addToCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
  };

  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });
    if (token) await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (let id in cartItems) {
      const item = food_list.find(p => p._id === id);
      if (item) total += item.price * cartItems[id];
    }
    return total;
  };

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (Array.isArray(res.data.data)) setFoodList(res.data.data);
      else setFoodList([]);
    } catch (err) {
      console.error("Failed to load food list:", err);
      setFoodList([]);
    }
  };

  const loadCartData = async (token) => {
    try {
      const res = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      const saved = localStorage.getItem("token");
      if (saved) {
        setToken(saved);
        await loadCartData(saved);
      }
    };
    init();
  }, []);

  return (
    <StoreContext.Provider value={{
      food_list,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      url,
      token,
      setToken
    }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
