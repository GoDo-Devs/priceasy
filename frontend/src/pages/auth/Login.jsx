import { useContext, useState } from "react";
import { Button, Grid, Paper, Typography, Box, Card } from "@mui/material";
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
  const { redirect } = useNavigateTo(); 

  const { fields, handleChange, validate, errors } = useForm({
    email: '',
    password: '',
  }, loginValidator);

  function togglePasswordVisibility () {
    setShowPassword(!showPassword)
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (await validate()) {
        await handleLogin(fields);
      };
      redirect('/')
    } finally {
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
            errors={errors}
          />
          <TextInput
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            className="mb-10"
            disabled={loading}
            endAdornment={
              showPassword
                ? <VisibilityIcon onClick={togglePasswordVisibility} />
                : <VisibilityOffIcon onClick={togglePasswordVisibility} />
            }
            onChange={handleChange}
            errors={errors}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="mt-5"
            size="large"
            fullWidth
            loading={loading}
            endIcon={<LoginIcon />}
          >
            Entrar
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

export default Login;