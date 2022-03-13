import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Record from "../../../models/Record";
import Diary from "../../../models/Diary";


const deleteRecord = async (req, res) => {
    if (req.method !== 'DELETE') {
        return req.status(401).json({
            data: undefined,
            type: 'error',
            message: 'Only DELETE method is allowed'
        });
    }

    try {
        const {recordId, userId, diaryId} = req.body;
        const session = await getSession(res);

        if (userId !== session.user.id) {
            return res.status(401).json({
                data: undefined,
                type: 'error',
                message: 'Unauthorized'
            });
        }

        await Connection();

        await Record.deleteOne({
            _id: recordId
        });

        const records = await Record.find({
            diaryId: diaryId
        }).select('-backBodyImage -frontBodyImage');

        await Diary.updateOne({
            _id: diaryId
        }, {
            $inc: {numberOfRecords: -1}
        })

        console.log(records);
        return res.status(200).json({
            data: {
                records: records
            },
            type: '',
            message: 'Success'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            data: undefined,
            type: 'error',
            message: 'Internal Server Error'
        })
    }
}

export default deleteRecord;