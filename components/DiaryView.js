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
import RecordPreview from "../helper/RecordPreview";

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
    const [recordPreview, setRecordPreview] = useState(null);
    const [recordsWithinDateRange,setRecordsWithinDateRange] = useState([]);
    const [buttonLoading,setButtonLoading] = useState(false);
    const [calendarEditable,setCalendarEditable] = useState(true);
    const [errorMessage,setErrorMessage] = useState({
        type:'',
        message:''
    })

    const calendarRef = React.useRef(null);
    const handleGoBack = async() => {
        setLoadingPage(true);
        await router.push('/home');
    }

    const handleRecordPreview = (data) => () => {
        setRecordPreview(data);
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
        if (recordsData) {
            let recordDateRange = [];
            for(const record of recordsData) {
                if(DateTime.fromISO(record.recordStartDate) >= startDate) {
                    if (DateTime.fromISO(record.recordEndDate) <= endDate){
                        console.log('true');
                        recordDateRange.push(record);
                    }
                }
            }
            setRecordsWithinDateRange(recordDateRange);
        }
        setRecordPreview(null);
    }

    const clearDateSelection = () => {
        setSelectedDates({
            startDate: null,
            endDate: null,
            startStr: null,
            endStr: null,
            allDay: null
        });
        setRecordsWithinDateRange([]);
        calendarRef.current.getApi().unselect();
    }

    const handleRecordNavigation = async () => {
        setButtonLoading(true);
        if (recordPreview) {
            await router.push(`/diary/${pid}/${recordPreview._id}`);
        }else {
            console.log(selectedDates);
            cookie.set('RecordDates',JSON.stringify(selectedDates));
            await router.push(`/diary/${pid}/new`);
        }
        setButtonLoading(false);
    }

    const handleEventClick = (info) => {
        clearDateSelection();
        for(const record of recordsData) {
            if (record._id === info.event.id) {
                setRecordPreview(record);
                break;
            }
        }
    }

    const handleEventChange = async(info) => {
        console.log(info.event);
        setButtonLoading(true);
        setCalendarEditable(false);
        let endDate;
        if (!info.event.end) {
            if(info.event.allDay) {
                endDate = DateTime.fromISO(info.event.startStr).plus({days:1});
            }else {
                endDate = DateTime.fromISO(info.event.startStr).plus({hours:1});
            }
        }
        const res = await fetch('/api/record/editTime',{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userId:session.user.id,
                diaryId:pid,
                recordId:info.event.id,
                newStartDate:info.event.start,
                newEndDate:info.event.end ? info.event.end : endDate,
                newAllDay:info.event.allDay
            })
        });

        const data = await res.json();
        if(data.type) {
            setErrorMessage({
                type: data.type,
                message: data.message
            })
        }
        let tempEvents = [];
        for(const record of data.data.records) {
            tempEvents.push({
                id:record._id,
                allDay:record.allDay,
                title:record.title,
                start:record.recordStartDate,
                end:record.recordEndDate
            })
        }
        setEvents(tempEvents);
        setRecordsData(data.data.records);
        setButtonLoading(false);
        setCalendarEditable(true);
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
                                        editable={calendarEditable}
                                        eventChange={handleEventChange}
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
                                        eventClick={handleEventClick}
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
                                        recordPreview ?
                                            <RecordPreview
                                                recordPreview={recordPreview}
                                                setRecordPreview={setRecordPreview}
                                                handleRecordNavigation={handleRecordNavigation}
                                                buttonLoading={buttonLoading}
                                            />
                                            :
                                            selectedDates.startDate ?
                                                recordsWithinDateRange.length !== 0 ?
                                                    <List>
                                                        {recordsWithinDateRange.map((data) => {
                                                            return <Button onClick={handleRecordPreview(data)}
                                                                           size="small"
                                                                         variant="outlined" key={data._id}
                                                            >{`${data.title} on ${DateTime.fromISO(data.recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(data.recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}
                                                            </Button>
                                                        })}
                                                    </List>
                                                    :
                                                    <Alert severity="info">No Records exist for the date range</Alert>
                                                :
                                            <List>
                                                {recordsData.map((data) => {
                                                    return <Button size="small" onClick={handleRecordPreview(data)}
                                                                   fullWidth
                                                                 variant="outlined" key={data._id}>
                                                                 {`${data.title} on ${DateTime.fromISO(data.recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(data.recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}
                                                    </Button>
                                                })}
                                            </List>
                                        :
                                        <Alert severity="info">No Records exist yet</Alert>
                                    }
                                </Grid>
                                <Grid item xs={12} sx={{paddingTop:'1vh'}}>
                                    {!recordPreview &&
                                        <Button fullWidth variant="contained" onClick={handleRecordNavigation} disabled={selectedDates.startDate === null}>
                                            Add new pain record
                                        </Button>
                                    }
                                </Grid>
                                    {selectedDates.startDate &&
                                    <Grid item xs={12}>
                                        <Button fullWidth variant="contained" onClick={clearDateSelection}>
                                            Clear Selection
                                        </Button>
                                    </Grid>
                                    }
                                    <Grid item xs={12}>
                                        {errorMessage.type &&
                                            <Alert severity={errorMessage.type}>{errorMessage.message}</Alert>
                                        }
                                    </Grid>
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