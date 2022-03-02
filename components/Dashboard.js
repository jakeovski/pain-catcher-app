import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid, IconButton,
    LinearProgress,
    Paper,
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

    //TODO:Not used right now, delete if will not be used at all
    const [hideDiaryLoading,setHideDiaryLoading] = useState(true);

    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const [dialogDiaryId,setDialogDiaryId] = useState(null);
    const [dialogTitleText,setDialogTitleText] = useState(null);
    const [dialogContentText,setDialogContentText] = useState(null);


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
        //setHideDiaryLoading(true);
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

    return (
        <Grid container spacing={2} sx={{marginTop: '2vh'}}>
            <Grid item xs={8}>
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
                        {diaryData.data && hideDiaryLoading ?
                            diaryData.data.length > 0 ?
                                diaryData.data.map((data) => {
                                    return (
                                        <Grid key={data._id} item lg={4} md={6}>
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
                                                            <Typography>Last record: No Records</Typography>
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
            <Grid item xs={4}>
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

                        <Button type="submit" variant="contained" fullWidth sx={{marginTop: '2vh'}}>
                            {modifyDiary ? `Modify Diary`
                                : `Create New Diary`
                            }
                        </Button>
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

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

}