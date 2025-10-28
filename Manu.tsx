import React from "react";

interface ManuProps {
  onOrderClick: () => void;
}

const Manu: React.FC<ManuProps> = ({ onOrderClick }) => {
  const handlePress = () => {
    onOrderClick();
  };

  return (
    <view className="card" style={{ backgroundColor: '#ffffff', border: '3px solid #333333', padding: '15px', borderRadius: '15px', width: '180px' }}>
      <image 
        src="https://via.placeholder.com/150" 
        className="image"
      />
      <text className="card_title">Place Holder</text>
      <view 
        className="button" 
        style={{ backgroundColor: '#16c47f', padding: '12px 20px', borderRadius: '8px', border: '2px solid #0fa76b', width: '100%' }}
        bindtap={handlePress}
      >
        <text className="button_text">Order Now</text>
      </view>
    </view>
  );
};

export default Manu;