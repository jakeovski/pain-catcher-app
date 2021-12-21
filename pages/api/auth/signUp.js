import {hash} from 'bcrypt';
import Connection from "../../../config/dbConnection";
import User from "../../../models/User";
import mongoose from "mongoose";

const register = async (req,res) =>{
    try {
        //Accept only POST
        if (req.method === 'POST') {
            //Get data
            const {firstName, lastName, email, password} = req.body;
            //Validate
            if (!email || !email.includes('@') || !firstName || !lastName || !password) {
                return res.status(422).json({code: 422, type:'error',message: 'Invalid Data'});
            }
            //Connect to database
            await Connection();

            const existingUser = await User.findOne({email});
            if (existingUser) {
                return res.status(422).json({code: 422,type:'warning', message: "User already exists"});
            }
            //Create user
            await User.create({
                firstName,
                lastName,
                email,
                password: await hash(password,12)
            });

            console.log(`Successfully created user ${email}`);
            //Send response
            res.status(201).json({code:'200',type:'success',message:`Successfully registered`});
        }
    }catch (error) {
        console.log(error);
        res.status(422).json({code:'422',type:'error',message:'An error occurred during registration'})
    }finally {
        await mongoose.connection.close();
    }
}

export default register;