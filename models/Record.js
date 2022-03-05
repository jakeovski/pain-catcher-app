import mongoose from "mongoose";

/**
 * Represents a collection of pain records in mongodb
 * @type {*}
 */
const PainRecord = mongoose.Schema({
    id:{
        type:String
    },
    diaryId:{
        type:String,
        required:true,
    },
    painLevel:{
        type:Number,
        required:true,
    },
    areas:{
        type:Array,
    },
    triggers:{
        type:Array,
    },
    activityLevel:{
        type:Number,
    },
    medications:{
        type:Array,
    },
    symptoms: {
        type:Array,
    },
    mood:{
        type:Number,
    },
    sleep:{
        type:Object,
    },
    diet:{
        type:Array,
    },
    hormoneDetails:{
        type:Object,
    },
    description:{
        type:String,
    },
    frontBodyImage: {
        type:String,
    },
    backBodyImage: {
        type:String,
    },
    recordStartDate:{
        type:Date,
        required:true,
    },
    recordEndDate: {
        type:Date,
        required:true
    }
});

export default mongoose.models.PainRecord || mongoose.model("PainRecord",PainRecord);