import { useContext, useState } from "react";
import { Button, Grid, Typography, Box, Card, FormHelperText } from "@mui/material";
import {AuthContext} from '@/contexts/authContext.jsx'
import TextInput from "@/components/Form/TextInput.jsx";
import useForm from "@/hooks/useForm.js";
import loginValidator from "@/validators/loginValidator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import useNavigateTo from "../../hooks/useNavigateTo";

function Login() {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { redirect } = useNavigateTo(); 

  const { fields, handleChange, validate, errors, setErrors } = useForm({
    email: '',
    password: '',
  }, loginValidator);

  function togglePasswordVisibility () {
    setShowPassword(!showPassword)
  }

  async function handleSubmit() {
    try {
      setLoginError(false);
      setLoading(true);

      if (await validate()) {
        await handleLogin(fields);

        redirect('/')
      };
    } catch(e) {
      setLoginError('Usuário ou senha inválido');
    }finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="h-screen"
    >
      <Card
        className="px-8 pb-8 d-flex" variant="outlined"
        sx={{ width: '400px', borderRadius: '20px' }}
      >
        <img src="../../logo.png" width={180} className="ms-auto me-auto" />
        <Typography variant="h6" align="center" gutterBottom>
          Bem Vindo !
        </Typography>
        <Box>
          <TextInput
            label="Email"
            name="email"
            className="mb-5"
            disabled={loading}
            onChange={handleChange}
            error={loginError}
            errors={errors}
          />
          <TextInput
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            disabled={loading}
            endAdornment={
              showPassword
                ? <VisibilityIcon sx={{cursor: 'pointer'}} onClick={togglePasswordVisibility} />
                : <VisibilityOffIcon sx={{cursor: 'pointer'}} onClick={togglePasswordVisibility} />
            }
            onChange={handleChange}
            error={loginError}
            errors={errors}
          />

          {loginError &&
            <FormHelperText error>{loginError}</FormHelperText>
          }

          <div className="mt-10">
            <Button
              onClick={handleSubmit}
              variant="contained"
              size="large"
              fullWidth
              loading={loading}
              endIcon={<LoginIcon />}
            >
              Entrar
            </Button>
          </div>
        </Box>
      </Card>
    </Grid>
  );
}

export default Login;