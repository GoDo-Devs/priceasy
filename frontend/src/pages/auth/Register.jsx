import { useContext, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AuthContext } from "@/contexts/authContext.jsx";
import TextInput from "@/components/Form/TextInput.jsx";
import useForm from "@/hooks/useForm.js";
import registerValidator from "@/validators/registerValidator";
import editUserValidator from "@/validators/editUserValidator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

function Register({ user = {}, onCreate = () => {} }) {
  const isEditing = Boolean(user?.id);
  const validator = isEditing ? editUserValidator : registerValidator;
  const { handleRegister, updateUser, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getInitialFields(user) {
    return {
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmpassword: user.id ? undefined : "",
      is_admin: user.is_admin || false,
    };
  }

  const { fields, handleChange, validate, errors } = useForm(
    getInitialFields(user),
    validator
  );

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!(await validate())) {
        setLoading(false);
        return;
      }

      const payload = {
        name: fields.name,
        email: fields.email,
        is_admin: fields.is_admin,
      };

      if (fields.password?.trim().length > 0) {
        payload.password = fields.password;
      }

      if (user.id) {
        await updateUser(user.id, payload);
        setUser((prev) => ({ ...prev, ...payload }));
      } else {
        await handleRegister({
          ...payload,
          confirmpassword: fields.confirmpassword,
        });
      }

      onCreate();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="p-5">
      <Typography variant="h5" align="center" gutterBottom>
        {user.id ? "Editar Usuário" : "Cadastro"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} p={1}>
        <TextInput
          label="Nome"
          name="name"
          className="mb-5"
          value={fields.name}
          onChange={handleChange}
          errors={errors}
          disabled={loading}
        />
        <TextInput
          label="Email"
          name="email"
          className="mb-5"
          value={fields.email}
          disabled={loading}
          onChange={handleChange}
          errors={errors}
        />
        <TextInput
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          className="mb-5"
          value={fields.password}
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
          placeholder={isEditing ? "Só preencha se for trocar a senha" : ""}
          errors={errors}
        />

        {!isEditing && (
          <TextInput
            label="Confirmação de Senha"
            name="confirmpassword"
            type={showPassword ? "text" : "password"}
            className="mb-1"
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
        )}

        <FormControlLabel
          className="mb-2"
          control={
            <Checkbox
              name="is_admin"
              checked={fields.is_admin}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "is_admin",
                    value: e.target.checked,
                  },
                })
              }
              disabled={loading}
            />
          }
          label="Administrador"
        />
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          className="mt-5"
          size="large"
          fullWidth
          disabled={loading}
          endIcon={<LoginIcon />}
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
}

export default Register;
