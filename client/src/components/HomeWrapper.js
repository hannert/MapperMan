import SplashScreen from "./SplashScreen";
import MapsScreen from "./MapListScreen/MapsScreen";
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInThunk } from "../app/store-actions/accountAuth";

import { loginUser } from "../app/store-actions/accountAuth";

function HomeWrapper() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.accountAuth.loggedIn);
    const guest = useSelector((state) => state.accountAuth.guest);

    useEffect(() => {
        dispatch(getLoggedInThunk()).unwrap().then((response) => {
            if(response.loggedIn === true){
                dispatch(loginUser(response.user));
                
            }
        }).catch((error) => {
            console.log(error);
        });
    }, [])

    if(loggedIn || guest){
        return <MapsScreen />
    }else{
        return <SplashScreen />
    }

}
export default HomeWrapper;