import React, { useEffect, useState } from 'react';
import Category from './container/Category';
import CartPage from './container/CartPage';

interface AppProps {
  onRender?: () => void;
}

interface CartItem {
  id: string;
  name: string;
}

interface User {
  name: string;
  email: string;
}

interface StoredUsers {
  [email: string]: {
    name: string;
    password: string;
  };
}

const categories = [
  { id: '1', title: 'Category 1', query: 'query1' },
  { id: '2', title: 'Category 2', query: 'query2' },
  { id: '3', title: 'Category 3', query: 'query3' },
];

// LINE Bot Configuration
const LINE_CHANNEL_ACCESS_TOKEN = 'your token';
const LINE_USER_ID = 'your token'; // Your LINE user ID (starts with U)

const App: React.FC<AppProps> = ({ onRender }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUsers>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (onRender) onRender();
  }, [onRender]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const sendLineNotification = async (orderEmail: string, items: CartItem[]) => {
    try {
      const itemsList = items.map(item => `- ${item.name}`).join('\n');
      const message = `📦 New Order Received!\n\n${orderEmail}\n${itemsList}`;

      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: LINE_USER_ID,
          messages: [
            {
              type: 'text',
              text: message
            }
          ]
        })
      });

      if (response.ok) {
        console.log('LINE notification sent successfully');
      } else {
        console.error('Failed to send LINE notification:', await response.text());
      }
    } catch (error) {
      console.error('Failed to send LINE notification:', error);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }

    if (users[email] && users[email].password === password) {
      const userData = { name: users[email].name, email };
      setUser(userData);
      setEmail('');
      setPassword('');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleSignup = () => {
    if (!email || !password || !name) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (users[email]) {
      setErrorMessage('Email already exists');
      return;
    }

    const newUsers = { ...users, [email]: { name, password } };
    setUsers(newUsers);
    
    const userData = { name, email };
    setUser(userData);
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage('');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleOrderClick = () => {
    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      name: 'Place Holder',
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOrderAll = () => {
    if (cartItems.length === 0) {
      return;
    }

    // Send LINE notification
    if (user) {
      sendLineNotification(user.email, cartItems);
    }

    setCartItems([]);
    setShowCart(false);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleBackClick = () => {
    setShowCart(false);
  };

  // 🔒 Login/Signup Screen
  if (!user) {
    return (
      <scroll-view className="container">
        <view style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
          <text style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </text>

          {errorMessage && (
            <view style={{ 
              backgroundColor: '#ff4444', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '15px'
            }}>
              <text style={{ color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                {errorMessage}
              </text>
            </view>
          )}

          {isSignup && (
            <view style={{ marginBottom: '15px' }}>
              <text style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Name</text>
              <input
                type="text"
                placeholder="Enter your name"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '16px' }}
                bindinput={(e: any) => setName(e.detail.value)}
              />
            </view>
          )}

          <view style={{ marginBottom: '15px' }}>
            <text style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Email</text>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '16px' }}
              bindinput={(e: any) => setEmail(e.detail.value)}
            />
          </view>

          <view style={{ marginBottom: '20px' }}>
            <text style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px', display: 'block' }}>Password</text>
            <input
              type="password"
              placeholder="Enter your password"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '16px' }}
              bindinput={(e: any) => setPassword(e.detail.value)}
            />
          </view>

          <view 
            style={{ 
              backgroundColor: '#16c47f', 
              padding: '15px', 
              borderRadius: '8px',
              border: '2px solid #0fa76b',
              textAlign: 'center',
              marginBottom: '15px'
            }}
            bindtouchend={isSignup ? handleSignup : handleLogin}
          >
            <text style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>
              {isSignup ? 'Sign Up' : 'Login'}
            </text>
          </view>

          <view style={{ textAlign: 'center' }}>
            <text style={{ fontSize: '14px', color: '#666' }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </text>
            <text 
              style={{ fontSize: '14px', color: '#16c47f', fontWeight: '700', marginLeft: '5px', cursor: 'pointer' }}
              bindtouchend={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </text>
          </view>
        </view>
      </scroll-view>
    );
  }

  // 🛒 Show cart
  if (showCart) {
    return (
      <CartPage
        cartItems={cartItems}
        onBack={handleBackClick}
        onDelete={handleDeleteItem}
        onOrderAll={handleOrderAll}
      />
    );
  }

  return (
    <scroll-view className="container">
      {/* Header with user info and logout */}
      <view style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <text style={{ fontSize: '20px', fontWeight: '700' }}>Hello, {user.name}</text>
        <view 
          style={{ 
            backgroundColor: '#ff4444', 
            padding: '10px 20px', 
            borderRadius: '8px',
            border: '2px solid #cc0000'
          }}
          bindtouchend={handleLogout}
        >
          <text style={{ color: '#fff', fontWeight: '700' }}>Logout</text>
        </view>
      </view>

      {/* Categories */}
      <view className="content" style={{ padding: '20px' }}>
        {categories.map((cate) => (
          <Category key={cate.id} {...cate} onOrderClick={handleOrderClick} />
        ))}
      </view>

      {/* Cart button */}
      <view 
        className="cart-button" 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          backgroundColor: '#16c47f', 
          width: '60px', 
          height: '60px', 
          borderRadius: '30px', 
          border: '3px solid #0fa76b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        bindtouchend={handleCartClick}
      >
        <text style={{ fontSize: '24px' }}>🛒</text>
        {cartItems.length > 0 && (
          <view 
            style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              backgroundColor: '#ff4444', 
              width: '24px', 
              height: '24px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <text style={{ color: '#ffffff', fontSize: '12px', fontWeight: '700' }}>
              {cartItems.length}
            </text>
          </view>
        )}
      </view>
    </scroll-view>
  );
};

export default App;
