import React from "react";
import { InputLabel, TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function DateInput({
  label,
  value,
  onChange,
  required = false,
}) {
  return (
    <Box width="100%">
      <InputLabel className="text-white mb-1">{label}</InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DatePicker
          format="DD/MM/YYYY"
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              required,
              margin: "none",
              InputProps: {
                sx: {
                  height: 45,
                  "& .MuiInputBase-input": {
                    padding: "8px 12px",
                  },
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}
