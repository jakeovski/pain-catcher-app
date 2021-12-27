import React, {useEffect} from "react";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";


const Home = () => {
    const {data:session} = useSession();
    const router = useRouter();
    useEffect(() => {
        if (!session){
            router.push('/');
        }
    },[router, session]);

    return(
        <div>
            <h1>Hello, You are logged in! Congratulations!</h1>
            <button onClick={signOut}>SignOut</button>
        </div>
    );
}

export default Home;