// src/services/weatherService.ts
import axios from "axios";

const API_URL = "http://localhost:3002/weather";

export const getCountries = async (country:any) => {
  return axios.get(`https://restcountries.com/v3.1/name/${country}`);
};

export const getWeather = async (lat: string, lon: string) => {
  return axios.get(`${API_URL}/current?lat=${lat}&lon=${lon}`);
};

export const postCountryPreference = async (dealer_id: string, countries: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/set-preference`, {
      dealer_id,
      countries,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting country preference:", error);
    throw error;
  }
};

export const getPreferencesById = async (id:any) => {
  return axios.get(`${API_URL}/preferences?dealer_id=${id}`);
};

export const postSubscription = async (subscriptionData: { dealer_id: string; plan_price: number; expires_at: string }) => {
  try {
    const response = await axios.post(`${API_URL}/subscribe`, subscriptionData);
    return response.data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};
