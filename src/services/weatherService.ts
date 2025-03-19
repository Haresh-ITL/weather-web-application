import { weatherClient } from "./apiClient";

export const getCountries = async (country: string) => {
  return weatherClient.get(`https://restcountries.com/v3.1/name/${country}`);
};

export const getWeather = async (lat: string, lon: string) => {
  return weatherClient.get(`/current?lat=${lat}&lon=${lon}`);
};

export const postCountryPreference = async (dealer_id: string, countries: string[]) => {
  try {
    const response = await weatherClient.post(`/set-preference`, {
      dealer_id,
      countries,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting country preference:", error);
    throw error;
  }
};

export const getPreferencesById = async (id: string) => {
  return weatherClient.get(`/preferences?dealer_id=${id}`);
};

export const postSubscription = async (subscriptionData: { dealer_id: string; plan_price: number; expires_at: string }) => {
  try {
    const response = await weatherClient.post(`/subscribe`, subscriptionData);
    return response.data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};
