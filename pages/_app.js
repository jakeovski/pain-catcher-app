import React, {useState} from "react";
import Palette from "../styles/GlobalPalette";
import {createTheme, CssBaseline, ThemeProvider, useTheme} from "@mui/material";
import {grey} from "@mui/material/colors";

const ColorModeContext = React.createContext({toggleColorMode: () => {}});

function MyApp({Component, pageProps}) {

    const [darkState, setDarkState] = useState(false);
    const paletteType = darkState ? "dark" : "light";
    const primaryColor = darkState ? Palette.primaryColor.dark : Palette.primaryColor.light;
    const secondaryColor = darkState ? Palette.secondaryColor.dark : Palette.secondaryColor.light;


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
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Component {...pageProps} darkState={darkState}/>
        </ThemeProvider>
    );
}

export default MyApp;
