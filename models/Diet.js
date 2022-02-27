import mongoose from "mongoose";


const diet = mongoose.Schema({
    id:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true
    }
});

export default mongoose.models.diet || mongoose.model("diet",diet);