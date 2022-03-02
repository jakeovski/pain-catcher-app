import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {
    Box,
    Button,
    ButtonGroup, Chip,
    CircularProgress,
    Grid,
    IconButton, InputAdornment,
    Paper,
    Rating,
    Stack, TextField,
    Typography
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {DateTimePicker} from "@mui/lab";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import cookie from "cookie-cutter";
import Autocomplete,{createFilterOptions} from '@mui/material/Autocomplete';
import FrontBody,{BackBody} from '../helper/BodyMap';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import HormoneDialog from "../helper/HormoneDialog";

const filter = createFilterOptions();

const RecordView = ({recordId,pid,session}) => {

    const [pageLoading,setPageLoading] = useState(true);
    const router = useRouter();
    const [hover,setHover] = useState(-1);
    const [activityHover,setActivityHover] = useState(-1);
    const [moodHover, setMoodHover] = useState(-1);
    const [diaryId, setDiaryId] = useState(null);
    const [recordData,setRecordData] = useState(null);
    const [errorMessage,setErrorMessage] = useState({
        type:'',
        message:''
    })
    const [selectedDates,setSelectedDates] = useState(JSON.parse(cookie.get('RecordDates')));
    const [diet,setDiet] = useState(null);
    const [medication,setMedication] = useState(null);
    const [symptoms,setSymptoms] = useState(null);
    const [triggers,setTriggers] = useState(null);
    const [bodyFrontToggle,setBodyFrontToggle] = useState(true);
    const [bodyAreas,setBodyAreas] = useState([]);
    const [hormoneDialogOpen,setHormoneDialogOpen] = useState(false);
    const [hormoneDetails,setHormoneDetails] = useState(null);


    const DESCRIPTION_LIMIT = 250;

    const labels= {
        0:'No Pain',
        1:'Almost None',
        2:'Mild',
        3:'Moderate',
        4:'Severe',
        5:'Unbearable'
    }

    const activityLabels ={
        0:'Not entered',
        1:'No activity',
        2:'Very Light',
        3:'Light',
        4:'Moderate',
        5:'Heavy'
    }

    const customIcons = {
        0:{
          label:'Not Entered',
        },
        1: {
            icon: <SentimentVeryDissatisfiedIcon />,
            label: 'Very Bad',
        },
        2: {
            icon: <SentimentDissatisfiedIcon />,
            label: 'Bad',
        },
        3: {
            icon: <SentimentSatisfiedIcon />,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon />,
            label: 'Good',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon />,
            label: 'Great',
        },
    };

    useEffect(() => {
        async function getRecord() {
            const res = await fetch('/api/record/single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:session.user.id,
                    diaryId:pid,
                    recordId:recordId
                })
            });

            return await res.json();
        }

        setPageLoading(true);
        getRecord().then((res) => {
            if(!res.data) {
                router.push('/home');
            }else if (res.type) {
                //TODO:Return error message
            }else {
                setDiaryId(res.data.diaryId);
                setRecordData(res.data.record);
                setDiet(res.data.options.diet);
                setMedication(res.data.options.medication);
                setSymptoms(res.data.options.symptoms);
                setTriggers(res.data.options.triggers);
                setHormoneDetails(res.data.record.hormoneDetails);
                setPageLoading(false);
            }
        })

    },[pid, recordId, router, session.user.id]);

    const handleGoBack = async() => {
        await router.push(`/diary/${pid}`);
    }

    const IconContainer = (props) => {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    const changeBody = () => {
        setBodyFrontToggle((prev) => !prev);
    }

    const handleSelect = async(area,event) => {
        // setBodyAreas(arr => [...arr,{id:area.id,name:area.name}]);
        setBodyAreas((prevState) => {
               if (prevState.some(e => e.id === area.id)){
                   return prevState.filter(item => item.id !== area.id);
               }else {
                   return [...prevState,{id:area.id,name:area.name}];
               }
        });
    }
    // useEffect(() => {
    //     console.log(recordData);
    // },[recordData]);

    const handleHormoneDialogOpen = () => {
        setHormoneDialogOpen(true);
    }

    return(
            <Grid container spacing={2} sx={{marginTop: '2vh'}}>
            {pageLoading ? <CircularProgress sx={{marginTop: '40vh !important', marginLeft: '50vw !important'}}/>
                :
                <>
                <Grid item xs={12} lg={8}>
                    <Paper elevation={3} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: (theme) => theme.spacing(2),
                        borderRadius: '10px'
                    }}>
                        <Grid item container spacing={4}>
                            <Grid item xs={1}>
                                <IconButton onClick={handleGoBack}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={11} sx={{alignSelf: 'center', textAlign:'center'}}>
                                <Typography fontWeight="bold" variant="h5">{`New record for ${selectedDates.startStr} - ${selectedDates.endStr}`}</Typography>
                            </Grid>
                            <Grid item container xs={12} sm={12} md={6} lg={6}  columnSpacing={1}>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <Typography variant="body1">Pain Level:</Typography>
                                </Grid>
                                <Grid item container xs={9} sm={10} md={9} lg={9} columnSpacing={1}>
                                    <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                        <Rating
                                            name="pain-level"
                                            value={recordData.painLevel}
                                            defaultValue={0}
                                            onChange={(event,newValue) => {
                                                setRecordData({
                                                    ...recordData,painLevel:newValue
                                                })

                                            }}
                                            onChangeActive={(event,newHover) => {
                                                setHover(newHover);
                                            }}
                                            max={5}
                                            icon={<HeartBrokenIcon fontSize="inherit"/>}
                                            emptyIcon={<HeartBrokenIcon style={{opacity:0.55}} fontSize="inherit"/>}
                                            size="large"
                                            sx={{
                                                '& .MuiRating-iconFilled':{
                                                    color:'primary.main'
                                                },
                                                '& .MuiRating-iconHover': {
                                                    color: 'secondary.main',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={3} md={4} lg={4}>
                                        {(
                                            <Typography sx={{
                                                alignSelf: 'center'
                                            }}>{labels[hover !== -1 ? hover : recordData.painLevel]}</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container xs={12} md={6} columnSpacing={1}>
                                <Grid item xs="auto" md="auto" alignSelf="auto">
                                    <Typography>Areas:</Typography>
                                </Grid>
                                <Grid item container xs={10} md={10} spacing={1}>
                                    {bodyAreas.length !== 0 ?
                                        <>
                                            {
                                                bodyAreas.map((data,index) => {
                                                    return <Grid item key={index}><Chip label={data.name}/></Grid>
                                                })
                                            }
                                            </>
                                        :
                                        <>
                                            <Grid item>
                                                <Typography sx={{display: {xs:'none',lg:'block'}, opacity:0.55}}>Select the areas on a bodymap</Typography>
                                            </Grid>
                                            <Grid item>
                                            <Button sx={{display:{xs:'block',lg:'none'}}} size="small" variant="contained">Select</Button>
                                            </Grid>
                                        </>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={1}>
                                <Autocomplete
                                    multiple
                                    id="medicationSelect"
                                    limitTags={2}
                                    defaultValue={recordData.medications}
                                    disableCloseOnSelect
                                    options={medication.map((option) => option.medicationName)}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Medications"
                                            placeholder="To add new medication, write it and hit enter"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item container xs={12} md={6} alignSelf="center">
                                <Grid item xs="auto" md="auto">
                                    Mood:
                                </Grid>
                                <Grid item container xs={10} md={10} sx={{paddingLeft:'1vw !important'}}>
                                    <Rating name="highlight-selected-only"
                                            defaultValue={0}
                                            IconContainerComponent={IconContainer}
                                            highlightSelectedOnly
                                            onChange={(event,newValue) => {
                                                setRecordData({
                                                    ...recordData,mood:newValue
                                                });
                                            }}
                                            onChangeActive={(event,newHover) => {
                                                setMoodHover(newHover);
                                            }}
                                            sx={{
                                                '& .MuiRating-iconFilled':{
                                                    color:'primary.main'
                                                },
                                            }}
                                            />
                                    {(
                                        <Typography sx={{
                                            ml: 2,
                                            alignSelf: 'center'
                                        }}>{customIcons[moodHover !== -1 ? moodHover : recordData.mood].label}</Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={1}>
                                <Autocomplete
                                    multiple
                                    id="triggersSelect"
                                    limitTags={2}
                                    defaultValue={recordData.triggers}
                                    disableCloseOnSelect
                                    options={triggers.map((option) => option.triggerName)}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Triggers"
                                            placeholder="To add new trigger, write it and hit enter"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item container xs={12} sm={10} md={6} columnSpacing={1} alignItems="center">
                                <Grid item xs="auto" sm="auto" md="auto">
                                    <Typography>Sleep:</Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={recordData.sleep.hours}
                                        onChange={(event) => {
                                            let value = event.target.value;
                                            if (parseInt(event.target.value) > 24) {
                                                value = '24';
                                            }else if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                value = '0';
                                            }
                                            setRecordData({
                                                ...recordData,sleep:{
                                                    hours: value,
                                                    minutes: recordData.sleep.minutes
                                                }
                                            })
                                        }}
                                        InputProps={{
                                            inputProps:{min:0,max:24},
                                            endAdornment:<InputAdornment position="end">hrs</InputAdornment>
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3} sm={3} md={3}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={recordData.sleep.minutes}
                                        onChange={(event) => {
                                            let value = event.target.value;
                                            if (parseInt(event.target.value) > 59) {
                                                value = '59';
                                            }else if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                value = '0';
                                            }
                                            setRecordData({
                                                ...recordData,sleep:{
                                                    hours: recordData.sleep.hours,
                                                    minutes: value
                                                }
                                            })
                                        }}
                                        InputProps={{
                                            inputProps:{min:0,max:59},
                                            endAdornment:<InputAdornment position="end">min</InputAdornment>
                                        }}
                                        />
                                </Grid>

                            </Grid>
                            <Grid item xs={12} sm={6} md={6} columnSpacing={1} alignSelf="center">
                                <Autocomplete
                                    multiple
                                    id="symptomSelect"
                                    limitTags={2}
                                    defaultValue={recordData.symptoms}
                                    disableCloseOnSelect
                                    options={symptoms.map((option) => option.symptomName)}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Symptoms"
                                            placeholder="To add new symptom, write it and hit enter"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item container xs={12} md={6} lg={12} xl={6} columnSpacing={1} alignSelf="center">
                                <Grid item xs="auto" sm="auto" md="auto" alignSelf="center">
                                    <Typography variant="body1">Activity Level:</Typography>
                                </Grid>
                                <Grid item container xs={9} md={8} lg={8} columnSpacing={1}>
                                    <Grid item xs="auto" md="auto">
                                        <Rating
                                            name="pain-level"
                                            value={recordData.activityLevel}
                                            defaultValue={0}
                                            onChange={(event,newValue) => {
                                                setRecordData({
                                                    ...recordData,activityLevel:newValue
                                                })
                                            }}
                                            onChangeActive={(event,newHover) => {
                                                setActivityHover(newHover);
                                            }}
                                            max={5}
                                            icon={<FitnessCenterIcon fontSize="inherit"/>}
                                            emptyIcon={<FitnessCenterIcon style={{opacity:0.55}} fontSize="inherit"/>}
                                            size="large"
                                            sx={{
                                                '& .MuiRating-iconFilled':{
                                                    color:'primary.main'
                                                },
                                                '& .MuiRating-iconHover': {
                                                    color: 'primary.dark',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5} md="auto" alignSelf="center">
                                        {(
                                            <Typography>{activityLabels[activityHover !== -1 ? activityHover : recordData.activityLevel]}</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={5} md={6} columnSpacing={1} alignSelf="center">
                                <Autocomplete
                                    multiple
                                    id="dietSelect"
                                    limitTags={2}
                                    defaultValue={recordData.diet}
                                    disableCloseOnSelect
                                    options={diet.map((option) => option.productName)}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Diet"
                                            placeholder="To add new product, write it and hit enter"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item container xs={12} lg={6} alignSelf="center">
                                <Grid item xs="auto" alignSelf="center">
                                    <Typography>Hormone Level:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Button sx={{ml:1}} onClick={handleHormoneDialogOpen} size="small" variant="contained">Input Hormone Records</Button>
                                </Grid>
                            </Grid>
                            <Grid item container xs={12} xl={6}>
                                <TextField
                                    inputProps={{
                                        maxLength: DESCRIPTION_LIMIT
                                    }}
                                    value={recordData.description}
                                    onChange={(e) => {
                                        setRecordData({
                                            ...recordData,description:e.target.value
                                        })
                                    }}
                                    multiline
                                    helperText={`${recordData.description.length}/${DESCRIPTION_LIMIT}`}
                                    fullWidth variant="outlined" label="Description"/>
                            </Grid>
                            <Grid item container justifyContent="space-between" xs={12}>
                                <Grid item xs={4} md={3}>
                                    <Button fullWidth variant="contained">Add Record</Button>
                                </Grid>
                                <Grid item xs={3} md={2} textAlign="end" alignSelf="center">
                                    <Button fullWidth variant="contained">Clear</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item lg={4}>
                    <Paper elevation={3} sx={{
                        display: {xs:'none',lg:'flex'},
                        flexDirection: 'column',
                        padding: (theme) => theme.spacing(2),
                        borderRadius: '10px'
                    }}>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} textAlign="center">
                                <Typography fontWeight="bold" variant="h6">Bodymap</Typography>
                            </Grid>
                            <Grid item container xs={12} display="flex" justifyContent="center" height={622}>
                                        <Box sx={{display:bodyFrontToggle ? 'block' : 'none'}}>
                                            <FrontBody handleSelect={handleSelect} toggleFront={bodyFrontToggle}/>
                                        </Box>
                                        <Box sx={{visibility:bodyFrontToggle ? 'hidden' : 'visible'}}>
                                            <BackBody handleSelect={handleSelect} toggleFront={bodyFrontToggle}/>
                                        </Box>
                            </Grid>
                            <Grid item container xs={12} justifyContent="space-around">
                                <Grid item xs={1}>
                                    <IconButton onClick={changeBody} size="large" color="primary" sx={{
                                        ':hover':{
                                            color:'primary.dark'
                                        }
                                    }}>
                                        <ArrowCircleLeftIcon fontSize="inherit"/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={1} display="flex" justifyContent="flex-end">
                                    <IconButton onClick={changeBody} size="large" color="primary" sx={{
                                        ':hover':{
                                            color:'primary.dark'
                                        }
                                    }}>
                                        <ArrowCircleRightIcon fontSize="inherit"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <HormoneDialog hormoneDetails={hormoneDetails}
                                   setHormoneDetails={setHormoneDetails}
                                   recordData={recordData}
                                   setRecordData={setRecordData}
                                   hormoneDialogOpen={hormoneDialogOpen}
                                   setHormoneDialogOpen={setHormoneDialogOpen}/>
                </Grid>
                </>
            }
            </Grid>
    )
}

export default RecordView;