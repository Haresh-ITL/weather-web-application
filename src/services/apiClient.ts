import axios from "axios";

// Base URLs for microservices
const AUTH_API_URL = "http://localhost:3001/auth";
const WEATHER_API_URL = "http://localhost:3002/weather";

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: { "Content-Type": "application/json" },
});

const weatherClient = axios.create({
  baseURL: WEATHER_API_URL,
  headers: { "Content-Type": "application/json" },
});

const attachInterceptors = (client: any) => {
    client.interceptors.request.use(
        (config: any) => {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error: any) => Promise.reject(error)
      );

  client.interceptors.response.use(
    (response:any) => response,
    (error:any) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
};

attachInterceptors(authClient);
attachInterceptors(weatherClient);

const token = localStorage.getItem("token");
if (token) {
  authClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  weatherClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export { authClient, weatherClient };
