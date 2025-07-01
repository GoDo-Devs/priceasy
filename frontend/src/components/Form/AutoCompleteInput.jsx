import { Autocomplete, TextField, InputLabel } from "@mui/material";

function AutoCompleteInput({
  label,
  value,
  options = [],
  onChange,
  onInputChange,
  width = "100%",
  freeSolo = false,
  ...rest
}) {
  return (
    <div style={{ width }}>
      <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>
      <Autocomplete
        freeSolo={freeSolo}
        disablePortal
        options={options}
        getOptionLabel={(option) => {
          if (freeSolo) {
            // Para freeSolo, o valor pode ser string ou objeto
            if (typeof option === "string") return option;
            return option.label || "";
          }
          // Para não freeSolo, o valor deve ser objeto
          return option.label || "";
        }}
        isOptionEqualToValue={(option, val) => {
          if (freeSolo) {
            if (typeof option === "string") return option === val;
            return option.value === val || option.label === val;
          }
          return option.value === val;
        }}
        onChange={(event, newValue) => {
          if (freeSolo) {
            if (typeof newValue === "string") {
              onChange?.(newValue);
            } else if (newValue?.value) {
              onChange?.(newValue.value);
            } else {
              onChange?.("");
            }
          } else {
            onChange?.(newValue?.value || "");
          }
        }}
        onInputChange={(event, newInputValue, reason) => {
          if (onInputChange) onInputChange(newInputValue);
        }}
        value={
          freeSolo
            ? value
            : options.find((option) => option.value === value) || null
        }
        clearIcon={null}
        popupIcon={null}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            sx={{
              height: 40,
              ".MuiInputBase-root": {
                height: 40,
                paddingRight: "8px !important",
              },
              "& .MuiAutocomplete-endAdornment": {
                display: "none !important",
              },
            }}
            {...rest}
          />
        )}
      />
    </div>
  );
}

export default AutoCompleteInput;
