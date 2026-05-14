// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(undefined);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ===== Load auth from localStorage ===== */
//   useEffect(() => {
//     const savedUser = localStorage.getItem("jb-fashions-user");
//     const savedToken = localStorage.getItem("jb-fashions-token");

//     if (savedUser && savedToken) {
//       setUser(JSON.parse(savedUser));
//       setToken(savedToken);
//     }

//     setLoading(false);
//   }, []);

//   /* ===== Persist auth to localStorage ===== */
//   useEffect(() => {
//     if (user && token) {
//       localStorage.setItem("jb-fashions-user", JSON.stringify(user));
//       localStorage.setItem("jb-fashions-token", token);
//     } else {
//       localStorage.removeItem("jb-fashions-user");
//       localStorage.removeItem("jb-fashions-token");
//     }
//   }, [user, token]);

//   /* ================= ACTIONS ================= */

//   const login = (jwtToken, userData) => {
//     setToken(jwtToken);
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("cartSynced");
//   };

//   const updateUser = (userData) => {
//     setUser((prev) => (prev ? { ...prev, ...userData } : prev));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isAuthenticated: !!token,
//         login,
//         logout,
//         updateUser,
//         loading,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 LOGIN MODAL STATE
  const [loginOpen, setLoginOpen] = useState(false);

  /* ===== Load auth from localStorage ===== */
  useEffect(() => {
    const savedUser = localStorage.getItem("jb-fashions-user");
    const savedToken = localStorage.getItem("jb-fashions-token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  /* ===== Persist auth ===== */
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("jb-fashions-user", JSON.stringify(user));
      localStorage.setItem("jb-fashions-token", token);
    } else {
      localStorage.removeItem("jb-fashions-user");
      localStorage.removeItem("jb-fashions-token");
    }
  }, [user, token]);

  /* ================= ACTIONS ================= */

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    setLoginOpen(false); // ✅ auto-close modal
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cartSynced");
  };

  const updateUser = (userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  // 🔓 LOGIN MODAL CONTROLS
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,

        login,
        logout,
        updateUser,

        // 🔥 modal controls
        loginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
