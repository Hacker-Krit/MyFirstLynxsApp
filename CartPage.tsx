import React from "react";

interface CartItem {
  id: string;
  name: string;
}

interface CartPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onOrderAll: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onBack, onDelete, onOrderAll }) => {
  return (
    <view style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Back Button */}
      <view style={{ padding: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <view 
          style={{ 
            backgroundColor: '#16c47f', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: '2px solid #0fa76b',
            width: '100px'
          }}
          bindtouchend={onBack}
        >
          <text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700' }}>← Back</text>
        </view>
      </view>

      {/* Cart Title */}
      <view style={{ padding: '20px' }}>
        <text style={{ fontSize: '32px', fontWeight: '700' }}>Your Cart</text>
        <text style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </text>
      </view>

      {/* Scrollable Cart Items List */}
      {cartItems.length === 0 ? (
        <view style={{ padding: '40px', textAlign: 'center' }}>
          <text style={{ fontSize: '18px', color: '#999' }}>Your cart is empty</text>
        </view>
      ) : (
        <list
          scroll-orientation="vertical"
          style={{ flex: '1', padding: '0 20px' }}
        >
          {cartItems.map((item, index) => (
            <list-item 
              key={item.id}
              item-key={`cart-item-${index}`}
            >
              <view 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e0e0e0', 
                  padding: '15px', 
                  borderRadius: '10px',
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <text style={{ fontSize: '16px', fontWeight: '600', flex: '1' }}>
                  {item.name}
                </text>
                <view 
                  style={{ 
                    backgroundColor: '#ff4444', 
                    padding: '8px 16px', 
                    borderRadius: '6px',
                    border: '2px solid #cc0000'
                  }}
                  bindtouchend={() => onDelete(item.id)}
                >
                  <text style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>Delete</text>
                </view>
              </view>
            </list-item>
          ))}
        </list>
      )}

      {/* Order All Button - Fixed at Bottom */}
      {cartItems.length > 0 && (
        <view style={{ padding: '20px', borderTop: '2px solid #e0e0e0' }}>
          <view 
            style={{ 
              backgroundColor: '#16c47f', 
              padding: '15px', 
              borderRadius: '10px', 
              border: '3px solid #0fa76b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            bindtouchend={onOrderAll}
          >
            <text style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700' }}>
              Order All ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </text>
          </view>
        </view>
      )}
    </view>
  );
};

export default CartPage;
