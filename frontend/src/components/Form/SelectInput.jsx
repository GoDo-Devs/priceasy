import { InputLabel, TextField, MenuItem } from "@mui/material";

function SelectInput({
  value,
  name,
  onChange,
  label,
  options = [],
  className,
  style
}) {
  return (
    <div className={className} style={style}>
      <InputLabel className="text-white mb-1">{label}</InputLabel>
      <TextField
        select
        fullWidth
        size="small"
        name={name}
        value={value} 
        onChange={onChange}
        variant="outlined"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default SelectInput;
