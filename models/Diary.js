import mongoose from "mongoose";

/**
 * Represents the collection of tokens in mongodb
 * @type {*}
 */
const PainDiary = mongoose.Schema({
    id:{
      type:String
    },
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    color:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        required:true
    },
    lastRecord:{
        type:Date
    }
});

export default mongoose.models.PainDiary || mongoose.model("PainDiary",PainDiary);