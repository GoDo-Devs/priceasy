import { useContext, useState } from "react";
import { Button, Grid, Typography, Box, Card } from "@mui/material";
import { AuthContext } from "@/contexts/authContext.jsx";
import TextInput from "@/components/Form/TextInput.jsx";
import useForm from "@/hooks/useForm.js";
import registerValidator from "@/validators/registerValidator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import LoginIcon from "@mui/icons-material/Login";

function Register() {
  const { handleRegister } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fields, handleChange, validate, errors } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmpassword: ""
    },
    registerValidator
  );
  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (await validate()) {
        await handleRegister(fields);
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Card
          className="px-8 pb-8 d-flex"
          variant="outlined"
          sx={{ width: "400px", borderRadius: "20px" }}
        >
          <Typography sx={{marginTop: 5}} variant="h5" align="center" gutterBottom>
            Cadastro
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              name="name"
              type="text"
              className="mb-5"
              disabled={loading}
              onChange={handleChange}
              errors={errors}
            />
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
              className="mb-5"
              disabled={loading}
              endAdornment={
                showPassword ? (
                  <VisibilityIcon
                    sx={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <VisibilityOffIcon
                    sx={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  />
                )
              }
              onChange={handleChange}
              errors={errors}
            />
            <TextInput
              label="Confirmação de Senha"
              name="confirmpassword"
              type={showPassword ? "text" : "password"}
              className="mb-10"
              disabled={loading}
              endAdornment={
                showPassword ? (
                  <VisibilityIcon
                    sx={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <VisibilityOffIcon
                    sx={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  />
                )
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
              Cadastrar
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Register;
