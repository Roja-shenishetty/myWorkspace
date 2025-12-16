import React, { forwardRef } from 'react'
import TextField from '@mui/material/TextField'

const CustomInput = forwardRef(({ label, readOnly, ...props }, ref) => (
  <TextField
    inputRef={ref}
    label={label || ''}
    fullWidth
    {...props}
    {...(readOnly && { inputProps: { readOnly: true } })}
  />
))

export default CustomInput
