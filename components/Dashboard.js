import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress, FormControl, FormControlLabel,
    Grid, IconButton, InputLabel,
    LinearProgress, MenuItem,
    Paper, Select, Skeleton, Switch,
    TextField, Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import ColorPicker from "../helper/ColorPicker";
import {DateTime} from "luxon";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CustomDialog from "../helper/CustomDialog";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import randomColor from 'randomcolor';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import {
    CartesianGrid,
    ComposedChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
    Legend, Line, Bar
} from "recharts";

const Dashboard = ({session}) => {
    const theme = useTheme();
    const router = useRouter();
    const CHARACTER_LIMIT = 200;
    const NAME_LIMIT = 20;
    const [anchorEl, setAnchorEl] = useState(null);
    const openColorPicker = Boolean(anchorEl);
    const id = openColorPicker ? 'simple-popover' : undefined;

    const [newDiaryLoading, setNewDiaryLoading] = useState(false);
    const [diaryData, setDiaryData] = useState({
        data: undefined,
        type: '',
        message: ''
    });

    const [modifyDiary,setModifyDiary] = useState(null);

    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const [dialogDiaryId,setDialogDiaryId] = useState(null);
    const [dialogTitleText,setDialogTitleText] = useState(null);
    const [dialogContentText,setDialogContentText] = useState(null);
    const [selectedDiaryToAnalyze,setSelectedDiaryToAnalyze] = useState('');
    const [toggleAnalysis,setToggleAnalysis] = useState(false);
    const [analysisLoading,setAnalysisLoading] = useState(false);
    //TODO:Remove if not needed
    const [recordsForAnalysis,setRecordsForAnalysis] = useState([]);
    const [chartData,setChartData] = useState([]);
    const [showPainLevel,setShowPainLevel] = useState(true);
    const [showActivity,setShowActivity] = useState(false);
    const [showMood,setShowMood] = useState(false);
    const [showMedication,setShowMedication] = useState(false);
    const [showDiet,setShowDiet] = useState(false);
    const [showSymptoms,setShowSymptoms] = useState(false);
    const [showTriggers,setShowTriggers] = useState(false);
    const [uniqueMedications,setUniqueMedications] = useState([]);
    const [uniqueDiet,setUniqueDiet] = useState([]);
    const [uniqueSymptoms,setUniqueSymptoms] = useState([]);
    const [uniqueTriggers,setUniqueTriggers] = useState([]);
    const [analysisData,setAnalysisData] = useState({});


    const [newDiary, setNewDiary] = useState({
        name: '',
        description: '',
        color: theme.palette.primary.main
    });

    const handleDialogOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleDialogClose = () => {
        setAnchorEl(null);
    }

    const handleColorChange = (value) => {
        setNewDiary({
            ...newDiary, color: value
        })
    }

    const handleChange = (e) => {
        setNewDiary({
            ...newDiary, [e.target.name]: e.target.value
        });
    }

    const handleNewDiary = async (e) => {
        e.preventDefault();
        setNewDiaryLoading(true);
        if (modifyDiary) {
            const res = await fetch('/api/diary/modify', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    diaryId: modifyDiary,
                    diary: newDiary
                })
            });
            const data = await res.json();
            setDiaryData(data);
            setModifyDiary(null);
        }else {
            const res = await fetch('/api/diary/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    diary: newDiary
                })
            });
            const data = await res.json();
            setDiaryData(data);
        }
        setNewDiaryLoading(false);
        setNewDiary({
            name: '',
            description: '',
            color: theme.palette.primary.main
        });
    }

    const handleDiaryDelete = async (key) => {
        //setHideDiaryLoading(false);
        const res = await fetch('/api/diary/delete', {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId:session.user.id,
                diaryId:key
            })
        });

        const data = await res.json();
        setDiaryData(data);
        setDeleteDialogOpen(false);
    }

    const handleDeleteDialogOpen = (key,name) => {
        setDialogDiaryId(key);
        setDialogTitleText(`Delete ${name} Diary?`);
        setDialogContentText(`${name} will be permanently deleted.`);
        setDeleteDialogOpen(true);
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const handleModifyDiary = (id,name,description,color) => {
        setNewDiary({
            name:name,
            description: description,
            color: color
        });
        setModifyDiary(id);
    }
    const handleDisableModify = () => {
        setNewDiary({
            name: '',
            description: '',
            color: theme.palette.primary.main
        });
        setModifyDiary(null);
    }

    const handleDiaryNavigation = async(id) => {
        setNewDiaryLoading(true);
        await router.push(`/diary/${id}`);
    }

    useEffect(() => {
        async function getDiaries() {
            const res = await fetch('/api/diary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            return await res.json();
        }

        getDiaries().then((data) => {
            setDiaryData(data);
        })
    }, []);

    const handleSelectedDiaryToAnalyzeChange = async (event) => {
        setSelectedDiaryToAnalyze(event.target.value);
        const canAnalyze = diaryData.data.find((element) => {
            return element._id === event.target.value && element.numberOfRecords >= 3;
        })
        console.log(canAnalyze);
        if (!canAnalyze) {
            setToggleAnalysis(false);
        }else {
            await getDataForAnalysis(event.target.value);
        }
    }

    const getDataForAnalysis = async(diaryId) => {
        setToggleAnalysis(true);
        setAnalysisLoading(true);
        const res = await fetch('/api/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId:session.user.id,
                diaryId:diaryId,
                analysis:true,
            })
        });

        const data = await res.json();
        console.log(data);
        setRecordsForAnalysis(data.data.records);
        const chartDataTemp = [];
        let uniqueMedications =[];
        let uniqueDiet =[];
        let uniqueSymptoms =[];
        let uniqueTriggers = [];
        for (const record of data.data.records) {
            let dataEntry = {
                name: DateTime.fromISO(record.recordStartDate).toFormat('dd/LL/yyyy HH:mm'),
                painLevel:record.painLevel,
                activity:record.activityLevel,
                mood:record.mood,
            }
            for(const medication of record.medications){
                if(!uniqueMedications.includes(medication)){
                    uniqueMedications.push(medication);
                }
                dataEntry[medication] = record.painLevel
            }
            for(const product of record.diet){
                if(!uniqueDiet.includes(product)){
                    uniqueDiet.push(product);
                }
                dataEntry[product] = record.painLevel
            }
            for(const symptom of record.symptoms) {
                if(!uniqueSymptoms.includes(symptom)){
                    uniqueSymptoms.push(symptom);
                }
                dataEntry[symptom] = record.painLevel;
            }
            for(const trigger of record.triggers) {
                if (!uniqueTriggers.includes(trigger)){
                    uniqueTriggers.push(trigger);
                }
                dataEntry[trigger] = record.painLevel;
            }
            chartDataTemp.push(dataEntry);
        }
        setUniqueTriggers(uniqueTriggers);
        setUniqueSymptoms(uniqueSymptoms);
        setUniqueMedications(uniqueMedications);
        setUniqueDiet(uniqueDiet);
        setChartData(chartDataTemp);
        setAnalysisData(data.data.analysis);
        setAnalysisLoading(false);
    }

    const handleShowActivity = (event) => {
        setShowPainLevel(true);
        setShowMedication(false);
        setShowDiet(false);
        setShowSymptoms(false);
        setShowTriggers(false);
        setShowActivity(event.target.checked);
    }

    const handleShowMood = (event) => {
        setShowPainLevel(true);
        setShowMedication(false);
        setShowDiet(false);
        setShowSymptoms(false);
        setShowTriggers(false);
        setShowMood(event.target.checked);
    }

    const handleShowMedication = (event) => {
        setShowPainLevel(!event.target.checked);
        setShowMood(false);
        setShowActivity(false);
        setShowDiet(false);
        setShowSymptoms(false);
        setShowTriggers(false);
        setShowMedication(event.target.checked);
    }
    const handleShowDiet = (event) => {
        setShowPainLevel(!event.target.checked);
        setShowMood(false);
        setShowActivity(false);
        setShowSymptoms(false);
        setShowTriggers(false);
        setShowMedication(false);
        setShowDiet(event.target.checked);
    }
    const handleShowSymptoms = (event) => {
        setShowPainLevel(!event.target.checked);
        setShowMood(false);
        setShowActivity(false);
        setShowTriggers(false);
        setShowMedication(false);
        setShowDiet(false);
        setShowSymptoms(event.target.checked);
    }
    const handleShowTriggers = (event) => {
        setShowPainLevel(!event.target.checked);
        setShowMood(false);
        setShowActivity(false);
        setShowMedication(false);
        setShowDiet(false);
        setShowSymptoms(false);
        setShowTriggers(event.target.checked);
    }

    return (
        <Grid container spacing={2} sx={{marginTop: '2vh',marginBottom:'2vh'}}>
            <Grid item xs={12} md={8} order={{xs:2,md:1}}>
                <Paper elevation={3} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: (theme) => theme.spacing(2),
                    borderRadius: '10px'
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" variant="h5">Your Diaries</Typography>
                        </Grid>
                        {diaryData.data ?
                            diaryData.data.length > 0 ?
                                diaryData.data.map((data) => {
                                    return (
                                        <Grid key={data._id} item xs={12} sm={6} lg={4} md={6}>
                                            <Paper sx={{
                                                height: '290px', borderRadius: '15px',
                                                backgroundColor: data.color,
                                                color: getContrast(data.color),
                                            }} elevation={7}>
                                                <Grid container padding={2} alignContent="space-between" sx={{
                                                    height: 'inherit',
                                                }}>
                                                    <Grid container item xs={12}>
                                                        <Grid item xs={12}
                                                              sx={{textAlign: 'center', alignSelf: 'center'}}>
                                                            <Typography variant="h6" sx={{
                                                                overflowWrap: 'anywhere',
                                                                fontWeight: 'bold'
                                                            }}>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>{`Created at ${DateTime.fromISO(data.createdDate).toFormat('dd/LL/yyyy')} ${DateTime.fromISO(data.createdDate).toFormat('HH:mm')}`}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>Number of Records: {data.numberOfRecords}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>Last record: {data.lastRecord ? DateTime.fromISO(data.lastRecord).toFormat('dd/LL/yyyy HH:mm') : 'No Records'}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container item xs={12} justifyContent="space-between">
                                                        <Grid item xs={2}>
                                                            <Tooltip title="Open" arrow placement="top">
                                                                <IconButton onClick={() => handleDiaryNavigation(data._id)}>
                                                                    <OpenInFullIcon sx={{
                                                                        color:getContrast(data.color)
                                                                    }}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Tooltip title="Edit" arrow placement="top">
                                                                <IconButton onClick={() => handleModifyDiary(
                                                                    data._id,
                                                                    data.name,
                                                                    data.description,
                                                                    data.color
                                                                )}>
                                                                    <EditIcon sx={{
                                                                        color: getContrast(data.color)
                                                                    }}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item xs={2} textAlign="end">
                                                            <Tooltip title="Delete" arrow placement="top">
                                                                <IconButton onClick={() => handleDeleteDialogOpen(data._id,data.name)}>
                                                                    <DeleteIcon sx={{
                                                                        color: getContrast(data.color)
                                                                    }}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    )
                                })
                                : <Grid item xs={12}><Alert severity="info">Add your first Pain Diary</Alert></Grid>
                            : <Grid item xs={12}><CircularProgress/></Grid>
                        }
                    </Grid>
                </Paper>
                <CustomDialog
                    open={deleteDialogOpen}
                    handleDialogClose={handleDeleteDialogClose}
                    diaryId={dialogDiaryId}
                    titleText={dialogTitleText}
                    contentText={dialogContentText}
                    actionName="Delete"
                    confirmAction={handleDiaryDelete}
                />
            </Grid>
            <Grid item xs={12} md={4} order={{xs:1,md:2}}>
                <Paper elevation={3} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: (theme) => theme.spacing(2),
                    borderRadius: '10px'
                }}>
                    <form onSubmit={handleNewDiary}>
                        <Typography fontWeight="bold" variant="h5" sx={{paddingBottom: '2vh'}}>
                            {modifyDiary ? `Modify Diary`
                            : `Add New Diary`}
                        </Typography>
                        <TextField
                            name="name"
                            multiline
                            required
                            maxRows={1}
                            value={newDiary.name}
                            onChange={handleChange}
                            label="Name"
                            fullWidth
                            inputProps={{
                                maxLength: NAME_LIMIT
                            }}
                            helperText={`${newDiary.name.length}/${NAME_LIMIT}`}
                            sx={{
                                marginTop: '2vh',
                                '& .MuiFormHelperText-root': {
                                    textAlign: 'end',
                                    marginRight: 0
                                }

                            }}
                        />
                        <TextField
                            name="description"
                            multiline
                            maxRows={4}
                            value={newDiary.description}
                            onChange={handleChange}
                            label="Description"
                            fullWidth
                            inputProps={{
                                maxLength: CHARACTER_LIMIT
                            }}
                            helperText={`${newDiary.description.length}/${CHARACTER_LIMIT}`}
                            sx={{
                                marginTop: '2vh',
                                '& .MuiFormHelperText-root': {
                                    textAlign: 'end',
                                    marginRight: 0
                                }

                            }}
                        />
                        <Grid container alignItems="center">
                            <Grid item lg={2} xs={12}>
                                <Typography>Color:</Typography>
                            </Grid>
                            <Grid item lg={10} xs={12}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '4vh',
                                        backgroundColor: newDiary.color,
                                        cursor: 'pointer',
                                        border: '1px solid rgb(118, 118, 118)',
                                        borderRadius: '5px',
                                    }}
                                    onClick={handleDialogOpen}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ColorPicker
                                    open={openColorPicker}
                                    onClose={handleDialogClose}
                                    selectedValue={newDiary.color}
                                    handleColorChange={handleColorChange}
                                    id={id}
                                    anchorEl={anchorEl}
                                />
                            </Grid>

                        </Grid>

                        <LoadingButton loading={newDiaryLoading} type="submit" variant="contained" fullWidth sx={{marginTop: '2vh'}}>
                            {modifyDiary ? `Modify Diary`
                                : `Create New Diary`
                            }
                        </LoadingButton>
                        {
                            modifyDiary &&
                            <Button variant="contained" fullWidth sx={{marginTop:'2vh'}} onClick={handleDisableModify}>
                                Back
                            </Button>
                        }
                        {newDiaryLoading &&
                            <LinearProgress/>
                        }
                        {diaryData.type &&
                            <Alert severity={diaryData.type} sx={{marginTop: '1vh'}}>{diaryData.message}</Alert>
                        }
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} order={{xs:3}}>
                <Paper elevation={3} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: (theme) => theme.spacing(2),
                    borderRadius: '10px'
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" fontWeight="bold">Diary Analysis</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="diaryToAnalyze">Diary</InputLabel>
                                <Select
                                    labelId="diaryToAnalyze"
                                    id="selectedDiaryToAnalyze"
                                    value={selectedDiaryToAnalyze}
                                    label="Diary"
                                    onChange={handleSelectedDiaryToAnalyzeChange}
                                >
                                    {diaryData.data &&
                                        diaryData.data.map((data) => {
                                            return (
                                                <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={8} lg={9} alignSelf="center">
                            {selectedDiaryToAnalyze ?
                                !toggleAnalysis &&
                                <Typography>Diary must have at least 3 records for the analysis</Typography>
                                :
                                <Typography>Select a diary to analyze</Typography>
                            }
                        </Grid>
                        <Grid item container xs={12} spacing={1}>
                            {toggleAnalysis ?
                                analysisLoading ?
                                    <>
                                    <Grid item xs={12}>
                                        <LinearProgress color="primary"/>
                                    </Grid>
                                    <Grid item container xs={6} spacing={1}>
                                        <Grid item xs={12}>
                                            <Skeleton animation="wave" variant="rectangular" height={400}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Skeleton animation="wave" height={30}/>
                                        </Grid>
                                    </Grid>
                                        <Grid item container xs={6} alignContent="flex-start">
                                            <Grid item xs={12}>
                                                <Skeleton animation="wave" height={70}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Skeleton animation="wave" height={70}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Skeleton animation="wave" height={70}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Skeleton animation="wave" height={70}/>
                                            </Grid>
                                        </Grid>
                                    </>
                                :
                                    <>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={12}>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <ComposedChart
                                                    data={chartData}
                                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid stroke="#f5f5f5" />
                                                    <XAxis dataKey="name" scale="band"/>
                                                    <YAxis label={{value:showMedication ? 'Pain Level' : 'Scale',angle:-90,position:'insideCenter',offset:20}}/>
                                                    <ChartTooltip/>
                                                    <Legend/>
                                                    {showActivity &&
                                                        <Bar dataKey="activity" barSize={20} fill={theme.palette.primary.dark}/>
                                                    }
                                                    {showMood &&
                                                        <Bar dataKey="mood" barSize={20} fill="#BFA616"/>
                                                    }
                                                    {showPainLevel &&
                                                        <Line type="monotone" dataKey="painLevel" stroke={theme.palette.primary.main}/>
                                                    }
                                                    {showMedication &&
                                                        uniqueMedications.map((data,index) => {
                                                            return (
                                                                <Line key={index} connectNulls type="monotone" dataKey={data} stroke={randomColor({luminosity:'dark'})}/>
                                                            )
                                                        })
                                                    }
                                                    {showDiet &&
                                                        uniqueDiet.map((data,index) => {
                                                            return (
                                                                <Line key={index} connectNulls type="monotone" dataKey={data} stroke={randomColor({luminosity:'dark'})}/>
                                                            )
                                                        })
                                                    }
                                                    {showSymptoms &&
                                                        uniqueSymptoms.map((data,index) => {
                                                            return (
                                                                <Line key={index} connectNulls type="monotone" dataKey={data} stroke={randomColor({luminosity:'dark'})}/>
                                                            )
                                                        })
                                                    }
                                                    {showTriggers &&
                                                        uniqueTriggers.map((data,index) => {
                                                            return (
                                                                <Line key={index} connectNulls type="monotone" dataKey={data} stroke={randomColor({luminosity:'dark'})}/>
                                                            )
                                                        })
                                                    }
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showActivity} onChange={handleShowActivity}/>} label="Activity"/>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showMood} onChange={handleShowMood}/>} label="Mood"/>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showMedication} onChange={handleShowMedication}/>} label="Medication"/>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showDiet} onChange={handleShowDiet}/>} label="Diet"/>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showSymptoms} onChange={handleShowSymptoms}/>} label="Symptoms"/>
                                        </Grid>
                                        <Grid item xs={4} textAlign="center">
                                            <FormControlLabel control={<Switch checked={showTriggers} onChange={handleShowTriggers}/>} label="Triggers"/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6} alignContent="flex-start" spacing={1}>
                                        {/*Average Pain Level*/}
                                        <Grid item container xs={12} spacing={1} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" textAlign="center">Average Pain Level</Typography>
                                            </Grid>
                                            <Grid item container xs={2}>
                                                <Grid item container xs={12} sx={{p:1,border: '1px solid rgba(189, 195, 199,1)', borderRadius:2,
                                                backgroundColor:analysisData.avgPainLevel.lastWeekColor + "20"}}>
                                                    <Grid item xs={6} display="flex" alignSelf="center" justifyContent="flex-end">
                                                        <HeartBrokenIcon sx={{color:analysisData.avgPainLevel.lastWeekColor}}/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6">{analysisData.avgPainLevel.lastWeek}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} textAlign="center">
                                                    <Typography variant="caption">Last Week</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1} textAlign="center" sx={{mt:1.2}}>
                                                <Typography variant="subtitle1" color={analysisData.avgPainLevel.thisWeekColor}>{`${analysisData.avgPainLevel.percentage}%`}</Typography>
                                            </Grid>
                                            <Grid item container xs={2}>
                                                <Grid item container xs={12} sx={{p:1,border: '1px solid rgba(189, 195, 199,1)', borderRadius:2,
                                                backgroundColor:analysisData.avgPainLevel.thisWeekColor + "20"}}>
                                                    <Grid item xs={6} display="flex" alignSelf="center" justifyContent="flex-end">
                                                        <HeartBrokenIcon sx={{color:analysisData.avgPainLevel.thisWeekColor}}/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6">{analysisData.avgPainLevel.thisWeek}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} textAlign="center">
                                                    <Typography variant="caption">This Week</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/*Average Pain Level per Time Period*/}
                                        <Grid item container xs={12} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" textAlign="center">Average Pain Level per Time Period</Typography>
                                            </Grid>
                                            <Grid item container xs={8} sx={{border: '1px solid rgba(189, 195, 199,1)', borderRadius:2,mt:1}}>
                                                <Grid item container xs={3} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelByTime.averagePainTwelveAmToSixAmColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`← 6am`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByTime.averagePainTwelveAmToSixAmColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByTime.averagePainTwelveAmToSixAm}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={3} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelByTime.averagePainSixAmToTwelvePmColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`6am-12pm`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByTime.averagePainSixAmToTwelvePmColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByTime.averagePainSixAmToTwelvePm}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={3} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelByTime.averagePainTwelvePmToSixPmColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`12pm-6pm`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByTime.averagePainTwelvePmToSixPmColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByTime.averagePainTwelvePmToSixPm}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={3} sx={{backgroundColor:analysisData.avgPainLevelByTime.averagePainSixPmToTwelveAmColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`6pm →`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByTime.averagePainSixPmToTwelveAmColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByTime.averagePainSixPmToTwelveAm}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/*Average Pain Level by Sleep*/}
                                        <Grid item container xs={12} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" textAlign="center">Average Pain Level by Sleep</Typography>
                                            </Grid>
                                            <Grid item container xs={6} sx={{border: '1px solid rgba(189, 195, 199,1)', borderRadius:2,mt:1}}>
                                                <Grid item container xs={4} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelBySleep.averageLessThanSixColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`< 6hrs`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelBySleep.averageLessThanSixColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelBySleep.averageLessThanSix}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={4} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelBySleep.averageSixToEightColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`6-8hrs`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelBySleep.averageSixToEightColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelBySleep.averageSixToEight}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={4} sx={{backgroundColor:analysisData.avgPainLevelBySleep.averageMoreThanEightColor + "20"}}>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="caption">{`> 8hrs`}</Typography>
                                                    </Grid>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelBySleep.averageMoreThanEightColor}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelBySleep.averageMoreThanEight}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/*Most Painful Areas*/}
                                        <Grid item container xs={12} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" textAlign="center">Most Painful Areas</Typography>
                                            </Grid>
                                            <Grid item container xs={8} sx={{border: '1px solid rgba(189, 195, 199,1)', borderRadius:2,mt:1,}}>
                                                <Grid item container xs={4} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                    backgroundColor:analysisData.avgPainLevelByArea.area1.color + "20"}}>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByArea.area1.color}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByArea.area1.average}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="body2">{analysisData.avgPainLevelByArea.area1.name}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={4} sx={{borderRight: '1px solid rgba(189, 195, 199,1)',
                                                backgroundColor:analysisData.avgPainLevelByArea.area2.color + "20"}}>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByArea.area2.color}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByArea.area2.average}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="body2">{analysisData.avgPainLevelByArea.area2.name}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={4} sx={{backgroundColor:analysisData.avgPainLevelByArea.area3.color + "20"}}>
                                                    <Grid item container xs={12} justifyContent="center">
                                                        <Grid item xs="auto">
                                                            <HeartBrokenIcon sx={{color:analysisData.avgPainLevelByArea.area3.color}}/>
                                                        </Grid>
                                                        <Grid item xs="auto">
                                                            <Typography>{analysisData.avgPainLevelByArea.area3.average}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} textAlign="center">
                                                        <Typography variant="body2">{analysisData.avgPainLevelByArea.area3.name}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                                {/*    <Grid item container xs={2} textAlign="center" sx={{borderRight: '1px solid rgba(189, 195, 199,1)'}}>*/}
                                                {/*        <Grid item container xs={12}>*/}
                                                {/*            <Grid item xs={7} textAlign="end">*/}
                                                {/*                <HeartBrokenIcon color="primary"/>*/}
                                                {/*            </Grid>*/}
                                                {/*            <Grid item xs={5} textAlign="start">*/}
                                                {/*                <Typography>4</Typography>*/}
                                                {/*            </Grid>*/}
                                                {/*        </Grid>*/}
                                                {/*        <Grid item xs={12}>*/}
                                                {/*            <Typography>Right Head</Typography>*/}
                                                {/*        </Grid>*/}
                                                {/*    </Grid>*/}
                                                {/*    <Grid item container xs={2} textAlign="center" sx={{borderRight: '1px solid rgba(189, 195, 199,1)'}}>*/}
                                                {/*        <Grid item container xs={12}>*/}
                                                {/*            <Grid item xs={7} textAlign="end">*/}
                                                {/*                <HeartBrokenIcon color="primary"/>*/}
                                                {/*            </Grid>*/}
                                                {/*            <Grid item xs={5} textAlign="start">*/}
                                                {/*                <Typography>4</Typography>*/}
                                                {/*            </Grid>*/}
                                                {/*        </Grid>*/}
                                                {/*        <Grid item xs={12}>*/}
                                                {/*            <Typography>Left Head</Typography>*/}
                                                {/*        </Grid>*/}
                                                {/*    </Grid>*/}
                                                {/*    <Grid item container xs={2} textAlign="center">*/}
                                                {/*        <Grid item container xs={12}>*/}
                                                {/*            <Grid item xs={7} textAlign="end">*/}
                                                {/*                <HeartBrokenIcon color="primary"/>*/}
                                                {/*            </Grid>*/}
                                                {/*            <Grid item xs={5} textAlign="start">*/}
                                                {/*                <Typography>4</Typography>*/}
                                                {/*            </Grid>*/}
                                                {/*        </Grid>*/}
                                                {/*        <Grid item xs={12}>*/}
                                                {/*            <Typography>Back</Typography>*/}
                                                {/*        </Grid>*/}
                                                {/*    </Grid>*/}
                                        </Grid>
                                    </Grid>
                                    </>
                                :
                                <></>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Dashboard;

const getContrast = (hex) => {
    if (hex.slice(0, 1) === '#') {
        hex = hex.slice(1);
    }

    if (hex.length === 3) {
        hex = hex.split('').map((hex) => {
            return hex + hex;
        }).join('');
    }

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

}