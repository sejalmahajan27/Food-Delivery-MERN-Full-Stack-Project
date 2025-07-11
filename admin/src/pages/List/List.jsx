import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  // ✅ Dynamic URL for local + deployed
  const url = window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://food-delivery-mern-full-stack-project.onrender.com";

  const [list, setList] = useState([]);

  // ✅ Fetch food list with token header
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, {
        headers: { token: localStorage.getItem("token") }
      });
      console.log("🍽️ Food list response:", response.data);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to load food list");
      }
    } catch (err) {
      console.error("Error fetching food list:", err);
      toast.error("Something went wrong");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, {
        headers: { token: localStorage.getItem("token") }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Failed to delete food");
      }
    } catch (err) {
      console.error("Error removing food:", err);
      toast.error("API error during deletion");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length === 0 ? (
          <p>No food items found.</p>
        ) : (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
