import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'individual' | 'institution';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithMetaMask: (address: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('arogyta_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const storedUsers = JSON.parse(localStorage.getItem('arogyta_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const user = { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name };
    setUser(user);
    localStorage.setItem('arogyta_user', JSON.stringify(user));
  };

  const loginWithMetaMask = async (address: string) => {
    // Check if user exists with this wallet
    const storedUsers = JSON.parse(localStorage.getItem('arogyta_users') || '[]');
    let foundUser = storedUsers.find((u: any) => u.walletAddress === address);
    
    if (!foundUser) {
      // Create new user with wallet
      foundUser = {
        id: crypto.randomUUID(),
        email: `${address.slice(0, 8)}@wallet.user`,
        name: `User ${address.slice(0, 6)}`,
        role: 'individual',
        walletAddress: address,
      };
      storedUsers.push(foundUser);
      localStorage.setItem('arogyta_users', JSON.stringify(storedUsers));
    }

    const user = { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name };
    setUser(user);
    localStorage.setItem('arogyta_user', JSON.stringify(user));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const storedUsers = JSON.parse(localStorage.getItem('arogyta_users') || '[]');
    
    if (storedUsers.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      role,
    };

    storedUsers.push(newUser);
    localStorage.setItem('arogyta_users', JSON.stringify(storedUsers));

    const user = { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name };
    setUser(user);
    localStorage.setItem('arogyta_user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arogyta_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithMetaMask, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
