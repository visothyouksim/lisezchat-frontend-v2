import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, storeToken, removeToken } from "../utils/auth";
import { api } from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login : reçoit le token ET l'objet user
  const login = async (token, user) => {
    await storeToken(token);
    setUser(user);
  };

  // Logout
  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  // Initialisation au démarrage (si token présent, tente de recharger le user)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = await getToken();
      if (token) {
        try {
          const res = await api.get("/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (e) {
          setUser(null);
          await removeToken();
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(AuthContext);
}
