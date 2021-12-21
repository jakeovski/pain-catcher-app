import React, {useState} from "react";
import {Alert, Button, CircularProgress, Container, Grid, LinearProgress, Paper, Typography} from "@mui/material";
import Input from "../helper/Input";

/**
 * Component which represents the login screen
 * Is shown on the index page
 * If the user is authenticated => redirect
 * otherwise authenticate
 * @returns {JSX.Element}
 * @constructor
 */
const Login = ({darkState}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [isRegister, setIsRegister] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        code: undefined,
        type:'',
        message:'',
    })

    const resetError = () =>{
        setErrorMessage({
            code:undefined,
            type:'',
            message:''
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            if (registerValidation()) {
                setShowLoading(true);
                const res = await fetch('/api/auth/signUp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        password: formData.password,
                    })
                });

                //Await data
                const data = await res.json();
                setShowLoading(false);
                setErrorMessage(data);
            } else {
                return;
            }
        }
    }

    const registerValidation = () => {
        let correct = true;

        if(isRegister) {
            if(formData.password !== formData.confirmPassword){
                setErrorMessage({code:401,type:'warning',message:'The passwords do not match'});
                correct = false;
            }
            if(!formData.firstName){
                setErrorMessage({code:401,type:'warning',message:'Firstname is empty'});
                correct = false;
            }
            if(!formData.lastName) {
                setErrorMessage({code:401,type:'warning',message:'Lastname is empty'});
                correct = false;
            }
            if (!formData.email) {
                setErrorMessage({code:401,type:'warning',message:'Email is empty'});
                correct = false;
            }
        }

        if (formData.password && formData.password.length < 8) {
            setErrorMessage({code: 401,type:'warning',message:'Password must be at least 8 characters'});
            correct = false;
        }

        return correct;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,[e.target.name]:e.target.value
        });
    }

    const handleShowPassword = () => {
        setShowPassword((prevShow) => !prevShow);
    }

    const switchForgot = () => {
        setIsForgot((prevForgot) => !isForgot);
        if(errorMessage){
            resetError();
        }
    }

    const switchRegister = () => {
        setIsRegister((prevRegister) => !prevRegister);
        if(errorMessage){
            resetError();
        }
    }
    return (
        <Container component="main" maxWidth="xs"
        sx={{
            height:'90vh',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            textAlign:'center'
        }}
        >
            {loading ?
                <CircularProgress/>
                :
                <Paper elevation={3}
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    padding:(theme) => theme.spacing(2)
                }}
                >
                    <form onSubmit={handleSubmit}
                    sx={{
                        width:'100%',
                        marginTop:(theme) => theme.spacing(3)
                    }}
                    >
                        {darkState ?
                            <img
                                src="/darkLogo.svg"
                                height={150}
                                alt="PainCatcher Dark Logo"
                            />
                            :
                            <img
                                src="/lightLogo.svg"
                                height={150}
                                alt="PainCatcher Light Logo"
                            />
                        }
                        <Typography variant="h5" padding={2}>
                            {isRegister ? "Register" : "Sign In"}
                        </Typography>
                        {errorMessage.code &&
                            <Alert
                                sx={{marginBottom:'2vh'}}
                                severity={errorMessage.type}
                            >
                                {errorMessage.message}
                            </Alert>
                        }
                        <Grid container spacing={2}>
                            {isRegister &&
                                <>
                                    <Input
                                        name="firstName"
                                        label="First Name"
                                        handleChange={handleChange}
                                        autoFocus
                                        value={formData.firstName}
                                        half
                                    />
                                    <Input
                                        name="lastName"
                                        label="Last Name"
                                        handleChange={handleChange}
                                        value={formData.lastName}
                                        half
                                    />
                                </>
                            }
                            <Input
                                name="email"
                                label="Email"
                                value={formData.email}
                                handleChange={handleChange}
                                type="email"
                            />
                            {!isForgot &&
                                <Input
                                    name="password"
                                    label="Password"
                                    value={formData.password}
                                    handleChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    handleShowPassword={handleShowPassword}
                                />
                            }
                            {isRegister ?
                                <Input
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    handleChange={handleChange}
                                    type="password"
                                    value={formData.confirmPassword}
                                    handleShowPassword={handleShowPassword}
                                />
                                :
                                <Grid item sx={{
                                    paddingTop:'0px !important',
                                }}>
                                    <Button onClick={switchForgot} sx={{paddingLeft:0}}>
                                        {isForgot
                                            ? "Remembered your password? Sign In!"
                                            : "Forgot your password?"
                                        }
                                    </Button>
                                </Grid>
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                margin:(theme) => theme.spacing(2,0,2)
                            }}
                        >
                            {isRegister ? "Register" : isForgot ? "Send Link" : "Sign In"}
                        </Button>
                        {showLoading && <LinearProgress/>}
                        {!isForgot &&
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Button onClick={switchRegister} sx={{paddingRight:0}}>
                                        {isRegister
                                            ? "Already have an account? Sign In!"
                                            : "Don't have an account? Register!"}
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </form>
                </Paper>
            }
        </Container>
    )
}

export default Login;