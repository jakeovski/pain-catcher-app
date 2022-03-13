import React from "react";
import {CircularProgress} from "@mui/material";
import {useSession} from 'next-auth/react';
import Login from "../components/Login";
import Footer from "../components/Footer";
import {useRouter} from "next/router";

const Index = ({darkState}) => {

    const {status} = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <CircularProgress sx={{marginTop: '50vh !important', marginLeft: '50vw !important'}}/>
        )
    }

    if (status === "authenticated") {
        router.push('/home');
        return (
            <CircularProgress sx={{marginTop: '50vh !important', marginLeft: '50vw !important'}}/>
        )
    }

    return (
        <>
            <Login darkState={darkState}/>
            <Footer/>
        </>
    )
}

export default Index;