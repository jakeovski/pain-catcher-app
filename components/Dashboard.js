import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid, IconButton,
    LinearProgress,
    Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import ColorPicker from "../helper/ColorPicker";
import {MoreVertSharp} from "@mui/icons-material";
import {DateTime} from "luxon";

const Dashboard = ({session}) => {
    const theme = useTheme();
    const CHARACTER_LIMIT = 200;
    const NAME_LIMIT = 20;
    const [anchorEl,setAnchorEl] = useState(null);
    const openColorPicker = Boolean(anchorEl);
    const id = openColorPicker ? 'simple-popover' : undefined;

    const [newDiaryLoading, setNewDiaryLoading] = useState(false);

    const [newDiary,setNewDiary] = useState({
        name:'',
        description:'',
        color:theme.palette.primary.main
    });

    const handleDialogOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleDialogClose = () => {
        setAnchorEl(null);
    }

    const handleColorChange = (value) => {
        setNewDiary({
            ...newDiary,color:value
        })
    }

    const handleChange = (e) => {
        setNewDiary({
            ...newDiary,[e.target.name]:e.target.value
        });
    }

    const handleNewDiary = async(e) => {
        e.preventDefault();
        setNewDiaryLoading(true);
        const res = await fetch('/api/diary/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId:session.user.id,
                diary:newDiary
            })
        });

        const data = await res.json();
        setNewDiaryLoading(false);
        setDiaryData(data);
    }

    const [diaryData,setDiaryData] = useState({
        data:undefined,
        type:'',
        message:''
    });

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
    },[]);

    return (
            <Grid container spacing={2} sx={{marginTop:'2vh'}}>
                <Grid item xs={8}>
                    <Paper elevation={3} sx={{
                        display:'flex',
                        flexDirection:'row',
                        padding:(theme) => theme.spacing(2),
                        borderRadius:'10px'
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography fontWeight="bold" variant="h5">Your Diaries</Typography>
                            </Grid>
                        {diaryData.data ?
                            diaryData.data.length > 0 ?
                                diaryData.data.map((data) => {
                                    return(
                                        // eslint-disable-next-line react/jsx-key
                                        <Grid item xs={12} lg={4}>
                                            <Paper sx={{
                                                height:'33vh',borderRadius:'15px',cursor:'pointer',
                                                backgroundColor:data.color,
                                                color:getContrast(data.color),
                                            }} elevation={7}>
                                                <Grid container padding={2} sx={{
                                                    height:'inherit',
                                                    display:'flex',
                                                    alignItems:'center',
                                                    alignContent:'space-between'
                                                }}>
                                                    <Grid item container  flexDirection="row">
                                                        <Grid item xs={11} sx={{textAlign:'center',alignSelf:'center'}}>
                                                            <Typography sx={{
                                                                overflowWrap:'anywhere',
                                                                fontWeight:'bold'
                                                            }}>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton aria-label="settings">
                                                                <MoreVertSharp/>
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography>{`Created at ${DateTime.fromISO(data.createdDate).toFormat('dd/LL/yyyy')} ${DateTime.fromISO(data.createdDate).toFormat('HH:mm')}`}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>Number of Records</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>Last record: No Records</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                                {/*<CardHeader*/}
                                                {/*    titleTypographyProps={{*/}
                                                {/*        variant:'body1',*/}
                                                {/*    }}*/}
                                                {/*    action={*/}
                                                {/*        <IconButton aria-label="settings">*/}
                                                {/*            <MoreVertSharp/>*/}
                                                {/*        </IconButton>*/}
                                                {/*    }*/}
                                                {/*    title={data.name}*/}
                                                {/*    subheader={`Created: ${DateTime.fromISO(data.createdDate).toFormat('dd/LL/yyyy')} at ${DateTime.fromISO(data.createdDate).toFormat('HH:mm')}`}*/}
                                                {/*/>*/}
                                        </Grid>
                                        )
                                })
                                : <Grid item xs={12}><Alert severity="info">Add your first Pain Diary</Alert></Grid>
                            : <Grid item xs={12}><CircularProgress/></Grid>
                        }
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{
                        display:'flex',
                        flexDirection:'column',
                        padding:(theme) => theme.spacing(2),
                        borderRadius:'10px'
                    }}>
                        <form onSubmit={handleNewDiary}>
                        <Typography fontWeight="bold" variant="h5" sx={{paddingBottom:'2vh'}}>Add New Diary</Typography>
                            <TextField
                                name="name"
                                multiline
                                maxRows={1}
                                value={newDiary.name}
                                onChange={handleChange}
                                label="Name*"
                                fullWidth
                                inputProps={{
                                    maxLength:NAME_LIMIT
                                }}
                                helperText={`${newDiary.name.length}/${NAME_LIMIT}`}
                                sx={{
                                    marginTop:'2vh',
                                    '& .MuiFormHelperText-root':{
                                        textAlign:'end',
                                        marginRight:0
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
                                    maxLength:CHARACTER_LIMIT
                                }}
                                helperText={`${newDiary.description.length}/${CHARACTER_LIMIT}`}
                                sx={{
                                    marginTop:'2vh',
                                    '& .MuiFormHelperText-root':{
                                        textAlign:'end',
                                        marginRight:0
                                    }

                                }}
                            />
                            <Box
                                sx={{
                                    width:'100%',
                                    height:'4vh',
                                    backgroundColor:newDiary.color,
                                    marginTop:'1vh',
                                    cursor:'pointer',
                                    border:'1px solid rgb(118, 118, 118)',
                                    borderRadius:'5px',
                                }}
                                onClick={handleDialogOpen}
                            />
                            <ColorPicker
                                open={openColorPicker}
                                onClose={handleDialogClose}
                                selectedValue={newDiary.color}
                                handleColorChange={handleColorChange}
                                id={id}
                                anchorEl={anchorEl}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{marginTop:'2vh'}}>Create New Diary</Button>
                            {newDiaryLoading &&
                                <LinearProgress/>
                            }
                            {diaryData.type &&
                                <Alert severity={diaryData.type} sx={{marginTop:'1vh'}}>{diaryData.message}</Alert>
                            }
                        </form>
                    </Paper>
                </Grid>
            </Grid>
    )
}

export default Dashboard;

const getContrast = (hex) => {
    if (hex.slice(0,1) === '#'){
        hex = hex.slice(1);
    }

    if (hex.length === 3) {
        hex = hex.split('').map((hex) => {
            return hex + hex;
        }).join('');
    }

    let r = parseInt(hex.substr(0,2),16);
    let g = parseInt(hex.substr(2,2),16);
    let b = parseInt(hex.substr(4,2),16);

    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

}