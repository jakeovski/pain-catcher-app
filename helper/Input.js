import React from "react";
import {Grid, IconButton, InputAdornment, TextField} from "@mui/material";
import {Visibility,VisibilityOff} from '@mui/icons-material'

const Input = ({
    name,
    handleChange,
    label,
    half,
    autoFocus,
    type,
    handleShowPassword,
    value
}) => {
    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                name={name}
                onChange={handleChange}
                autoFocus={autoFocus}
                label={label}
                type={type}
                value={value}
                variant="outlined"
                required
                fullWidth
                InputProps={
                    name === 'password' ? {
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton onClick={handleShowPassword}>
                                    {type === 'password' ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    } : null
                }
            />
        </Grid>
    )
}

export default Input;