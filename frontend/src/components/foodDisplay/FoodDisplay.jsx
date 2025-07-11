import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../foodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  if (!food_list || !Array.isArray(food_list)) {
    return <p>Loading food items...</p>;
  }

  const filtered = food_list.filter(item =>
    category === "All" || item.category === category
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filtered.length === 0
          ? <p>No food items found for this category.</p>
          : filtered.map(item => (
            <FoodItem key={item._id} {...item} id={item._id} />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
