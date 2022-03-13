import Connection from "../../../config/dbConnection";
import User from "../../../models/User";
import {compare, hash} from "bcrypt";
import ResetToken from "../../../models/ResetToken";
import mongoose from "mongoose";

/**
 * Resets the password
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const reset = async (req, res) => {
    const {id, password} = req.body;
    try {
        //Find the user in the db
        await Connection();
        const user = await User.findOne({
            _id: id
        });
        //Check whether the password from the db matches the input
        const checkPassword = await compare(password, user.password);

        //If the password match, return an error as you cannot reset the password to the previous password
        if (checkPassword) {
            return res.status(402).json({
                type: 'warning',
                message: "Password cannot be the same as the old one"
            })
        }

        //If ok, update the password hash with the new one
        await User.findOneAndUpdate({
            _id: id
        }, {
            password: await hash(password, 12)
        });

        //Delete the now used reset token
        await ResetToken.findOneAndDelete({
            userId: id
        });

        //Return the response
        return res.status(200).json({
            type: 'success',
            message: 'Password was reset'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'error',
            message: 'Error while resetting password'
        })
    } finally {
        await mongoose.connection.close();
    }
}


export default reset;