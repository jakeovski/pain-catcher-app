import React from 'react';
import {Button, Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {DateTime} from "luxon";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {LoadingButton} from "@mui/lab";


const RecordPreview = ({recordPreview,setRecordPreview,handleRecordNavigation,buttonLoading}) => {


    const getHearts = () => {
        let content=[];
        for(let i = 0; i < recordPreview.painLevel; i++) {
            content.push(<HeartBrokenIcon color="primary" key={i}/>);
        }
        return content;
    }

    const mood = {
        0:'Not Entered',
        1:'Very Bad',
        2:'Bad',
        3:'Neutral',
        4:'Good',
        5:'Great',
    };

    const activityLabels ={
        0:'Not entered',
        1:'No activity',
        2:'Very Light',
        3:'Light',
        4:'Moderate',
        5:'Heavy'
    }

    const handleGoBack = () => {
        setRecordPreview(null);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon/>
                </IconButton>
            </Grid>
            <Grid item xs={12} alignSelf="center" textAlign="center">
                <Typography fontWeight="bold">{recordPreview.title}</Typography>
            </Grid>
            <Grid item xs={12} alignSelf="center" textAlign="center" paddingBottom={1}>
                <Typography sx={{opacity:0.55}}>{`${DateTime.fromISO(recordPreview.recordStartDate).toFormat('dd/LL/yyyy HH:mm')} - ${DateTime.fromISO(recordPreview.recordEndDate).toFormat('dd/LL/yyyy HH:mm')}`}</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
                {getHearts()}
            </Grid>
                <Grid item xs={6} sm={4} md={6} lg={6}>
                    <Typography>{`Areas: ${recordPreview.areas.length > 0 ? recordPreview.areas.length : 'Not Entered'}`}</Typography>
                </Grid>
            <Grid item xs={6} sm={4} md={6} lg={6}>
                <Typography>{`Medications: ${recordPreview.medications.length > 0 ? recordPreview.medications.length : 'Not Entered'}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12} lg={6}>
                <Typography>{`Mood: ${mood[recordPreview.mood]}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={6} lg={6}>
                <Typography>{`Triggers: ${recordPreview.triggers.length > 0 ? recordPreview.triggers.length : 'Not Entered'}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={6} lg={6}>
                <Typography>{`Sleep: ${recordPreview.sleep.hours && recordPreview.sleep.hours + "h"} ${recordPreview.sleep.minutes && recordPreview.sleep.minutes + "min"}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={6} lg={6}>
                <Typography>{`Symptoms: ${recordPreview.symptoms.length > 0 ? recordPreview.symptoms.length : 'Not Entered'}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12} lg={6}>
                <Typography>{`Hormones: ${recordPreview.hormoneDetails.populated ? 'Entered' : 'Not Entered'}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12} lg={6}>
                <Typography>{`Activity: ${activityLabels[recordPreview.activityLevel]}`}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={6} lg={6}>
                <Typography>{`Diet: ${recordPreview.diet.length > 0 ? recordPreview.diet.length : 'Not Entered'}`}</Typography>
            </Grid>
            <Grid item xs={12} paddingTop={1}>
                <Typography>{`Description: ${recordPreview.description}`}</Typography>
            </Grid>
            <Grid container item xs={12} justifyContent="space-between" paddingTop={1}>
                <Grid item xs={4} md={6}>
                    <LoadingButton loading={buttonLoading} variant="contained" endIcon={<EditIcon/>} onClick={handleRecordNavigation}>
                        Edit
                    </LoadingButton>
                </Grid>
                <Grid item xs={4} md={6} textAlign="end">
                    <LoadingButton loading={buttonLoading} variant="contained" endIcon={<DeleteIcon/>}>
                        Delete
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default RecordPreview;