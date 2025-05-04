import React, { useMemo, createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext(null);

// Create mock user data
const mockUser = {
  user_id: '-1',
  name: 'John Doe',
  email: 'john@example.com',
  user_type: 'USER', // or 'Company'
};

const noUser = {
  user_id: null,
  name: 'Guest',
  user_type: 'GUEST'
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simple login/logout
  const login = (userData) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(noUser);
    setIsLoading(false);
  };

  // Set user
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(noUser); // Use noUser for testing
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
