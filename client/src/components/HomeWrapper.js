import SplashScreen from "./SplashScreen";
import MapsScreen from "./MapListScreen/MapsScreen";
import AuthContext from "../api";
import {useContext} from 'react'

function HomeWrapper() {
    const { auth } = useContext(AuthContext);

    if (auth.loggedIn){
        //RETURN HOME SCREEN
        console.log("logged in when checking in homewrapper")
        return <MapsScreen />
    }
    else{
        return <SplashScreen />
    }
}
export default HomeWrapper;