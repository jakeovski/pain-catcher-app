import nodemailer from 'nodemailer';
import User from '../../../models/User';
import ResetToken from "../../../models/ResetToken";
import Connection from "../../../config/dbConnection";
import crypto from 'crypto';
import {hash} from 'bcrypt';
import {DateTime} from "luxon";

/**
 * Send the link for a password reset
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const sendMail = async (req,res) => {
    //Check if the user exists
    await Connection();
    const user = await User.findOne({
        email:req.body.email
    });

    //If no user, return an error
    if (!user) {
        return res.status(404).json({
            code:404,
            type:'error',
            message:'User does not exist'
        });
    }

    //Check if the reset token already exists
    const duplicateReset = await ResetToken.findOne({
        userId:user._id
    });

    //If duplicate found, delete it
    if (duplicateReset) {
        await ResetToken.deleteOne({
            userId:user._id
        })
    }

    //Generate new token and add the data to the db table
    const token = createToken();
    await ResetToken.create({
        userId:user._id,
        tokenHash: await hash(token,12),
        expirationDate: DateTime.now().plus({minutes:15}),
    });

    //Generate the reset password link
    const generatedLink = `${process.env.NEXTAUTH_URL}passwordReset?user=${user.email}&token=${token}`;

    //Prepare the mail client
    let transporter = nodemailer.createTransport({
        service:"Mailjet",
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    let mailOptions = {
        from:'no-reply@paincatcher.app',
        to: user.email,
        subject:'Password Reset',
        html:`  <h3>Password Reset</h3>
                <p>Please use the following link to reset your password: <a href=${generatedLink}>${generatedLink}</a></p>
                <p><i>(The link will expire in 15 minutes)</i></p>`
    };

    //Send the email
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                code: 500,
                type: 'error',
                message: "Couldn't send password reset link"
            })
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //Send the response
    return res.status(200).json({
        code: 200,
        type: 'success',
        message: 'Email sent successfully'
    })
}

const createToken = () => {
    return crypto.randomBytes(12).toString('hex');
}

export default sendMail;