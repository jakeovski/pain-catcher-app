import React from "react";
import {signOut} from "next-auth/react";


const Home = () => {
    return(
        <div>
            <h1>Hello, You are logged in! Congratulations!</h1>
            <button onClick={signOut}>SignOut</button>
        </div>
    );
}

export default Home;