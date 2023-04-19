import SplashScreen from "./SplashScreen";
import MapsScreen from "./MapListScreen/MapsScreen";
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInThunk } from "../app/store-actions/accountAuth";

import { loginUser } from "../app/store-actions/accountAuth";

function HomeWrapper() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.accountAuth.loggedIn);

    useEffect(() => {
        dispatch(getLoggedInThunk()).unwrap().then((response) => {
            console.log(response.loggedIn);
            console.log(response)
            dispatch(loginUser(response.user));
        })
    }, [])

    if(loggedIn){
        return <MapsScreen />
    }else{
        return <SplashScreen />
    }

}
export default HomeWrapper;