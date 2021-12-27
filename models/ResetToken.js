import mongoose from "mongoose";

/**
 * Represents the collection of tokens in mongodb
 * @type {*}
 */
const resetTokens = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    tokenHash:{
        type:String,
        required:true
    },
    expirationDate:{
        type:Date,
        required:true
    },
});

export default mongoose.models.resetTokens || mongoose.model("resetTokens",resetTokens);