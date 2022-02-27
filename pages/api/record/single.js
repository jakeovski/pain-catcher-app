import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";
import Record from "../../../models/Record";
import Diet from "../../../models/Diet";
import Medication from "../../../models/Medication";
import Symptoms from "../../../models/Symptoms";
import Triggers from "../../../models/Triggers";


const getRecord = async(req,res) => {
    if (req.method !== 'POST') {
        return req.status(401).json({
            data:undefined,
            type:'error',
            message:'Only GET method is allowed'
        });
    }
    try{
        const {userId,diaryId,recordId} = req.body;
        const session = await getSession(res);

        if (userId !== session.user.id) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Unauthorized'
            });
        }

        await Connection();

        const diary = await Diary.findOne({
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
            const diet = await Diet.find({
                userId:userId
            });
            const medication = await Medication.find({
                userId:userId
            });
            const symptoms = await Symptoms.find({
                userId:userId
            });
            const triggers = await Triggers.find({
                userId:userId
            })

        if (recordId === 'new') {
            return res.status(200).json({
                data:{
                    diaryId: diary._id,
                    record: {
                        painLevel:0,
                        areas:'',
                        triggers:'',
                        symptoms:'',
                        activityLevel:0,
                        medications:'',
                        mood:0,
                        sleep:{
                            hours:'',
                            minutes:''
                        },
                        diet:'',
                        hormoneLevel:'',
                        description:''
                    },
                    options:{
                        diet:diet,
                        medication:medication,
                        symptoms:symptoms,
                        triggers:triggers
                    }
                },
                type:'',
                message:'Success'
            });
        }else {
            const record = await Record.findOne({
                _id:recordId,
            })

            if(!record){
                return res.status(404).json({
                    data:{
                        diaryId:diary._id,
                        record:null
                    },
                    type:'error',
                    message:'Record does not exist'
                })
            }else {
                return res.status(200).json({
                    data:{
                        diaryId:diaryId,
                        record:record,
                        options:{
                            diet:diet,
                            medication:medication,
                            symptoms:symptoms,
                            triggers:triggers
                        }
                    },
                    type:'',
                    message:'Success'
                })
            }

        }
    }catch (error){
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Error while retrieving record'
        })
    }
}

export default getRecord;