import { Autocomplete, TextField, InputLabel, Popper } from "@mui/material";
import { useState } from "react";

const CustomPopper = function (props) {
  return <Popper {...props} placement="bottom-start" />;
};

function AutoCompleteInput({
  label,
  value,
  options = [],
  onChange,
  onInputChange,
  width = "100%",
  freeSolo = false,
  disabled = false,
  ...rest
}) {
  const [inputValue, setInputValue] = useState("");
  const selectedOption = freeSolo
    ? value
    : options.find((opt) => {
        return (
          String(opt.value) === String(value) ||
          String(opt.label) === String(value)
        );
      }) || null;

  return (
    <div style={{ width }}>
      <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>
      <Autocomplete
        freeSolo={freeSolo}
        options={options}
        PopperComponent={CustomPopper}
        getOptionLabel={(option) => {
          if (freeSolo) {
            if (typeof option === "string") return option;
            return option.label || "";
          }
          return option.label || "";
        }}
        isOptionEqualToValue={(option, val) => {
          if (freeSolo) {
            if (typeof option === "string") return option === val;
            return (
              String(option.value) === String(val) ||
              String(option.label) === String(val)
            );
          }
          return (
            String(option.value) === String(val?.value) ||
            String(option.label) === String(val?.label)
          );
        }}
        onChange={(event, newValue) => {
          if (freeSolo) {
            if (typeof newValue === "string") {
              onChange?.(newValue);
            } else if (newValue?.value !== undefined) {
              onChange?.(newValue.value);
            } else {
              onChange?.("");
            }
          } else {
            onChange?.(newValue?.value ?? "");
          }
        }}
        onInputChange={(event, newInputValue, reason) => {
          setInputValue(newInputValue);
          onInputChange?.(newInputValue);
        }}
        value={selectedOption}
        inputValue={inputValue}
        clearIcon={null}
        popupIcon={null}
        disabled={disabled}
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
