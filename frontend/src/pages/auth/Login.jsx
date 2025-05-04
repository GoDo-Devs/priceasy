import React, { useContext, useEffect, useState } from "react";
import authService from "../../services/authService";
import { AuthContext } from "../../contexts/authContext";
import {
  Card,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextInput from "../../components/Form/TextInput";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleTogglePassword() {
    setShowPassword((prev) => !prev);
  };

  async function handleLogin() {
      const response = await authService.login({email, password});
      localStorage.setItem('access-token', response.data.token);
  };


  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      className="h-screen"
    >
      <Card className="p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Entrar</h2>
        <TextInput
          fullWidth
          label="Email"
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5"
        />

        <TextInput
          label="Senha"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment= {
            <IconButton onClick={handleTogglePassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          }
          className="mb-5"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="py-2 text-white"
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Card>
    </Grid>
  );
}

export default Login;