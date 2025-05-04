import { useState, useContext } from "react";
import Input from "../../components/Form/Input.jsx";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";

import authService from "../../services/authService.js";
import {AuthContext} from '../../contexts/authContext.jsx'

function Register() {
  const [data, setData] = useState({});
  const { setIsLogged } = useContext(AuthContext);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authService.register(data);
    setIsLogged(true);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ p: 7, borderRadius: 5 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Cadastro
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              type="text"
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              onChange={handleChange}
            />
            <Input
              label="Senha"
              name="password"
              type="password"
              onChange={handleChange}
            />
            <Input
              label="Confirmação de Senha"
              name="confirmpassword"
              type="password"
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" fullWidth>
              Cadastrar
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Register;
