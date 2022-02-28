import React, {useState} from "react";
import Palette from "../styles/GlobalPalette";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SessionProvider} from "next-auth/react";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import Head from 'next/head';

//TODO: Comment every class
//TODO: Separate chunks of code into separate blocks
//TODO: Clean up
//TODO: Make responsive for 4K
function MyApp({Component, pageProps:{session,...pageProps}}) {

    const [darkState, setDarkState] = useState(false);
    const paletteType = darkState ? "dark" : "light";
    // const [selectedDates,setSelectedDates] = useState({
    //     startDate:null,
    //     endDate:null,
    //     startStr:null,
    //     endStr:null
    // });


    const theme = createTheme({
        palette: {
            mode: paletteType,
            primary: {
                main: darkState ? Palette.primaryColor.dark.main : Palette.primaryColor.light.main,
                dark: darkState ? Palette.primaryColor.dark.dark : Palette.primaryColor.light.dark,
                light: darkState ? Palette.primaryColor.dark.light : Palette.primaryColor.light.light
            },
            secondary: {
                main: darkState ? Palette.secondaryColor.dark.main : Palette.secondaryColor.light.main,
                dark: darkState ? Palette.secondaryColor.dark.dark : Palette.secondaryColor.light.dark,
                light: darkState ? Palette.secondaryColor.dark.light : Palette.secondaryColor.light.light
            },
        },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            backgroundImage: `url(${
                                darkState ? "/darkBackground.svg" : "/lightBackground.svg"
                            })`
                        }
                    }
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        input: {
                            "&:-webkit-autofill": {
                                "WebkitBoxShadow": `${darkState && "0 0 0 100px #292929"} inset`,
                                "WebkitTextFillColor": `${darkState && "#fff"}`
                            }
                        }
                    }
                }
            },
    });

    return (
        <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
            <Head>
                <title>Pain Catcher</title>
            </Head>
            <CssBaseline/>
            <Component {...pageProps}
                       darkState={darkState}/>
        </ThemeProvider>
        </SessionProvider>
    );
}

export default MyApp;
