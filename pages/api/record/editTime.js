import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Record from "../../../models/Record";


const editTime = async (req, res) => {
    if (req.method !== 'PATCH') {
        return req.status(401).json({
            data: undefined,
            type: 'error',
            message: 'Only PATCH method is allowed'
        });
    }

    try {
        const {userId, recordId, diaryId, newStartDate, newEndDate, newAllDay} = req.body;
        const session = await getSession({req});

        if (userId !== session.user.id) {
            return res.status(401).json({
                data: undefined,
                type: 'error',
                message: 'Unauthorized'
            });
        }

        await Connection();

        await Record.updateOne({
            _id: recordId,
            diaryId: diaryId,

        }, {
            recordStartDate: newStartDate,
            recordEndDate: newEndDate,
            allDay: newAllDay
        });

        const newRecords = await Record.find({
            diaryId: diaryId
        });

        console.log("Successfully updated the record");

        return res.status(201).json({
            data: {
                records: newRecords
            },
            type: '',
            message: 'Success'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: undefined,
            type: 'error',
            message: 'Internal Server Error'
        })
    }
}

export default editTime;