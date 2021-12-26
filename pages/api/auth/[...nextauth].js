import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import Connection from "../../../config/dbConnection";
import User from "../../../models/User";
import {compare} from "bcrypt";

export default NextAuth({
    //Configure JWT
    session:{
        strategy:'jwt',
    },
    secret:process.env.SECRET,
    //Providers
    providers: [
        Credentials({
            async authorize(credentials) {
                //Connect to DB
                await Connection();
                //Get the user
                const user = await User.findOne({
                    email:credentials.email,
                });
                //Not found - send error response
                if (!user) {
                    throw new Error('No user found with that email!');
                }
                //Check the passwords match
                const checkPassword = await compare(credentials.password, user.password);
                //Incorrect - send error response
                if (!checkPassword) {
                    throw new Error('Incorrect Password');
                }
                //Else - success response
                return {
                    id:user._id,
                    email:user.email,
                    firstName:user.firstName,
                    lastName:user.lastName
                };
            }
        })
    ],
    callbacks:{
        jwt: async ({token, user}) => {
            user && (token.user = user);
            return token;
        },
        session:async ({session,token}) => {
            session.user = token.user;
            return session;
        }
    }
})