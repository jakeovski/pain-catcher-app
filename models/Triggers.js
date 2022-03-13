import mongoose from "mongoose";


const triggers = mongoose.Schema({
    id: {
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
    triggerName: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.models.triggers || mongoose.model("triggers", triggers);