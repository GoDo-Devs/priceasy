import { TextField } from "@mui/material";

const Input = ({
  label,
  name,
  value,
  onChange,
  helperText,
  type,
  required = false,
  fullWidth = true,
  size = "small",
  margin = "normal",
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      size={size}
      margin={margin}
      helperText={helperText}
      variant="outlined"
      {...props}
    />
  );
};


export default Input;
