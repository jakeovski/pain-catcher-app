import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button, Chip,
    CircularProgress,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography, useTheme
} from "@mui/material";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import luxon2Plugin from '@fullcalendar/luxon2';
import {DateTime} from "luxon";
import cookie from 'cookie-cutter';

//TODO:Change date format in calendar for months view to be 25/1 instead of 1/25
const DiaryView = ({pid, session}) => {

    const router = useRouter();
    const theme = useTheme();
    const [loadingPage, setLoadingPage] = useState(true);
    const [diaryData, setDiaryData] = useState(null);
    const [recordsData, setRecordsData] = useState(null);
    const [selectedDates,setSelectedDates] = useState({
        startDate:null,
        endDate:null,
        startStr:null,
        endStr:null,
        allDay:null
    });
    const [events, setEvents] = useState([]);

    const calendarRef = React.createRef();
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
                console.log(res.data.records);
                let tempEvents = [];
                for(const record of res.data.records) {
                    tempEvents.push({
                        id:record._id,
                        allDay:record.allDay,
                        title:record.title,
                        start:record.recordStartDate,
                        end:record.recordEndDate
                    })
                }
                setEvents(tempEvents);
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
                endStr: endDate.toFormat('dd/LL/yyyy'),
                allDay: true
            })
        }else{
            setSelectedDates({
                startDate: startDate,
                endDate: endDate,
                startStr: startDate.toFormat('dd/LL/yyyy HH:mm'),
                endStr: endDate.toFormat('dd/LL/yyyy HH:mm'),
                allDay: false
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
        calendarRef.current.getApi().unselect();
    }

    const handleRecordNavigation = async () => {
        cookie.set('RecordDates',JSON.stringify(selectedDates));
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
                                        plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin, luxon2Plugin]}
                                        initialView="dayGridMonth"
                                        height={600}
                                        ref={calendarRef}
                                        firstDay={1}
                                        views={{
                                            timeGridWeek:{
                                                dayHeaderFormat:'ccc dd/LL',
                                                titleFormat:'{{d} LLL}, yyyy'
                                            },
                                            timeGridDay:{
                                                titleFormat:'d LLLL yyyy'
                                            }
                                        }}
                                        events={events}
                                        eventColor={theme.palette.primary.dark}
                                        headerToolbar={{
                                            left:'prev,next today',
                                            center:'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                        }}
                                        selectable={true}
                                        unselectAuto={false}
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
                                        <>
                                            <List>
                                                {recordsData.map((data) => {
                                                    return <Chip variant="outlined" key={data._id} label={`${data.title} on ${DateTime.fromISO(data.recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(data.recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}
                                                    />
                                                })}
                                            </List>
                                        </>
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