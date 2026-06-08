// FoodTicker.jsx
import "../../styles/foodTicker.css";

const images = [
  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
];

export default function FoodTicker() {
  return (
    <div className="food-ticker">
      <div className="ticker-content">
        {[...images, ...images].map((src, index) => (
          <div key={index} className="ticker-item">
            <img src={src} alt="food" />
          </div>
        ))}
      </div>
    </div>
  );
}
