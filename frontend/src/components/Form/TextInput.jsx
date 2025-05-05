import React from 'react'
import { FormHelperText, InputLabel, TextField } from '@mui/material'

function TextInput({
    type,
    value,
    name,
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
        <InputLabel className="text-white mb-1">
            { label }
        </InputLabel>
        <TextField
            fullWidth
            size='small'
            name={name}
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
            error={errors[name]?.length > 0}
        />
        {errors[name]?.map((error) => (
            <FormHelperText error>
                { error } 
            </FormHelperText>
        ))}
    </div>
  )
}

export default TextInput