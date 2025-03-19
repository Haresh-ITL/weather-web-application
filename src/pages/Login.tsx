// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../services/authService";
import { getPreferencesById } from "../services/weatherService";
import { TextField, Button, Container, Typography, Card, CardContent, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await login(credentials);
      localStorage.setItem("token", res.data.token);
      const preferences = await getPreferencesById(res.data.dealer.id);
      sessionStorage.setItem("userData", JSON.stringify(res.data.dealer));
      const countryString = preferences?.data?.countries || '';
      let countryArray: string[] = [];

      if (countryString) {
        const cleanedString = countryString.replace(/[{}"]/g, '');
        countryArray = cleanedString.split(',').map((country: string) => country.trim());
      }

      sessionStorage.setItem("preferences", JSON.stringify(countryArray));
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (

    <Container maxWidth="sm" sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}>
      <Card elevation={6} sx={{ mt: 10, p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register here</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
