import React from "react";
import {CircularProgress} from "@mui/material";
import {useSession} from 'next-auth/react';
import Login from "../components/Login";
import Home from '../components/Home';

//TODO: Add Footer with version number
//TODO: Comment the Component
//TODO: For each request add the finally call
const Index = ({darkState}) => {

    const {status} = useSession();

    return (
        <>
            {status !== 'unauthenticated' ? status === 'loading' ?
                    <CircularProgress sx={{marginTop: '50vh !important', marginLeft: '50vw !important'}}/> :
                    <Home/>
                :
                <Login darkState={darkState}/>
            }
        </>
    )
}

export default Index;