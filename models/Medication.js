import mongoose from "mongoose";


const medication = mongoose.Schema({
    id:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    medicationName:{
        type:String,
        required:true
    }
});

export default mongoose.models.medication || mongoose.model("medication",medication);