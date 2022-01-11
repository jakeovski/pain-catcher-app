import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

//TODO:Comment
const CustomDialog = ({open,handleDialogClose,
                      diaryId,titleText,contentText,
                      actionName,confirmAction
                      }) => {
    return(
        <Dialog open={open}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
            <DialogTitle id="alert-dialog-title">
                {titleText}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button autoFocus onClick={() => {confirmAction(diaryId)}}>{actionName}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomDialog;