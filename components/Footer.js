import React from 'react';
import packageJson from '/package.json';
import {Container, Tooltip, Typography} from "@mui/material";


/**
 * Footer Component
 * @returns {JSX.Element}
 * @constructor
 */
const Footer = () => {
    return(
        <Container maxWidth="false" sx={{
            textAlign:"center",
            position: 'absolute',
            bottom:0,
            width: '100% !important',
            padding:'0.5em',
            backgroundColor:'rgba(0,0,0,0.04)'
        }}>
            <Tooltip title={`Pain Catcher ver. ${packageJson.version}`} arrow>
                <Typography variant="body1">Copyright © 2022 Robert Gordon University</Typography>
            </Tooltip>
        </Container>
    )
}

export default Footer;