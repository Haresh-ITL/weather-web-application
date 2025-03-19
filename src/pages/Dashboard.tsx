import { useState, useEffect } from "react";
import { Star, StarBorder } from "@mui/icons-material";
import { getCountries } from "../services/weatherService";
import { getWeather } from "../services/weatherService";
import { postCountryPreference } from "../services/weatherService";
import {
  TextField,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

interface CountryData {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  latlng: number[];
  cca2: string;
  region: string;
  capital: string[];
  population: number;
}
const StyledCard = styled(Card)(() => ({
  background: "#ffffff",
  color: "#333",
  textAlign: "center",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  height: "260px",
  width: "250px",
}));
const dealerData = JSON.parse(sessionStorage.getItem('userData') || '{}');
let preferences = [] as any;

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "Sunny":
      return <WbSunnyIcon fontSize="large" style={{ color: "#FFD700" }} />;
    case "Clouds":
      return <CloudIcon fontSize="large" style={{ color: "#90A4AE" }} />;
    case "Snow":
      return <AcUnitIcon fontSize="large" style={{ color: "#00BFFF" }} />;
    case "Storm":
      return <ThunderstormIcon fontSize="large" style={{ color: "#6A1B9A" }} />;
    default:
      return <WbSunnyIcon fontSize="large" style={{ color: "#FFD700" }} />;
  }
};

const Dashboard = () => {
  const [country, setCountry] = useState("");
  const [countryResults, setCountryResults] = useState<CountryData[]>([]);
  const [weatherData, setWeatherData] = useState({
    city: "",
    temperature: "",
    humidity: "",
    condition: "",
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (country.length > 1) {
      fetchCountries();
    } else {
      setCountryResults([]);
      setWeatherData({
        city: "",
        temperature: "",
        humidity: "",
        condition: "",
      });
    }
    fetchPreferences();
  }, [country]);

  let fetchPreferences = () => {
    preferences = JSON.parse(sessionStorage.getItem('preferences') || '{}');
    setFavorites(preferences);

  }
  const fetchCountries = async () => {
    try {
      const res = await getCountries(country);
      setCountryResults(res.data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const handleCardClick = async (lat: any, lon: any, countryName: string) => {
    try {
      let res = await getWeather(lat, lon) as any;
      res = res.data;
      if (!res || !res.weather || res.weather.length === 0 || !res.main) {
        setWeatherData({
          city: "",
          temperature: "",
          humidity: "",
          condition: "",
        });
        return;
      }

      const weather = res.weather[0];
      const main = res.main;
      setWeatherData({
        city: countryName,
        temperature: `${(main.temp - 273.15).toFixed(1)}°C`,
        humidity: `${main.humidity}%`,
        condition: weather.main,
      });

    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData({
        city: "",
        temperature: "",
        humidity: "",
        condition: "",
      });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, cca2: string) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      let newFavorites: string[];
      if (prevFavorites.includes(cca2)) {
        // Remove the country code from the favorites
        newFavorites = prevFavorites.filter((id) => id !== cca2);
      } else {
        newFavorites = [...prevFavorites, cca2];
      }
      postCountryPreference(dealerData['id'], newFavorites);
      return newFavorites;
    });
  };


  const isFavorite = (cca2: string) => {
    return favorites.includes(cca2);
  };

  return (
    <Box display="flex" width="100vw" height="90vh" sx={{ px: 4 }}>
      <Box width="50%" paddingRight={2}>
        <Container className="dashboard-container" style={{ width: "100%" }}>
          <Paper elevation={6} style={{ padding: "20px", borderRadius: "10px" }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Country Dashboard
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  label="Enter Country"
                  fullWidth
                  variant="outlined"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Grid>

              {preferences.length > 0 && (
                <Grid item xs={12} style={{ marginTop: "20px" }}>
                  <FormControl fullWidth>
                    <InputLabel>Favorite Countries</InputLabel>
                    <Select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      label="Favorite Countries"
                    >
                      {preferences.map((pref: any, index: any) => (
                        <MenuItem key={index} value={pref}>
                          {pref}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Box
            className="results-container"
            style={{ overflowY: "auto", maxHeight: "70vh", marginTop: "20px" }}
          >
            <Grid container spacing={3} justifyContent="center">
              {countryResults.map((c) => (
                <Grid item key={c.cca2}>
                  <StyledCard onClick={() => handleCardClick(c.latlng[0], c.latlng[1], c.name.common)}>
                    <CardContent sx={{ position: 'relative' }}>
                      <Avatar
                        src={c.flags.png}
                        alt={c.name.common}
                        sx={{ width: 70, height: 70, margin: "auto" }}
                      />
                      <Typography variant="h6" sx={{ marginTop: "10px" }}>
                        {c.name.common}
                      </Typography>
                      <Typography variant="body2">Capital: {c.capital?.[0] || "N/A"}</Typography>
                      <Typography variant="body2">Region: {c.region}</Typography>
                      <Typography variant="body2">Lat/Lng: {c.latlng.join(", ")}</Typography>
                      <Typography variant="body2">Population: {c.population.toLocaleString()}</Typography>
                      <Box
                        onClick={(e) => handleFavoriteClick(e, c.name.common)}
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          cursor: "pointer",
                        }}
                      >
                        {isFavorite(c.name.common) ? (
                          <Star sx={{ color: "#FFD700" }} />
                        ) : (
                          <StarBorder sx={{ color: "#FFD700" }} />
                        )}
                      </Box>
                    </CardContent>

                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

        </Container>
      </Box>

      <Box width="50%" paddingLeft={2} display="flex" justifyContent="center" alignItems="center">
        {weatherData.city && weatherData.temperature && weatherData.condition ? (<Card
          sx={{
            width: 350,
            borderRadius: "16px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
            background: "linear-gradient(135deg, #2193b0, #6dd5ed)",
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {weatherData.city}
            </Typography>
            <Box mt={2} mb={2}>{getWeatherIcon(weatherData.condition)}</Box>
            <Typography variant="h3" fontWeight="bold">
              {weatherData.temperature}
            </Typography>
            <Typography variant="body1" mt={1}>
              Humidity: {weatherData.humidity}
            </Typography>
            <Typography variant="body1" mt={1}>
              Condition: {weatherData.condition}
            </Typography>
          </CardContent>
        </Card>) : null}
      </Box>

    </Box>
  );
};

export default Dashboard;
