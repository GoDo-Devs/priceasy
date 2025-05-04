import { useState, useContext } from "react";
import { Button, Grid, Paper, Typography, Box, Card } from "@mui/material";
import authService from "../../services/authService.js";
import {AuthContext} from '../../contexts/authContext.jsx'
import TextInput from "../../components/Form/TextInput.jsx";

function Login() {
  const [data, setData] = useState({});
  const { setIsLogged } = useContext(AuthContext);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authService.login(data);
    setIsLogged(true);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="h-screen"
    >
      <Card className="p-5">
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            name="email"
            className="mb-5"
            onChange={handleChange}
          />
          <TextInput
            label="Senha"
            name="password"
            type="password"
            className="mb-5"
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

export default Login;