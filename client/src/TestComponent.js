import { useState } from 'react';


import api from './app/store-requests/store_requests.js';



function TestComponent () { 

    const [deleteText, setDeleteText ] = useState('');

    function handleUploadMap () {
        api.createMap("TestMap")
    }

    function handleDeleteById (event) {
        event.preventDefault();
        console.log(deleteText)
        api.deleteMapById(deleteText)
    }

    function handleKB (event) {
        event.stopPropagation();
        console.log("KB")
        setDeleteText(event.target.value)
    }


    return(
        <div>
            Hi
            <button onClick={handleUploadMap}>
                Click me to upload a blank map!
            </button>

            <div>
                <input value={deleteText} onChange={handleKB}/>
                <button onClick={handleDeleteById}>
                    Submit Delete Request
                </button>
            </div>
        </div>
    );

}

export default TestComponent;