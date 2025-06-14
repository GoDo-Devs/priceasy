import { useContext, useState } from "react";
import { Button, Grid, Typography, Box, Card } from "@mui/material";
import { AuthContext } from "@/contexts/authContext.jsx";
import TextInput from "@/components/Form/TextInput.jsx";
import useForm from "@/hooks/useForm.js";
import registerValidator from "@/validators/registerValidator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

function Register({ onCreate = () => {} }) {
  const { handleRegister } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fields, handleChange, validate, errors } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    registerValidator
  );

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (await validate()) {
        await handleRegister(fields);
      }
      onCreate();
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message ?? "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      <Typography
        variant="h5"
        align="center"
        gutterBottom
      >
        Cadastro
      </Typography>
      <Box component="form" onSubmit={handleSubmit} p={1}>
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
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
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
    </div>
  );
}

export default Register;
