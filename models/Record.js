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
        type:Array,
    },
    medications:{
        type:Array,
    },
    mood:{
        type:Number,
    },
    sleep:{
        type:String,
    },
    diet:{
        type:Array,
    },
    hormoneLevels:{
        type:Object,
    },
    description:{
        type:String,
    },
    recordDate:{
        type:Date,
        required:true,
    }
});

export default mongoose.models.PainRecord || mongoose.model("PainRecord",PainRecord);