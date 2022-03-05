import mongoose from "mongoose";


const symptoms = mongoose.Schema({
    id:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    symptomName:{
        type:String,
        required:true,
        unique:true
    }
});

export default mongoose.models.symptoms || mongoose.model("symptoms",symptoms);