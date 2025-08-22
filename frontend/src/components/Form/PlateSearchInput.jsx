import {
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function PlateSearchInput({
  value,
  name,
  onChange,
  label,
  onSearch,
  disabled,
  className,
  errors = [],
  error = false,
  maxLength,
  style,
}) {
  return (
    <div className={className} style={style}>
      <InputLabel className="text-white mb-1">{label}</InputLabel>
      <TextField
        fullWidth
        size="small"
        name={name}
        type="text"
        color="primary"
        variant="outlined"
        disabled={disabled}
        value={value}
        onChange={onChange}
        error={errors[name]?.length > 0 || error}
        inputProps={{
          ...(maxLength ? { maxLength } : {}),
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSearch} edge="end" disabled={disabled}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {errors[name]?.map((error) => (
        <FormHelperText key={error} error>
          {error}
        </FormHelperText>
      ))}
    </div>
  );
}

export default PlateSearchInput;
