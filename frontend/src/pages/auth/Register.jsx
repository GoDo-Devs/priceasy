import { useState, useContext } from "react";
import { Button, Grid, Typography, Box, Card } from "@mui/material";
import TextInput from "../../components/Form/TextInput.jsx";
import authService from "../../services/authService.js";
import { AuthContext } from "../../contexts/authContext.jsx";

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
        <Card className="p-5">
          <Typography variant="h5" align="center" gutterBottom>
            Cadastro
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              name="name"
              type="text"
              className="mb-5"
              onChange={handleChange}
            />
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
            <TextInput
              label="Confirmação de Senha"
              name="confirmpassword"
              type="password"
              className="mb-5"
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" fullWidth>
              Cadastrar
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Register;
