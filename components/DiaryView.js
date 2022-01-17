import React, {useEffect, useState} from 'react';
import {Alert, Button, CircularProgress, Grid, IconButton, Paper, Typography} from "@mui/material";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {DateTime} from "luxon";


const DiaryView = ({pid, session}) => {

    const router = useRouter();
    const [loadingPage, setLoadingPage] = useState(true);
    const [diaryData, setDiaryData] = useState(null);
    const [recordsData, setRecordsData] = useState(null);
    const [selectedDates,setSelectedDates] = useState({
        startDate:null,
        endDate:null,
        startStr:null,
        endStr:null
    });

    const handleGoBack = async() => {
        await router.push('/home');
    }

    useEffect(() => {
        async function getRecords() {
            const res = await fetch('/api/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:session.user.id,
                    diaryId:pid
                })
            });

            return await res.json();
        }

        setLoadingPage(true);
        getRecords().then((res) => {
            if(!res.data) {
                router.push('/home');
            }else {
                setDiaryData(res.data.diary[0]);
                setRecordsData(res.data.records);
                setLoadingPage(false);
            }
        })

    },[pid, router, session.user.id]);

    const handleDateSelected = (info) => {
        const startDate = DateTime.fromISO(info.startStr);
        const endDate = DateTime.fromISO(info.endStr);
        if(info.allDay){
            setSelectedDates({
                startDate: startDate,
                endDate: endDate,
                startStr: startDate.toFormat('dd/LL/yyyy'),
                endStr: endDate.toFormat('dd/LL/yyyy')
            })
        }else{
            setSelectedDates({
                startDate: startDate,
                endDate: endDate,
                startStr: startDate.toFormat('dd/LL/yyyy HH:mm'),
                endStr: endDate.toFormat('dd/LL/yyyy HH:mm')
            })
        }
    }

    const clearDateSelection = () => {
        setSelectedDates({
            startDate: null,
            endDate: null,
            startStr: null,
            endStr: null
        })
    }

    const handleRecordNavigation = async () => {
        await router.push(`/diary/${pid}/new`);
    }

    return (
        <Grid container spacing={2} sx={{marginTop: '2vh'}}>
            {loadingPage ? <CircularProgress sx={{marginTop: '40vh !important', marginLeft: '50vw !important'}}/>
                :
                <>
                    <Grid item xs={12} md={8} order={{xs:2,md:1}}>
                        <Paper elevation={3} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: (theme) => theme.spacing(2),
                            borderRadius: '10px'
                        }}>
                            <Grid item container xs={12} spacing={2}>
                                <Grid item xs={1}>
                                    <IconButton onClick={handleGoBack}>
                                        <ArrowBackIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={11} sx={{alignSelf: 'center', textAlign:'center'}}>
                                    <Typography fontWeight="bold" variant="h5">{diaryData.name}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{
                                    '& .fc .fc-button-primary':{
                                        backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                                        border:'none',
                                        '&:hover':{
                                            '&:enabled':{
                                                    backgroundColor: (theme) => `${theme.palette.primary.dark} !important`
                                            }
                                        },
                                        '&:focus':{
                                            boxShadow:'none !important'
                                        },
                                        '&:disabled':{
                                            backgroundColor:'rgba(0, 0, 0, 0.12) !important'
                                        }
                                    }
                                }}>
                                    <FullCalendar
                                        plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                                        initialView="dayGridMonth"
                                        height={600}
                                        firstDay={1}
                                        headerToolbar={{
                                            left:'prev,next today',
                                            center:'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                        }}
                                        selectable={true}
                                        select={(info) => {
                                            handleDateSelected(info);
                                        }}
                                    />
                                </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h7">
                                    {diaryData.description}
                                </Typography>
                            </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} order={{xs:1,md:2}}>
                        <Paper elevation={3} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: (theme) => theme.spacing(2),
                            borderRadius: '10px'
                        }}>
                            <form>
                                <Grid container item xs={12} spacing={1}>
                                <Grid item xs={12} sx={{alignSelf:'center'}}>
                                    <Typography fontWeight="bold" variant="h5">
                                        Record Details
                                    </Typography>
                                </Grid>
                                {selectedDates.startStr &&
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            {`${selectedDates.startStr} - ${selectedDates.endStr}`}
                                        </Typography>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    {recordsData.length > 0 ?
                                        <h1>Hi</h1>
                                        :
                                        <Alert severity="info">No Records exist yet</Alert>
                                    }
                                </Grid>
                                <Grid item xs={12} sx={{paddingTop:'1vh'}}>
                                    <Button fullWidth variant="contained" onClick={handleRecordNavigation} disabled={selectedDates.startDate === null}>
                                        Add new pain record
                                    </Button>
                                </Grid>
                                    {selectedDates.startDate &&
                                    <Grid item xs={12}>
                                        <Button fullWidth variant="contained" onClick={clearDateSelection}>
                                            Clear Selection
                                        </Button>
                                    </Grid>
                                    }
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </>
            }
        </Grid>
    )
}

export default DiaryView;