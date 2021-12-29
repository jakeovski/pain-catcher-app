import React, {useState} from "react";
import {signIn} from "next-auth/react";
import {Alert, Button, Container, Grid, LinearProgress, Paper, Typography} from "@mui/material";
import Input from "../helper/Input";
import Image from "next/image";

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
    const [errorMessage, setErrorMessage] = useState({
        code: undefined,
        type:'',
        message:'',
    })

    /**
     * Resets the state of the error Message object
     */
    const resetError = () =>{
        setErrorMessage({
            code:undefined,
            type:'',
            message:''
        });
    }

    /**
     * Handles the form submit actions
     * @param e - Event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        //Reset errorMessage state if any
        resetError();
        //If the user is trying to register
        if (isRegister) {
            //Validate the input
            if (inputValidation()) {
                //Make the call to register API
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
                //Stop loading and show the appropriate message (Success/ Error)
                setShowLoading(false);
                setErrorMessage(data);
                switchRegister();
            }
        }else if (isForgot) {
            setShowLoading(true);
            const res = await fetch('/api/email', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    email:formData.email
                })
            });

            //Await response
            const data = await res.json();
            setShowLoading(false);
            setErrorMessage(data);
        }else {
            //If it is nothing of the above, means it is a sign in operation
            setShowLoading(true);
            //Call the Sign In API
            const status = await signIn('credentials',{
                redirect:false,
                email:formData.email,
                password:formData.password,
            })
            //If error received, show the appropriate message
            if (status.error) {
                setShowLoading(false);
                setErrorMessage({
                    code:401,
                    type:'error',
                    message: status.error
                });
            }
        }
    }

    /**
     * Validate the required fields
     * @returns {boolean} True - ok / False - validation failed
     */
    const inputValidation = () => {
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
        }
        if (!formData.email) {
            setErrorMessage({code:401,type:'warning',message:'Email is empty'});
            correct = false;
        }
        if (formData.password && formData.password.length < 8) {
            setErrorMessage({code: 401,type:'warning',message:'Password must be at least 8 characters'});
            correct = false;
        }

        return correct;
    }

    /**
     * Change the formData parameter when information is inputted
     * @param e - Event
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,[e.target.name]:e.target.value
        });
    }

    /**
     * Show Password Toggle Control
     */
    const handleShowPassword = () => {
        setShowPassword((prevShow) => !prevShow);
    }

    /**
     * Switch to Forgot Password mode
     */
    const switchForgot = () => {
        setIsForgot((prevForgot) => !prevForgot);
        if(errorMessage){
            resetError();
        }
    }

    /**
     * Switch to Register mode
     */
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
                <Paper elevation={3}
                       sx={{
                           display:'flex',
                           flexDirection:'column',
                           alignItems:'center',
                           padding:(theme) => theme.spacing(2)
                       }}
                >
                    <form onSubmit={handleSubmit}
                    >
                        {darkState ?
                            <Image
                            src="/darkLogo.svg"
                            height="100vh" width="360vw"
                            alt="PainCatcher Dark Logo"
                            />
                            :
                            <Image src="/lightLogo.svg"
                            height="120vh" width="200vw"
                                   alt="PainCatcher Light Logo"
                            />
                        }
                        <Typography variant="h5" padding={1}>
                            {isRegister ? "Register" : isForgot ? "Reset Password" : "Sign In"}
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
        </Container>
    )
}

export default Login;