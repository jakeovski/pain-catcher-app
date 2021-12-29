import React, {useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "./Header";
import {Container} from "@mui/material";

const Home = ({darkState}) => {
    const {data:session} = useSession();
    const router = useRouter();
    useEffect(() => {
        if (!session){
            router.push('/');
        }
    },[router, session]);

    return(
        <Container maxWidth="xl">
            <Header darkState={darkState} session={session}/>
        </Container>
    );
}

export default Home;