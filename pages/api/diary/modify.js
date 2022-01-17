import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";


const modify = async(req,res) => {
    if(req.method !== 'PATCH') {
        return req.status(401).json({
            data:undefined,
            type:'error',
            message:'Only UPDATE method is allowed'
        });
    }
    try {
        const {userId,diaryId,diary} = req.body;
        const session = await getSession(res);

        if (userId !== session.user.id) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Unauthorized'
            })
        }

        await Connection();

        const status = await Diary.updateOne({
            _id:diaryId
        },{
            name: diary.name,
            description: diary.description,
            color: diary.color
        });

        if (status.modifiedCount > 0) {
            console.log(`Diary ${diaryId} updated`);
        }else {
            console.log(`WARNING : Diary ${diaryId} not updated`);
        }

        const data = await Diary.find({
            userId:userId
        });

        return res.status(200).json({
            data:data,
            type:'success',
            message:'Diary updated'
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Error Updating the diary'
        });
    }
}

export default modify;