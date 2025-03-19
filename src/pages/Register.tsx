// src/pages/Register.tsx
import { useState } from "react";
import { register } from "../services/authService";
import { postSubscription } from "../services/weatherService";

import { TextField, Button, Container, Typography, Card, CardContent, Box, Grid, FormControlLabel, RadioGroup, FormControl, FormLabel, Radio } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "",subscription: "monthly" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await register(user);
      if(response){
        const planPrice = user.subscription === "monthly" ? 2 : 20;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (user.subscription === "monthly" ? 1 : 12));
        const subscriptionData = {
          dealer_id: response.data.id,
          plan_price: planPrice,
          expires_at: expiresAt.toISOString(),
        };
        
        const subscriptionResponse = await postSubscription(subscriptionData);        
      }
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please login to continue.",
        confirmButtonText: "OK",
      });

      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error registering user. Try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };



  return (
    <Grid container sx={{ minHeight: "100vh", width: "100vw", margin: 0 }}>
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e0f7fa",
        p: 4,
      }}
    >
     <Container maxWidth="sm">
      <Card elevation={6} sx={{ p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Choose Subscription Plan</FormLabel>
                  <RadioGroup name="subscription"  value={user.subscription} onChange={handleChange}>
                    <FormControlLabel value="monthly" control={<Radio />} label="Monthly - $2" />
                    <FormControlLabel value="yearly" control={<Radio />} label="Yearly - $20" />
                  </RadioGroup>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Already have an account? <Link to="/">Login here</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Grid>
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=60')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        p: 4,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Weather App
      </Typography>
      <Typography variant="h6" sx={{ maxWidth: "400px" }}>
        Get real-time country weather at your fingertips.
      </Typography>
    </Grid>
  </Grid>
   
  );
};

export default Register;
