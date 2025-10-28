import React from "react";
import Manu from "./Manu";

interface ICategory {
  id: string;
  title: string;
  query: string;
  onOrderClick: () => void;
}

const Category: React.FC<ICategory> = ({ title, onOrderClick }) => {
  return (
    <view style={{ marginBottom: '30px' }}>
      <view className="cate" style={{ padding: '10px 0' }}>
        <text className="heading" style={{ fontSize: '32px', fontWeight: '700' }}>{title}</text>
      </view>
      <list
        scroll-orientation="horizontal"
        className="horizontal-list"
        style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <list-item 
            key={`list-item-${index}`}
            item-key={`list-item-${index}`}
          >
            <Manu onOrderClick={onOrderClick} />
          </list-item>
        ))}
      </list>
    </view>
  );
};

export default Category;
