import React, {useState} from 'react';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Divider,
    FormControl, FormHelperText,
    Grid,
    IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import {Alert} from "@mui/lab";
import DeleteIcon from '@mui/icons-material/Delete';


const HormoneDialog = ({hormoneDetails,setHormoneDetails,recordData,setRecordData,hormoneDialogOpen, setHormoneDialogOpen, hormoneDetailsDefault}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [showAlert,setShowAlert] = useState(false);
    const psaText = 'PSA (Prostate-specific antigen) is a protein produced mainly by cells' +
        ' in the prostate gland and is a useful indicator of prostate cancer. ' +
        'PSA is found in all males; however, levels may be elevated in men with an infection' +
        ' of the prostate gland, prostate enlargement or prostate cancer';
    const oestradiolText = 'Oestradiol (17β-oestradiol or E2) is the most active form of oestrogen. ' +
        'Oestradiol plays a critical role in male sexual function, it is essential for modulating libido,' +
        ' erectile function, and sperm production. Aromatase is the enzyme responsible for converting' +
        ' testosterone to oestradiol';

    const progesteroneText = 'Progesterone plays an important role in sperm production and it is' +
        ' a major precursor to testosterone. Within the male body, it plays a vital role on' +
        ' counteracting the effects of oestrogen. As men age progesterone production declines' +
        ' and affect testosterone production. Simultaneously, oestrogen levels can rise in' +
        ' older males leading to a hormone imbalance.';

    const progesteroneTextFemale = 'Progesterone is a steroid hormone whose main role is to help prepare' +
        ' a woman’s body for pregnancy. It is produced by the corpus luteum and works with other female hormones' +
        ' to prepare the uterus for implantation of a fertilised egg. Levels are checked around day 21 of a monthly' +
        ' cycle to indicate whether ovulation has occurred. Low levels may indicate that ovulation has not occurred,' +
        ' and levels usually rise during pregnancy. Progesterone is also produced in men but at a much lower level and' +
        ' it is involved in the production of sperm.';

    const testosteroneText = 'Testosterone is a steroid hormone made by the testes in men and it is secreted' +
        ' in a diurnal pattern with highest values at 8-9 am in men who work' +
        ' day shifts. It plays a vital role in regulating libido, bone density,' +
        ' fat distribution, muscle mass, red blood cell and sperm production.' +
        ' A small proportion of circulating testosterone is converted to oestradiol.' +
        ' As men age, testosterone production declines and this can be accompanied' +
        ' by a number of symptoms.';

    const testosteroneTextFemale = 'Testosterone is a steroid hormone made by the testes in men. In women,' +
        ' it is produced in small amounts by the ovaries and by the conversion from other weak androgens, ' +
        'levels are around one tenth of those in men. It is secreted in a diurnal pattern with highest ' +
        'values at 8-9am in men who work day shifts. Low concentrations are normally seen in women with slightly higher' +
        ' values during the luteal phase of the menstrual cycle.';

    const dheaText = 'DHEA-S (dehydroepiandrosterone sulphate) is the sulphated' +
        ' form of the weak androgen DHEA. It is a male sex hormone present' +
        ' in the blood of men and women produced by the adrenal glands,' +
        ' with smaller amounts being produced by the ovaries.' +
        ' It can be converted into more potent androgens such as' +
        ' testosterone and androstenedione, or changed into the female hormone oestrogen.';

    const shbgText = 'SHBG (Sex Hormone Binding Globulin) is a protein produced' +
        ' by the liver. It binds tightly to the hormones testosterone,' +
        ' dihydrotestosterone (DHT) and oestradiol and transports them in the blood in their' +
        ' inactive form. The amount of circulating SHBG depends on age and sex, and also by' +
        ' decreased or increased testosterone or oestrogen production. ' +
        'Changes in the amount of SHBG may affect the amount of testosterone available ' +
        'for use by the body.';

    const vitaminDText = 'Two forms of vitamin D can be measured in blood: 25-hydroxyvitamin D' +
        ' and 1,25-dihydroxyvitamin D. 25-hydroxyvitamin D is the major form of vitamin D and' +
        ' is converted to the more active hormone, 1,25-dihydroxyvitamin D. The main role of vitamin D' +
        ' is to help regulate the absorption of calcium, phosphate and magnesium. It is vital for the' +
        ' growth and health of bone, and also plays an important role in musculoskeletal health.';

    const fbcText = 'The FBC (full blood count) is a commonly requested test which provides' +
        ' information about the types and numbers of cells within blood: red blood cells,' +
        ' white blood cells and platelets. Mean Cell Volume (MCV), Mean Cell Haemoglobin (MCH), ' +
        'Mean Cell Haemoglobin Concentration (MCHC) and Red Cell Distribution Width (RDW) are ' +
        'measurements relating to the volume, size and haemoglobin content of red blood cells.' +
        '  The MCV, MCH, MCHC and RDW provide information on the overall size and volume of the ' +
        'circulating red cell mass. White blood cells control the immune process and are responsible' +
        ' for protecting the body from invading foreign bodies such as bacteria, fungi and viruses.' +
        ' Platelets assist in the clotting process in broken blood vessels.';

    const fshText = 'FSH (follicle-stimulating hormone) is a hormone produced by the pituitary gland' +
        ' in the brain. In women, FSH helps stimulate the growth and development of ovarian follicles' +
        ' (unfertilised eggs) during the follicular phase of the menstrual cycle. At the time of the menopause,' +
        ' the ovaries stop functioning and FSH levels rise. During pregnancy, oestrogen levels are high and this' +
        ' makes FSH undetectable. In men, FSH stimulates the testes to produce mature sperm. FSH levels are relatively' +
        ' constant in men after puberty.';

    const oestradiolTextFemale = 'Oestradiol (17β-oestradiol or E2) is the most active form of oestrogen. ' +
        'It is involved in ovulation, conception, and pregnancy, and has effects on other tissues such as bone,' +
        ' fat, skin, etc. It is mainly produced by the ovary with small amounts being produced in the testes and' +
        ' adrenal cortex. Its production begins to fluctuate and lower in the years leading to menopause. Menopause' +
        ' can be confirmed by a decrease in blood oestradiol levels.';



    const handleDialogClose = () => {
        setHormoneDialogOpen(false);
        setShowAlert(false);
    }

    const handleGenderChange = (event) => {
        setHormoneDetails({
            ...hormoneDetails,gender:event.target.value
        })
    }

    const removeHormoneDetails = () => {
        setRecordData({
            ...recordData,hormoneDetails:hormoneDetailsDefault
        });
        setHormoneDetails(hormoneDetailsDefault);
        setHormoneDialogOpen(false);
    }

    const testosteroneValues = [
        {
            value:'free',
            label: 'pg/mL'
        },
        {
            value:'total',
            label: 'nmol/L'
        }
    ]

    const handleMeasure = (event) => {
       setHormoneDetails({
           ...hormoneDetails,testosterone: {
               value: hormoneDetails.testosterone.value,
               measure: event.target.value
           }
       })
    }

    const handleDialogSubmit = () => {
        let check = false;
        if (hormoneDetails.PSA){
            check = true;
        }else if (hormoneDetails.oestradiol) {
            check=true;
        }else if (hormoneDetails.progesterone) {
            check = true;
        }else if (hormoneDetails.DHEA) {
            check=true;
        }else if (hormoneDetails.testosterone.value) {
            check=true;
        }else if (hormoneDetails.FBC.MCHC) {
            check = true;
        }else if (hormoneDetails.FBC.MCH) {
            check = true;
        }else if (hormoneDetails.FBC.MCV) {
            check = true;
        }else if (hormoneDetails.FBC.RDW){
            check = true;
        }else if (hormoneDetails.vitaminD) {
            check = true;
        }else if (hormoneDetails.SHBG) {
            check = true;
        }else if (hormoneDetails.FSH) {
            check = true;
        }
        if (check) {
            setRecordData({
                ...recordData,hormoneDetails:{...hormoneDetails,populated: true}
            });
            setHormoneDialogOpen(false);
        }
        else {
            setHormoneDetails({
                ...hormoneDetails,populated:false
            })
            setShowAlert(true);
        }
    }

    return (
        <Dialog
            open={hormoneDialogOpen}
            fullScreen={fullScreen}
            onClose={handleDialogClose}
            fullWidth
            scroll='paper'
            maxWidth="md"
        >
            <DialogTitle sx={{m: 0, p: 2}}>
                Hormone Levels
                <IconButton
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} minWidth="md">
                    <Grid item xs="auto" alignSelf="center">
                        <Typography>Select your gender:</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="genderSelectLabel">Gender</InputLabel>
                            <Select
                                labelId="genderSelectLabel"
                                id="genderSelect"
                                value={hormoneDetails.gender}
                                label="Gender"
                                onChange={handleGenderChange}
                            >
                                <MenuItem value='Male'>Male</MenuItem>
                                <MenuItem value='Female'>Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                        {
                            hormoneDetails.gender ?
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">{hormoneDetails.gender} Hormone Profile <small style={{opacity:0.55,fontSize:13}}>(Data is taken from mariongluckclinic.com)</small></Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={3} md={4} paddingTop={1}>
                                            <Typography>{hormoneDetails.gender === 'Male' ? 'PSA (Total):' : 'FSH'}</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={8}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={hormoneDetails.gender === 'Male' ? hormoneDetails.PSA : hormoneDetails.FSH}
                                                type="number"
                                                InputProps={{
                                                    endAdornment:<InputAdornment position="end">
                                                        {hormoneDetails.gender === 'Male' ? 'µg/L' : 'IU/L'}
                                                        <Tooltip title={hormoneDetails.gender === 'Male' ? psaText : fshText} placement="top">
                                                            <IconButton>
                                                                <HelpIcon color="primary"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                        value = '0';
                                                    }
                                                    if(hormoneDetails.gender === 'Male'){
                                                        setHormoneDetails({
                                                            ...hormoneDetails,PSA: value
                                                        })
                                                    }else {
                                                        setHormoneDetails({
                                                            ...hormoneDetails,FSH: value,
                                                        })
                                                    }
                                                }}
                                            />
                                            <FormHelperText>
                                                {
                                                    hormoneDetails.gender === 'Male' ? 'Normal: 0 – 1.40 µg/L'
                                                        : <>Follicular:  3.5 – 12.5 IU/L<br/>
                                                        Mid-cycle:  4.7 – 21.5 IU/L<br/>
                                                        Luteal: 1.7 – 7.7 IU/L<br/>
                                                        Post-menopausal: 25.8 – 134.8 IU/L</>
                                                }
                                            </FormHelperText>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={3} paddingTop={1}>
                                            <Typography>Oestradiol:</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={hormoneDetails.oestradiol}
                                                type="number"
                                                InputProps={{
                                                    endAdornment:<InputAdornment position="end">
                                                        pmol/L
                                                        <Tooltip title={hormoneDetails.gender === 'Male' ? oestradiolText : oestradiolTextFemale} placement="top">
                                                            <IconButton>
                                                                <HelpIcon color="primary"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                        value = '0';
                                                    }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,oestradiol: value
                                                        })
                                                }}
                                            />
                                            <FormHelperText>
                                                {hormoneDetails.gender === 'Male' ? 'Normal: 0 – 192 pmol/L'
                                                    :
                                                    <>
                                                    Follicular: 98 – 571 pmol/L<br/>
                                                    Mid-cycle: 177 – 1153 pmol/L<br/>
                                                    Luteal: 122 – 1094 pmol/L<br/>
                                                    {`Post-menopausal: <183 pmol/L`}</>
                                                }
                                            </FormHelperText>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={3} md={4} paddingTop={1}>
                                            <Typography>Progesterone:</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={8}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={hormoneDetails.progesterone}
                                                type="number"
                                                InputProps={{
                                                    endAdornment:<InputAdornment position="end">
                                                        nmol/L
                                                        <Tooltip title={hormoneDetails.gender === 'Male' ? progesteroneText : progesteroneTextFemale} placement="top">
                                                            <IconButton>
                                                                <HelpIcon color="primary"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                        value = '0';
                                                    }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,progesterone: value
                                                        })
                                                }}
                                            />
                                            <FormHelperText>
                                                {hormoneDetails.gender === 'Male' ? 'Normal: 0.2 – 0.5 nmol/L' :
                                                <>Follicular: 0.2 – 2.8 mol/L<br/>
                                                    Periovulatory: 0.4 – 38.1 nmol/L<br/>
                                                    Luteal: 5.8 – 75.9 nmol/L<br/>
                                                    Post-menopausal: 0.2 – 0.4 nmol/L<br/>
                                                    Day 21 progesterone testing:<br/>
                                                {'> 30 nmol/L usually indicates ovulation'}<br/>
                                                {'< 5 nmol/L indicates no ovulation has occurred'}</>}
                                            </FormHelperText>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={3} md={3} paddingTop={1}>
                                            <Typography>DHEA-S:</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={9}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={hormoneDetails.DHEA}
                                                type="number"
                                                InputProps={{
                                                    endAdornment:<InputAdornment position="end">
                                                        µmol/L
                                                        <Tooltip title={dheaText} placement="top">
                                                            <IconButton>
                                                                <HelpIcon color="primary"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                        value = '0';
                                                    }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,DHEA: value
                                                        })
                                                }}
                                            />
                                            <FormHelperText>
                                                {hormoneDetails.gender === 'Male' ? 'Normal: 0.4 – 13.4 µmol/L' : 'Normal:  0.26 – 11.0 µmol/L'}
                                            </FormHelperText>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={12}>
                                        <Grid item xs={3} md={2} paddingTop={1}>
                                            <Typography>Testosterone:</Typography>
                                        </Grid>
                                        <Grid item xs={5} md={4}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    type="number"
                                                    value={hormoneDetails.testosterone.value}
                                                    InputProps={{
                                                        endAdornment:<InputAdornment position="end">
                                                            <Tooltip title={hormoneDetails.gender === 'Male' ? testosteroneText : testosteroneTextFemale} placement="top">
                                                                <IconButton>
                                                                    <HelpIcon color="primary"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    }}
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                            setHormoneDetails({
                                                                ...hormoneDetails,testosterone: {
                                                                    value: value,
                                                                    measure: hormoneDetails.testosterone.measure
                                                                }
                                                            })
                                                    }}
                                                />
                                                <FormHelperText>
                                                    {hormoneDetails.gender === 'Male' ?
                                                        <>
                                                            Total Testosterone Normal: 7.6 – 31.4 nmol/L<br/>Free Testosterone Normal: 0.4 – 7.1 pg/mL
                                                    </> :
                                                        <>
                                                            Total Testosterone Normal: 0 – 1.8 nmol/L<br/>
                                                            Free Testosterone Normal: 0.4 – 7.1 pg/mL
                                                        </>}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs="auto" md={2} sx={{ml:1}}>
                                                <TextField
                                                    select
                                                    size="small"
                                                    label="Measure"
                                                    value={hormoneDetails.testosterone.measure}
                                                    onChange={handleMeasure}
                                                    helperText="Select Measure"
                                                >
                                                    {testosteroneValues.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))
                                                    }
                                                </TextField>
                                            </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item container xs={3} md={4} paddingTop={1}>
                                            <Typography>FBC
                                                <Tooltip title={fbcText} placement="top">
                                                    <IconButton sx={{padding:0,marginBottom:0.5}}>
                                                        <HelpIcon color="primary"/>
                                                    </IconButton>
                                                </Tooltip>
                                                :</Typography>
                                        </Grid>
                                        <Grid item container xs={9} md={8} spacing={1}>
                                            <Grid item xs={3} md={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={hormoneDetails.FBC.MCV}
                                                    type="number"
                                                    label="MCV"
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,FBC: {
                                                                MCV: value,
                                                                MCH: hormoneDetails.FBC.MCH,
                                                                MCHC: hormoneDetails.FBC.MCHC,
                                                                RDW: hormoneDetails.FBC.RDW
                                                            }
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={hormoneDetails.FBC.MCH}
                                                    type="number"
                                                    label="MCH"
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,FBC: {
                                                                MCV: hormoneDetails.FBC.MCV,
                                                                MCH:value,
                                                                MCHC: hormoneDetails.FBC.MCHC,
                                                                RDW: hormoneDetails.FBC.RDW
                                                            }
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={hormoneDetails.FBC.MCHC}
                                                    type="number"
                                                    label="MCHC"
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,FBC: {
                                                                MCV: hormoneDetails.FBC.MCV,
                                                                MCH: hormoneDetails.FBC.MCH,
                                                                MCHC: value,
                                                                RDW: hormoneDetails.FBC.RDW
                                                            }
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    type="number"
                                                    label="RDW"
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,FBC: {
                                                                MCV: hormoneDetails.FBC.MCV,
                                                                MCH: hormoneDetails.FBC.MCH,
                                                                MCHC: hormoneDetails.FBC.MCHC,
                                                                RDW: value
                                                            }
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <Grid item xs={3} md={3} paddingTop={1}>
                                            <Typography>Vitamin D:</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={9}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={hormoneDetails.vitaminD}
                                                InputProps={{
                                                    endAdornment:<InputAdornment position="end">
                                                        nmol/L
                                                        <Tooltip title={vitaminDText} placement="top">
                                                            <IconButton>
                                                                <HelpIcon color="primary"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                        value = '0';
                                                    }
                                                    setHormoneDetails({
                                                        ...hormoneDetails,vitaminD: value
                                                    })
                                                }}
                                            />
                                            <FormHelperText>25-hydroxyvitamin D<br/>{`Deficient: <25 nmol/L`}<br/>Insufficient: 25 – 49 nmol/L<br/>Normal: 50 – 200 nmol/L</FormHelperText>
                                        </Grid>
                                    </Grid>
                                    {
                                        hormoneDetails.gender === 'Male' &&
                                        <Grid item container xs={12} md={6}>
                                            <Grid item xs={3} md={4} paddingTop={1}>
                                                <Typography>SHBG:</Typography>
                                            </Grid>
                                            <Grid item xs={9} md={8}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    type="number"
                                                    value={hormoneDetails.SHBG}
                                                    InputProps={{
                                                        endAdornment:<InputAdornment position="end">
                                                            nmol/L
                                                            <Tooltip title={shbgText} placement="top">
                                                                <IconButton>
                                                                    <HelpIcon color="primary"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    }}
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (parseInt(event.target.value) < 0 || event.target.value === '00') {
                                                            value = '0';
                                                        }
                                                        setHormoneDetails({
                                                            ...hormoneDetails,SHBG: value
                                                        })
                                                    }}
                                                />
                                                <FormHelperText>Normal: 16 – 55 nmol/L</FormHelperText>
                                            </Grid>
                                        </Grid>
                                    }
                                    {showAlert &&
                                        <Grid item xs={12}>
                                            <Alert severity="warning">You have not entered any values!</Alert>
                                        </Grid>
                                    }
                                </>
                                :
                                <Grid item xs={12}>
                                    <Typography sx={{opacity: 0.55}}>Please Select your gender</Typography>
                                </Grid>
                        }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="space-between">
                    <Grid xs={4} item>
                        <IconButton onClick={removeHormoneDetails} disabled={!recordData.hormoneDetails.populated} variant="contained" color="primary">
                            <DeleteIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={3} container spacing={1} justifyContent="flex-end">
                        <Grid item>
                            <Button variant="contained" onClick={handleDialogClose}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" disabled={!hormoneDetails.gender} onClick={handleDialogSubmit}>Confirm</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

export default HormoneDialog;