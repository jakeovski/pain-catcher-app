import React from "react";
import ImageMapper from 'react-img-mapper';
import {useTheme} from "@mui/material";
import {FRONT_AREAS,BACK_AREAS} from '../constants/BodyAreas';

export const FrontBody = () => {
    const theme = useTheme();
    const URL = `/FrontBody.png`;
    const color = `${theme.palette.secondary.main}70`;
    const MAP = {
        name:'front-map',
        areas: FRONT_AREAS(color)
    }

    return (
        <ImageMapper src={URL}
                     map={MAP}
                     parentWidth={350}
                     responsive
                     stayMultiHighlighted
                     toggleHighlighted
                     />
    )
}

export const BackBody = () => {
    const theme = useTheme();
    const URL = '/BackBody.png';
    const color = `${theme.palette.secondary.main}70`;
    const MAP = {
        name:'back-map',
        areas: BACK_AREAS(color)
    }

    return (
        <ImageMapper src={URL}
                     map={MAP}
                     parentWidth={350}
                     responsive
                     stayMultiHighlighted
                     toggleHighlighted
                     />
    )
}

