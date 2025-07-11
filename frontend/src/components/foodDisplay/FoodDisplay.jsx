import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../foodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  if (!Array.isArray(food_list) || food_list.length === 0) {
    return (
      <div className="food-display">
        <h2>Top dishes near you</h2>
        <p>Loading menu or no items available...</p>
      </div>
    );
  }

  const filteredItems = food_list.filter(item =>
    category === "All" || category === item.category
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredItems.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
