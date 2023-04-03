import hash from 'object-hash';
import { useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";


import api from '../app/store-requests/store_requests.js';



function TestComponent () { 

    const [deleteText, setDeleteText ] = useState('');
    const [getText, setGetText ] = useState('');
    const [currentMap, setCurrentMap] = useState(null);
    const [mapIDList, setMapIDList] = useState(null)

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

    function handleGetPublicMaps (event) {
        event.preventDefault();

        async function asyncGetPublicMaps(){
            let response = await api.getPublicMaps();
            if(response.data.success === true) {
                console.log(response.data.maps)
                setMapIDList(response.data.maps)
            }
        }

        asyncGetPublicMaps();
        
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

    let mapList = ''

    if(mapIDList !== null){
        mapList = <div>
            Maps Currently in the Database:
            {mapIDList.map((item) => (
                <div key={hash(item)}>{item._id}</div>
            ))}
        </div>
    }


    return(
        <div>
            <div>
                <input value={deleteText} onChange={handleDeleteText} id = "get-delete-id"/>
                <button onClick={handleDeleteById} id='delete-by-id-button'>
                    Submit Delete Request
                </button>
            </div>
            <div>
                <input value={getText} onChange={handleGetText} id="get-map-id"/>
                <button onClick={handleGetById} id='get-by-id-button'>
                    Submit Get by ID Request
                </button>
            </div>
            {leaf}
            <div>
                <button onClick={handleGetPublicMaps} id='get-public-maps-button'>
                    Get All Maps in Database
                </button>
                {mapList}
            </div>
        </div>
    );

}
// Hip hip hooray Yippee! Testing auto deploy
export default TestComponent;