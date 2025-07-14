import { FormHelperText, InputLabel, TextField } from "@mui/material";

function TextInput({
  type,
  value,
  name,
  onChange,
  endAdornment,
  startAdornment,
  label,
  placeholder,
  disabled,
  className,
  errors = [],
  error = false,
  maxLength,
  style
}) {
  return (
    <div className={className} style={style}>
      <InputLabel className="text-white mb-1">{label}</InputLabel>
      <TextField
        fullWidth
        size="small"
        name={name}
        placeholder={placeholder}
        type={type}
        color="primary"
        variant="outlined"
        disabled={disabled}
        value={value} 
        onChange={onChange}
        slotProps={{
          input: {
            inputProps: {
              ...(maxLength ? { maxLength } : {}),
            },
            endAdornment: endAdornment,
            startAdornment: startAdornment,
          },
        }}
        error={errors[name]?.length > 0 || error}
      />
      {errors[name]?.map((error) => (
        <FormHelperText error>{error}</FormHelperText>
      ))}
    </div>
  );
}

export default TextInput;
