import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import mongoose from "mongoose";
import Diary from "../../../models/Diary";


const getDiaries = async(req,res) => {
    const session = await getSession(res);

    try{
        await Connection();

        const diaryData = await Diary.find({userId:session.user.id});
        console.log(diaryData);
        return res.status(200).json({
            data:diaryData,
            type:'',
            message:'Success'
        })

    }catch (error){
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Error while retrieving diaries'
        })
    }finally {
       await mongoose.connection.close();
    }


}

export default getDiaries;