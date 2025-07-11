import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create the context
export const StoreContext = createContext(null);

// Provider component
const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // ✅ Auto-switch URL between localhost and Render
    const url = window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "https://food-delivery-mern-full-stack-project.onrender.com";

    // ✅ Add item to cart and sync with backend if logged in
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    // ✅ Remove item from cart and sync with backend
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    // ✅ Calculate total amount from cart
    const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
            const itemInfo = food_list.find((product) => product._id === itemId);
            if (itemInfo) {
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }
    }
    return totalAmount;
};


    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setFoodList(response.data.data);
            } else {
                console.error("❌ Invalid food list format from backend:", response.data);
                setFoodList([]); // Prevent crash
            }
        } catch (error) {
            console.error("❌ Failed to fetch food list:", error);
            setFoodList([]); // Prevent crash on frontend
        }
    };


    // ✅ Load saved cart for logged-in user
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Failed to load cart data:", error);
        }
    };

    // ✅ Initial data load on page load
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    // ✅ Context value
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
