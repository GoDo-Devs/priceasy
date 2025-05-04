import React from 'react'
import { FormHelperText, InputLabel, TextField } from '@mui/material'

function TextInput({
    type,
    value,
    onChange,
    endAdornment,
    startAdornment,
    label,
    placeholder,
    className,
    errors = [],
}) {
  return (
    <div className={className}>
        <InputLabel>
            { label }
        </InputLabel>
        <TextField
            fullWidth
            size='small'
            placeholder={placeholder}
            type={type}
            variant="outlined"
            value={value}
            onChange={onChange}
            slotProps={{
                input: {
                    endAdornment: endAdornment,
                    startAdornment: startAdornment
                },
            }}
            error={errors.length > 0}
        />
        <FormHelperText>
            {errors.map((error) => (
                <caption>{error}</caption>
            ))}
        </FormHelperText>
    </div>
  )
}

export default TextInput