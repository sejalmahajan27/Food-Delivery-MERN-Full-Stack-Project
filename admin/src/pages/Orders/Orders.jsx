import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = () => {
  // ✅ Detect backend URL based on environment
  const url = window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://food-delivery-mern-full-stack-project.onrender.com";

  const [orders, setOrders] = useState([]);

  // ✅ Fetch all orders securely
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token: localStorage.getItem("token") }
      });

      console.log("📦 Orders API response:", response.data);

      if (response.data.success) {
        setOrders(response.data.data);
        console.log("📦 Orders set in state:", response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Handle status change
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      }, {
        headers: { token: localStorage.getItem("token") }
      });

      if (response.data.success) {
        fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("API error while updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) => 
                    `${item.name} x ${item.quantity}${idx !== order.items.length - 1 ? ', ' : ''}`
                  )}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
