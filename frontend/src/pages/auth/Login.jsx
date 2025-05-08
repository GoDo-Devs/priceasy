import { useContext, useState } from "react";
import { Button, Grid, Paper, Typography, Box, Card } from "@mui/material";
import {AuthContext} from '@/contexts/authContext.jsx'
import TextInput from "@/components/Form/TextInput.jsx";
import useForm from "@/hooks/useForm.js";
import loginValidator from "@/validators/loginValidator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router";

function Login() {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const { fields, handleChange, validate, errors } = useForm({
    email: '',
    password: '',
  }, loginValidator);
  const navigate = useNavigate();

  function togglePasswordVisibility () {
    setShowPassword(!showPassword)
  }

  async function handleSubmit() {
    if (await validate() && await handleLogin(fields)) {
      navigate('/')
    };
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
        <Box>
          <TextInput
            label="Email"
            name="email"
            className="mb-5"
            onChange={handleChange}
            errors={errors}
          />
          <TextInput
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            className="mb-5"
            endAdornment={
              showPassword
                ? <VisibilityIcon onClick={togglePasswordVisibility} />
                : <VisibilityOffIcon onClick={togglePasswordVisibility} />
            }
            onChange={handleChange}
            errors={errors}
          />
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Entrar
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

export default Login;