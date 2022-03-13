import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";
import {DateTime} from "luxon";

const add = async (req, res) => {
    const {diary, userId} = req.body;
    try {
        await Connection();

        await Diary.create({
            userId: userId,
            name: diary.name.trim(),
            description: diary.description.trim(),
            createdDate: DateTime.now(),
            color: diary.color,
            numberOfRecords: 0,
        })

        const data = await Diary.find({
            userId: userId
        });

        console.log('Successfully created new diary');

        return res.status(200).json({
            data: data,
            type: 'success',
            message: 'Diary created'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: undefined,
            type: 'error',
            message: 'Error Creating New Diary'
        })
    }
}

export default add;