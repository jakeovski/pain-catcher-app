import React from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "../../components/Header";
import {CircularProgress, Container} from "@mui/material";
import Dashboard from "../../components/Dashboard";

const Home = ({darkState}) => {
    const router = useRouter();
    const {data: session, status} = useSession();


    if (status === "loading") {
        return (
            <CircularProgress sx={{marginTop: '50vh !important', marginLeft: '50vw !important'}}/>
        )
    }

    if (status === "unauthenticated") {
        router.push('/');
        return (
            <CircularProgress sx={{marginTop: '50vh !important', marginLeft: '50vw !important'}}/>
        )
    }

    return (
        <Container maxWidth="xl">
            <Header darkState={darkState} session={session}/>
            <Dashboard session={session}/>
        </Container>
    );
}

export default Home;

