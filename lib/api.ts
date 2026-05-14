// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
// //   headers: {
// //     "Content-Type": "application/json",
// //     Accept: "application/json",
// //   },
// //   timeout: 10000,
// // });

// // export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   timeout: 10000,
// });

// /* ================= REQUEST INTERCEPTOR ================= */
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("jb-fashions-token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ================= RESPONSE INTERCEPTOR ================= */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // OPTIONAL: auto logout on 401
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       typeof window !== "undefined"
//     ) {
//       localStorage.removeItem("jb-fashions-token");
//       localStorage.removeItem("jb-fashions-user");
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jb-fashions-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ DO NOT clear localStorage blindly
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      console.warn(
        "401 error detected from:",
        error.config?.url
      );
      // Let AuthContext decide what to do
    }

    return Promise.reject(error);
  }
);

export default api;
