import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    List,
    Pagination,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import luxon2Plugin from '@fullcalendar/luxon2';
import {DateTime, Interval} from "luxon";
import RecordPreview from "../helper/RecordPreview";
import CustomDialog from "../helper/CustomDialog";
import {LoadingButton} from "@mui/lab";

const DiaryView = ({pid, session}) => {

    //Hooks
    const router = useRouter();
    const theme = useTheme();

    //States
    const [loadingPage, setLoadingPage] = useState(true);
    const [diaryData, setDiaryData] = useState(null);
    const [recordsData, setRecordsData] = useState(null);
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
        startStr: null,
        endStr: null,
        allDay: null
    });
    const [events, setEvents] = useState([]);
    const [recordPreview, setRecordPreview] = useState(null);
    const [recordsWithinDateRange, setRecordsWithinDateRange] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [calendarEditable, setCalendarEditable] = useState(true);
    const [errorMessage, setErrorMessage] = useState({
        type: '',
        message: ''
    })
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dialogTitleText, setDialogTitleText] = useState(null);
    const [dialogContentText, setDialogContentText] = useState(null);
    const calendarRef = React.useRef(null);
    const [page,setPage] = useState(1);
    const [pageWithinDateRange,setPageWithinDateRange] = useState(1);

    //Actions
    const handleGoBack = async () => {
        setLoadingPage(true);
        await router.push('/home');
    }

    const handleRecordPreview = (data) => () => {
        setRecordPreview(data);
    }

    const handleDateSelected = (info) => {
        const startDate = DateTime.fromISO(info.startStr);
        const endDate = DateTime.fromISO(info.endStr);
        if (info.allDay) {
            setSelectedDates({
                startDate: startDate,
                endDate: endDate,
                startStr: startDate.toFormat('dd/LL/yyyy'),
                endStr: endDate.toFormat('dd/LL/yyyy'),
                allDay: true
            })
        } else {
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
            for (const record of recordsData) {
                if (DateTime.fromISO(record.recordStartDate) >= startDate) {
                    if (DateTime.fromISO(record.recordEndDate) <= endDate) {
                        recordDateRange.push(record);
                    }
                }
            }
            setRecordsWithinDateRange(recordDateRange);
        }
        setErrorMessage({type:'',message: ''});
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
        setErrorMessage({type:'',message: ''});
        setRecordsWithinDateRange([]);
        calendarRef.current.getApi().unselect();
    }

    const handleRecordNavigation = async () => {
        setButtonLoading(true);
        if (recordPreview) {
            await router.push(`/diary/${pid}/${recordPreview._id}`);
        } else {
            if (recordsData.length > 0) {
                const alreadyExists = recordsData.find((element) => {
                    return checkDatesOverlap(element._id,null,element.recordStartDate,
                        element.recordEndDate,selectedDates.startDate,selectedDates.endDate);
                });
                if (alreadyExists) {
                    setErrorMessage({
                        type: 'warning',
                        message: 'There is already a record for that time'
                    })
                    setButtonLoading(false);
                } else {
                    localStorage.setItem("RecordDates", JSON.stringify(selectedDates))
                    await router.push(`/diary/${pid}/new`);
                }
            } else {
                localStorage.setItem("RecordDates", JSON.stringify(selectedDates))
                await router.push(`/diary/${pid}/new`);
            }
        }
    }

    const showRecords = (recordsToShow,number) => {
        const records = []
        let count = 0;

        for (let i = (number * 10) - 10; i < recordsToShow.length; i++){
            records.push(
                <Button size="small" onClick={handleRecordPreview(recordsToShow[i])}
                        fullWidth
                        sx={{marginBottom: 1}}
                        variant="outlined" key={recordsToShow[i]._id}>
                    {`${recordsToShow[i].title} on ${DateTime.fromISO(recordsToShow[i].recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(recordsToShow[i].recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}
                </Button>
            )
            count++;
            if (count === 9) break;
        }
        return records;
    }

    const handlePagination = (e,value) => {
        setPage(value);
    }

    const handlePaginationWithinDateRange = (e,value) => {
        setPageWithinDateRange(value);
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const handleDeleteDialogOpen = (name) => {
        setDialogTitleText(`Delete ${name}?`);
        setDialogContentText(`${name} will be permanently deleted.`);
        setDeleteDialogOpen(true);
    }

    const handleEventClick = (info) => {
        clearDateSelection();
        for (const record of recordsData) {
            if (record._id === info.event.id) {
                setRecordPreview(record);
                break;
            }
        }
    }

    //Requests
    /**
     * Request to the backend to delete the record
     * @param recordId
     * @returns {Promise<void>}
     */
    const handleRecordDelete = async (recordId) => {
        setButtonLoading(true);
        setDeleteDialogOpen(false);

        const res = await fetch('/api/record/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: session.user.id,
                diaryId: pid,
                recordId: recordId
            })
        });

        const data = await res.json();
        if (data.type) {
            setErrorMessage({
                type: data.type,
                message: data.message
            })
        } else {
            let tempEvents = [];
            console.log(data);
            for (const record of data.data.records) {
                tempEvents.push({
                    id: record._id,
                    allDay: record.allDay,
                    title: record.title,
                    start: record.recordStartDate,
                    end: record.recordEndDate
                })
            }
            setEvents(tempEvents);
            setRecordsData(data.data.records);
            setRecordPreview(null);
            setButtonLoading(false);
        }
    }

    /**
     * Event Change handler, also makes a call to the backend for any date changes
     * @param info
     * @returns {Promise<void>}
     */
    const handleEventChange = async (info) => {
        setButtonLoading(true);
        setCalendarEditable(false);
        let endDate;
        if (!info.event.end) {
            if (info.event.allDay) {
                endDate = DateTime.fromISO(info.event.startStr).plus({days: 1});
            } else {
                endDate = DateTime.fromISO(info.event.startStr).plus({hours: 1});
            }
        }
        if (recordsData.length > 0) {
            const alreadyExists = recordsData.find((element) => {
                return checkDatesOverlap(element._id,
                    info.event.id,element.recordStartDate,
                    element.recordEndDate,info.event.start,
                    endDate ? endDate : DateTime.fromISO(info.event.endStr));
            });
            if (alreadyExists) {
                setErrorMessage({
                    type: 'warning',
                    message: 'There is already a record for that time'
                })
                info.revert();
                setButtonLoading(false);
                setCalendarEditable(true);
                return;
            }
        }
        const res = await fetch('/api/record/editTime', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: session.user.id,
                diaryId: pid,
                recordId: info.event.id,
                newStartDate: info.event.start,
                newEndDate: info.event.end ? info.event.end : endDate,
                newAllDay: info.event.allDay
            })
        });

        const data = await res.json();
        if (data.type) {
            setErrorMessage({
                type: data.type,
                message: data.message
            })
        } else {
            let tempEvents = [];
            let recordDateRange = [];
            let newPreview =null;
            for (const record of data.data.records) {
                tempEvents.push({
                    id: record._id,
                    allDay: record.allDay,
                    title: record.title,
                    start: record.recordStartDate,
                    end: record.recordEndDate
                })
                if (selectedDates.startDate && selectedDates.endDate && recordsWithinDateRange.length > 0) {
                    if (DateTime.fromISO(record.recordStartDate) >= selectedDates.startDate) {
                        if (DateTime.fromISO(record.recordEndDate) <= selectedDates.endDate) {
                            recordDateRange.push(record);
                        }
                    }
                }
                if(recordPreview){
                    if (record._id === recordPreview._id){
                        newPreview = record;
                    }
                }
            }
            setRecordsWithinDateRange(recordDateRange);
            setEvents(tempEvents);
            setRecordsData(data.data.records);
            setRecordPreview(newPreview);
            setButtonLoading(false);
            setCalendarEditable(true);
        }
    }

    /*
    Checks whether a moved event is allowed to be moved
     */
    const checkDatesOverlap = (existingId, currentId,existingStart,existingEnd, newStartDate, newEndDate) => {
        //If we are looking at the same event we are moving we should allow the move
        if (existingId !== currentId) {
            /*
            Assume the event we are moving is a bigger event, create an interval from the event we are moving and check whether any events fall under our interval
            If yes, then the event cannot be moved as overlaps
            If no, go to next check
             */
            const bigInterval = Interval.fromDateTimes(newStartDate,newEndDate);
            const notAllowed = bigInterval.contains(DateTime.fromISO(existingStart)) || bigInterval.contains(DateTime.fromISO(existingEnd).minus({seconds:1}));

            /**
             * Next check. Now we assume the event we are moving is a smaller event. Create an interval from other events and check whether the event
             * we are moving is in any of the other event intervals
             * If yes, the move is not allowed as overlaps other events
             * If no, the event we are moving does not overlap any other events
             */
            if(!notAllowed) {
                const smallInterval = Interval.fromDateTimes(DateTime.fromISO(existingStart),DateTime.fromISO(existingEnd));
                return smallInterval.contains(newStartDate) || smallInterval.contains(newEndDate.minus({seconds:1}));
            }else {
                return notAllowed;
            }
        }else {
            return false;
        }
    }

    /**
     * useEffect that makes a call to the backend and gets the record info
     */
    useEffect(() => {
        setLoadingPage(true);
        fetch('/api/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: session.user.id,
                diaryId: pid
            })
        }).then((res) => res.json())
            .then((data) => {
                if (!data.data) {
                    router.push('/home');
                } else {
                    let tempEvents = [];
                    for (const record of data.data.records) {
                        tempEvents.push({
                            id: record._id,
                            allDay: record.allDay,
                            title: record.title,
                            start: record.recordStartDate,
                            end: record.recordEndDate
                        })
                    }
                    setEvents(tempEvents);
                    setDiaryData(data.data.diary[0]);
                    setRecordsData(data.data.records);
                    setLoadingPage(false);
                }
            });
    }, []);

    if (loadingPage) return <Grid container spacing={2} sx={{marginTop: '2vh'}}>
        <CircularProgress sx={{marginTop: '40vh !important', marginLeft: '50vw !important'}}/>
    </Grid>

    if (!diaryData) return <Grid container spacing={2} sx={{marginTop: '2vh'}}>
        <Grid item xs={12}>
            <Alert severity="error">Diary does not exist!</Alert>
        </Grid>
    </Grid>

    return (
        <Grid container spacing={2} sx={{marginTop: '2vh'}}>
            <Grid item xs={12} md={8} order={{xs: 2, md: 1}}>
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
                        <Grid item xs={11} sx={{alignSelf: 'center', textAlign: 'center'}}>
                            <Typography fontWeight="bold" variant="h5">{diaryData.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{
                            '& .fc .fc-button-primary': {
                                backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                                border: 'none',
                                '&:hover': {
                                    '&:enabled': {
                                        backgroundColor: (theme) => `${theme.palette.primary.dark} !important`
                                    }
                                },
                                '&:focus': {
                                    boxShadow: 'none !important'
                                },
                                '&:disabled': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.12) !important'
                                }
                            }
                        }}>
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, luxon2Plugin]}
                                initialView="dayGridMonth"
                                height={600}
                                ref={calendarRef}
                                firstDay={1}
                                editable={calendarEditable}
                                eventChange={handleEventChange}
                                views={{
                                    timeGridWeek: {
                                        dayHeaderFormat: 'ccc dd/LL',
                                        titleFormat: '{{d} LLL}, yyyy'
                                    },
                                    timeGridDay: {
                                        titleFormat: 'd LLLL yyyy'
                                    }
                                }}
                                events={events}
                                eventClick={handleEventClick}
                                eventColor={theme.palette.primary.dark}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
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
            <Grid item xs={12} md={4} order={{xs: 1, md: 2}}>
                <Paper elevation={3} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: (theme) => theme.spacing(2),
                    borderRadius: '10px'
                }}>
                    <form>
                        <Grid container item xs={12} spacing={1}>
                            <Grid item xs={12} sx={{alignSelf: 'center'}}>
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
                                            handleDeleteDialogOpen={handleDeleteDialogOpen}
                                        />
                                        :
                                        selectedDates.startDate ?
                                            recordsWithinDateRange.length !== 0 ?
                                                <>
                                                <List>
                                                    {/*{recordsWithinDateRange.map((data) => {*/}
                                                    {/*    return <Button onClick={handleRecordPreview(data)}*/}
                                                    {/*                   size="small"*/}
                                                    {/*                   fullWidth*/}
                                                    {/*                   sx={{marginBottom: 1}}*/}
                                                    {/*                   variant="outlined" key={data._id}*/}
                                                    {/*    >{`${data.title} on ${DateTime.fromISO(data.recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(data.recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}*/}
                                                    {/*    </Button>*/}
                                                    {/*})}*/}
                                                    {
                                                        showRecords(recordsWithinDateRange,pageWithinDateRange)
                                                    }
                                                </List>
                                                <Pagination sx={{display:'flex',justifyContent:'center'}} color="primary"
                                                            count={Math.ceil(recordsWithinDateRange.length / 10)}
                                                            page={pageWithinDateRange}
                                                            onChange={handlePaginationWithinDateRange}/>
                                                </>
                                                :
                                                <Alert severity="info">No Records exist for the date range</Alert>
                                            :
                                            <>
                                            <List>
                                                {
                                                    showRecords(recordsData,page)
                                                }
                                            </List>
                                                <Pagination sx={{display:'flex',justifyContent:'center'}} color="primary"
                                                            count={Math.ceil(recordsData.length / 10)}
                                                            page={page}
                                                            onChange={handlePagination}/>
                                            </>

                                    :
                                    <Alert severity="info">No Records exist yet</Alert>
                                }
                            </Grid>
                            <Grid item xs={12} sx={{paddingTop: '1vh'}}>
                                {!recordPreview &&
                                    <LoadingButton loading={buttonLoading} fullWidth variant="contained"
                                                   onClick={handleRecordNavigation}
                                                   disabled={selectedDates.startDate === null}>
                                        Add new pain record
                                    </LoadingButton>
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
            <CustomDialog
                open={deleteDialogOpen}
                handleDialogClose={handleDeleteDialogClose}
                diaryId={recordPreview && recordPreview._id}
                titleText={dialogTitleText}
                contentText={dialogContentText}
                actionName="Delete"
                confirmAction={handleRecordDelete}
            />
        </Grid>
    )
}

export default DiaryView;