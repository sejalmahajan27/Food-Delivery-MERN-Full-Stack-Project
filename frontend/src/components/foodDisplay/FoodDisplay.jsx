import React, { useContext, useEffect } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../foodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  useEffect(() => {
    console.log("Loaded food_list:", food_list);
  }, [food_list]);

  // If food_list is not yet available, show a loader
  if (!food_list || !Array.isArray(food_list)) {
    return (
      <div className="food-display">
        <h2>Top dishes near you</h2>
        <p>Loading menu or failed to fetch data...</p>
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
        {filteredItems.length === 0 ? (
          <p>No items found for this category.</p>
        ) : (
          filteredItems.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
