import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {Alert, Button, CircularProgress, Container, Grid, LinearProgress, Paper, Typography} from "@mui/material";
import Input from "../../helper/Input";

/**
 * Password Reset Page
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordReset = () => {
    const router = useRouter();
    const {user,token} = router.query;
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        type: '',
        message: ''
    });
    const [data,setData] = useState({
        error:'',
        message:''
    });

    const [pageLoading,setPageLoading] = useState(false);

    /**
     * Show Password Toggle Control
     */
    const handleShowPassword = () => {
        setShowPassword((prevShow) => !prevShow);
    }

    /**
     * Change the formData parameter when information is inputted
     * @param e - Event
     */
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }

    /**
     * Handle the submit button action
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        //Make the call to reset API
        if (validate()) {
            setLoading(true);
            const res = await fetch('/api/email/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data.id,
                    password: formData.password
                })
            });

            //Await data
            const message = await res.json();
            //Stop loading and show the appropriate message (Success/ Error)
            setLoading(false);
            setMessage(message);

            if (message.type === 'success') {
                //Redirect to log in screen
                // await router.push('/');
                setMessage(message);
                setTimeout(() => closeWindow(),1000);
            }
        }
    }

    const closeWindow = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }

    /**
     * Validate the password inputs
     * @returns {boolean}
     */
    const validate = () => {
        let correct = true;
        if (formData.password !== formData.confirmPassword) {
            setMessage({
                type: 'error',
                message: 'Passwords are not equal'
            })
            correct = false;
        }
        if (formData.password && formData.password.length < 8) {
            setMessage({
                type: 'error',
                message: 'Password must be at least 8 characters'
            })
            correct = false;
        }
        return correct;
    }

    useEffect(() => {
        setPageLoading(true);
        if (user && token) {
            fetch('api/email/check',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email:user,
                    token:token
                })
            }).then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setPageLoading(false);
                })
        }
    },[user,token]);

    if(!data) return <Grid container spacing={2} sx={{marginTop: '2vh'}}>
        <CircularProgress sx={{marginTop: '40vh !important', marginLeft: '50vw !important'}}/>
    </Grid>

    return (
        <Container component="main" maxWidth="xs"
                   sx={{
                       height: '90vh',
                       display: 'flex',
                       flexDirection: 'column',
                       justifyContent: 'center',
                       textAlign: 'center'
                   }}>
            <Paper elevation={3}
                   sx={{
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       padding: (theme) => theme.spacing(2)
                   }}>
                {data.error ?
                    <Typography variant="h6">{data.message}</Typography>
                    :
                    <form onSubmit={handleSubmit}>
                        {message.type &&
                            <Alert severity={message.type}>{message.message}</Alert>
                        }
                        <Typography variant="h5" sx={{marginBottom: '2vh'}}>
                            Enter new Password
                        </Typography>
                        <Grid container spacing={2}>
                            <Input
                                name="password"
                                label="Password"
                                value={formData.password}
                                handleChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                handleShowPassword={handleShowPassword}
                            />
                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                handleChange={handleChange}
                                type="password"
                                handleShowPassword={handleShowPassword}
                            />
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                margin: (theme) => theme.spacing(2, 0, 2)
                            }}
                        >Reset Password</Button>
                        {loading && <LinearProgress/>}
                    </form>
                }
            </Paper>
        </Container>
    )
}

export default PasswordReset;