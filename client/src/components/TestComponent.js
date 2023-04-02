import hash from 'object-hash';
import { useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";


import api from '../app/store-requests/store_requests.js';



function TestComponent () { 

    const [deleteText, setDeleteText ] = useState('');
    const [getText, setGetText ] = useState('');
    const [currentMap, setCurrentMap] = useState(null);


    function handleDeleteById (event) {
        event.preventDefault();
        console.log(deleteText)
        api.deleteMapById(deleteText)
    }

    function handleDeleteText (event) {
        event.stopPropagation();
        console.log("KB")
        setDeleteText(event.target.value)
    }

    function handleGetById (event) {
        event.preventDefault();

        async function asyncGetById(id){
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map.mapData;
                console.log(map)
                setCurrentMap(map)
            }
        }
        
        asyncGetById(getText)
    }

    function handleGetText (event) {
        event.stopPropagation();
        setGetText(event.target.value)
    }


    let leaf = ''

    if(currentMap !== null){
        leaf = (
            <MapContainer center={[51.505, -0.09]} zoom={1} doubleClickZoom={false}>
                <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                <GeoJSON 
                    key={hash(currentMap)} 
                    data={(currentMap)} 
                    />
            </MapContainer>
        )
    }


    return(
        <div>
            <div>
                <input value={deleteText} onChange={handleDeleteText}/>
                <button onClick={handleDeleteById}>
                    Submit Delete Request
                </button>
            </div>
            <div>
                <input value={getText} onChange={handleGetText}/>
                <button onClick={handleGetById}>
                    Submit Get by ID Request
                </button>
            </div>
            {leaf}
        </div>
    );

}

export default TestComponent;