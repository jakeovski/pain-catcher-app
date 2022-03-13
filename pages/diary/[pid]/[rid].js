import React from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {CircularProgress, Container} from "@mui/material";
import Header from "../../../components/Header";
import RecordView from "../../../components/RecordView";


const RecordPage = ({darkState, selectedDates, setSelectedDates}) => {
    const router = useRouter();
    const {data: session, status} = useSession();
    const {pid, rid} = router.query;

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
            <RecordView session={session} pid={pid} recordId={rid} selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}/>
        </Container>
    )
}

export default RecordPage;