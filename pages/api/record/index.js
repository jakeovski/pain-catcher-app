import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";
import Record from "../../../models/Record";


const getRecords = async(req,res) => {
    if (req.method !== 'POST') {
        return req.status(401).json({
           data:undefined,
            type:'error',
            message:'Only GET method is allowed'
        });
    }

    try{
        const {diaryId,userId} = req.body;
        const session = await getSession(res);

        if (userId !== session.user.id) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Unauthorized'
            });
        }

        await Connection();

        const diary = await Diary.find({
            userId:userId,
            _id:diaryId
        });

        if (diary.length === 0) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Diary does not exist'
            });
        }

        const records = await Record.find({
            diaryId:diaryId
        });

        return res.status(200).json({
            data:{
                diary:diary,
                records:records
            },
            type:'',
            message:'Success'
        });

    }catch (error){
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Only GET method is allowed'
        })
    }
}

export default getRecords;