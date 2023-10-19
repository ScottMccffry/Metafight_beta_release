// AuthContext.js
import { createContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  userId: '',
  loginUser: () => {},
  logoutUser: () => {}
});

export default AuthContext;