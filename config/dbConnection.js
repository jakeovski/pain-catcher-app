import mongoose from 'mongoose';


const Connection = async () => {

    if (mongoose.connection.readyState) {
        return mongoose.connection;
    } else {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

        if (mongoose.connection.readyState) {
            return mongoose.connection;
        } else {
            return null;
        }
    }
}

export default Connection;