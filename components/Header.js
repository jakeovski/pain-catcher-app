import React, {useState} from 'react';
import AppBar from "@mui/material/AppBar";
import {IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import Image from "next/image";
import {signOut} from "next-auth/react";

/**
 * Header Component
 * @param darkState - Dark theme state
 * @param session - Session data
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({darkState,session}) => {

    const [anchorEl,setAnchorEl] = useState(null);

    /**
     * Handles menu opening
     * @param event - Event
     */
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    /**
     * Handles the menu closure
     */
    const handleClose = () => {
        setAnchorEl(null);
    }

    return(
        <AppBar position="static" color="primary" sx={{marginTop:'1vh', borderRadius:'10px'}}>
            <Toolbar
                sx={{
                    justifyContent:'space-between'
                }}
            >
                {darkState ?
                    <Image
                        src="/darkHeaderLogo.svg"
                        height="80vh" width="250vw"
                        alt="PainCatcher Dark Logo"
                    />
                    :
                    <Image src="/lightHeaderLogo.svg"
                           height="80vh" width="250vw"
                           alt="PainCatcher Light Logo"
                    />
                }
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    alignItems:'center'
                }}>
                        <Typography>{session.user.firstName} {session.user.lastName}</Typography>

                        <IconButton
                            size="large"
                            aria-label="current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical:'bottom',
                            horizontal:'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical:'top',
                            horizontal:'right'
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={signOut}>Sign Out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header;