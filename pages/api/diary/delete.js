import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";
import Record from "../../../models/Record";

const deleteDiary = async (req,res) => {

    if(req.method !== 'DELETE') {
        return req.status(401).json({
            data:undefined,
            type:'error',
            message:'Only DELETE method is allowed'
        });
    }
    try{
        const {userId, diaryId} = req.body;
        await Connection();

        await Diary.deleteOne({
            _id:diaryId
        })

        await Record.deleteMany({
            diaryId:diaryId
        });

        const data = await Diary.find({
            userId:userId
        })

        console.log(`Successfully deleted the diary of user: ${userId}`);

        return res.status(200).json({
            data:data,
            type:'success',
            message:'Diary deleted'
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Error Deleting the diary'
        })
    }

}

export default deleteDiary;