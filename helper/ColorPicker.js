import React from 'react';
import {Button, Grid, Popover, styled, Typography} from "@mui/material";
import {HexColorInput, HexColorPicker} from "react-colorful";


const ColorInput = styled(HexColorInput)({
    textTransform: 'uppercase',
    marginTop: '1vh',
    width: '90%'
});

const ColorPicker = (props) => {
    const {open, selectedValue, handleColorChange, onClose, id, anchorEl} = props;

    const handleClose = () => {
        onClose(selectedValue);
    }

    return (
        <Popover
            open={open} onClose={handleClose} id={id}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
        >
            <Grid container spacing={1}
                  sx={{
                      // width:'15vw',
                      // height:'35vh',
                      display: 'flex',
                      justifyContent: 'start',
                      padding: '0px 15px 15px 15px',
                      '& .react-colorful': {
                          width: '100%'
                      }
                  }}
            >
                <Grid item xs={12}>
                    <Typography variant="body1">Select Color</Typography>
                </Grid>
                <Grid item xs={12}>
                    <HexColorPicker color={selectedValue} onChange={handleColorChange}/>
                </Grid>
                <Grid item xs={6}>
                    <ColorInput color={selectedValue} onChange={handleColorChange}/>
                </Grid>
                <Grid item xs={6} sx={{textAlign: 'end'}}>
                    <Button variant="contained" onClick={handleClose}>Save</Button>
                </Grid>
            </Grid>

        </Popover>
    )


}

export default ColorPicker;