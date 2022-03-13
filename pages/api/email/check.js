import Connection from "../../../config/dbConnection";
import User from "../../../models/User";
import ResetToken from "../../../models/ResetToken";
import {compare} from "bcrypt";
import {DateTime} from "luxon";

/**
 * Performs a check whether the parameters in the link are valid
 * @returns {Promise<*>}
 */
const check = async (email, token) => {

    //Check whether the user from the url exists
    await Connection();
    const user = await User.findOne({
        email: email
    });

    //If no user found return an error
    if (!user) {
        return {
            error: true,
            message: 'Invalid URL'
        };
    }

    //Check whether the reset token exists in the db
    const resetToken = await ResetToken.findOne({
        userId: user._id
    });

    //If no reset token return an error
    if (!resetToken) {
        return {
            error: true,
            message: 'Invalid URL'
        };
    }

    //Check whether the hashes match between the tokens
    const checkToken = await compare(token, resetToken.tokenHash);

    //If they do not match return an error
    if (!checkToken) {
        return {
            error: true,
            message: 'Invalid URL'
        };
    }

    //Check if the token has expired
    if (resetToken.expirationDate < DateTime.now()) {
        //Delete the token
        await ResetToken.deleteOne({
            userId: resetToken.userId
        });
        //Return an appropriate error
        return {
            error: true,
            message: 'Link Expired'
        };
    }

    //If no errors, return the response
    return {
        error: false,
        message: 'Provide new password',
        id: JSON.parse(JSON.stringify(user._id))
    };
}

export default check;