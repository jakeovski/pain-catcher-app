import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Record from "../../../models/Record";
import Triggers from "../../../models/Triggers";
import Symptoms from "../../../models/Symptoms";
import Medication from "../../../models/Medication";
import Diet from "../../../models/Diet";


const editRecord = async (req, res) => {
    if (req.method !== 'PATCH') {
        return req.status(401).json({
            data: undefined,
            type: 'error',
            message: 'Only PATCH method is allowed'
        });
    }

    try {
        const {userId, diaryId, record, bodyAreas, frontImage, backImage} = req.body;
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
            _id: record._id,
            diaryId: diaryId
        }, {
            painLevel: record.painLevel,
            title: record.title,
            areas: bodyAreas,
            triggers: record.triggers.map(trigger => {return trigger.toUpperCase().trim()}),
            activityLevel: record.activityLevel,
            medications: record.medications.map(medication => {return medication.toUpperCase().trim()}),
            symptoms: record.symptoms.map(symptom => {return symptom.toUpperCase().trim()}),
            sleep: record.sleep,
            diet: record.diet.map(product => {return product.toUpperCase().trim()}),
            mood: record.mood,
            hormoneDetails: record.hormoneDetails,
            description: record.description,
            frontBodyImage: frontImage ? frontImage : record.frontBodyImage,
            backBodyImage: backImage ? backImage : record.backBodyImage
        });

        console.log("Successfully updated the record");
        console.log("Saving the option preferences...");

        if (record.triggers.length > 0) {
            let triggersObject = [];
            for (const trigger of record.triggers) {
                triggersObject.push({
                    userId: userId,
                    triggerName: trigger.toUpperCase().trim()
                })
            }
            await Triggers.insertMany(triggersObject, {ordered: false}).catch((err) => console.log(`Failed to insert new triggers: ${err}`))
            console.log('Successfully added new triggers');
        }
        if (record.symptoms.length > 0) {
            let symptomsObject = [];
            for (const symptom of record.symptoms) {
                symptomsObject.push({
                    userId: userId,
                    symptomName: symptom.toUpperCase().trim()
                });
            }
            await Symptoms.insertMany(symptomsObject, {ordered: false}).catch((err) => console.log(`Failed to insert new symptoms: ${err}`));
            console.log("Successfully added new symptoms");
        }
        if (record.medications.length > 0) {
            let medicationObject = [];
            for (const medication of record.medications) {
                medicationObject.push({
                    userId: userId,
                    medicationName: medication.toUpperCase().trim()
                });
            }
            await Medication.insertMany(medicationObject, {ordered: false}).catch((err) => console.log(`Failed to insert new medication: ${err}`));
            console.log("Successfully added new medications");
        }
        if (record.diet.length > 0) {
            let dietObject = [];
            for (const product of record.diet) {
                dietObject.push({
                    userId: userId,
                    productName: product.toUpperCase().trim()
                });
            }
            await Diet.insertMany(dietObject, {ordered: false}).catch((err) => console.log(`Failed to insert new product: ${err}`));
            console.log("Successfully added new products");
        }

        console.log('The operation was successful');

        return res.status(200).json({
            data: undefined,
            type: '',
            message: 'Success'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: undefined,
            type: 'error',
            message: 'Internal Server Error'
        })
    }
}

export default editRecord;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        },
    },
}