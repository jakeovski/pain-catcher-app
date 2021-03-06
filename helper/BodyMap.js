import React from "react";
import ImageMapper from 'react-img-mapper';
import {useTheme} from "@mui/material";
import {BACK_AREAS, FRONT_AREAS} from '../constants/BodyAreas';

const FrontBody = ({handleSelect}) => {
    const theme = useTheme();
    const URL = `/FrontBody.png`;
    const color = `${theme.palette.secondary.main}70`;
    const MAP = {
        name: 'front-map',
        areas: FRONT_AREAS(color)
    }

    return (
        <ImageMapper src={URL}
                     map={MAP}
                     parentWidth={350}
                     responsive
                     stayMultiHighlighted
                     toggleHighlighted
                     onClick={(area, index, event) => handleSelect(area, event)}
        />
    )
}
export default React.memo(FrontBody);

export const BackBody = ({handleSelect}) => {
    const theme = useTheme();
    const URL = '/BackBody.png';
    const color = `${theme.palette.secondary.main}70`;
    const MAP = {
        name: 'back-map',
        areas: BACK_AREAS(color)
    }

    return (
        <ImageMapper src={URL}
                     map={MAP}
                     parentWidth={350}
                     responsive
                     stayMultiHighlighted
                     toggleHighlighted
                     onClick={(area, index, event) => handleSelect(area, event)}
        />
    )
}


