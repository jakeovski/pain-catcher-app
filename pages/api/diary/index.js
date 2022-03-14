import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";


const getDiaries = async (req, res) => {
    const session = await getSession({req});

    try {
        await Connection();

        const diaryData = await Diary.find({userId: session.user.id});
        return res.status(200).json({
            data: diaryData,
            type: '',
            message: 'Success'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: undefined,
            type: 'error',
            message: 'Error while retrieving diaries'
        })
    }
}

export default getDiaries;