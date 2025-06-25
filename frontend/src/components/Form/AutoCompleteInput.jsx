import { Autocomplete, TextField, InputLabel } from "@mui/material";

function AutoCompleteInput({
  label,
  value,
  options = [],
  onChange,
  width = "100%",
}) {
  return (
    <div style={{ width }}>
      <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>
      <Autocomplete
        disablePortal
        options={options}
        getOptionLabel={(option) => option.label || ""}
        onChange={(event, newValue) => {
          onChange(newValue?.value || "");
        }}
        value={options.find((option) => option.value === value) || null}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            sx={{
              height: 40,
              ".MuiInputBase-root": { height: 40 },
            }}
          />
        )}
      />
    </div>
  );
}

export default AutoCompleteInput;
