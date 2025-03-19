// src/pages/Register.tsx
import { useState } from "react";
import { register } from "../services/authService";
import { TextField, Button, Container, Typography, Card, CardContent, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await register(user);

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
    <Container maxWidth="sm">
      <Card elevation={6} sx={{ mt: 10, p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
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
  );
};

export default Register;
