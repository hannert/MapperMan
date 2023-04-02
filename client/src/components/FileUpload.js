import React, { useState } from "react";
import api from '../app/store-requests/store_requests.js';

export function FileUpload(props) {
    const [data, setData] = useState(null);
    
    function handleUpload(e) {
        e.preventDefault();
        console.log("upload")
        setData(e.target.files[0])
        var reader = new FileReader();
        reader.onload = function() {
            var fileContent = JSON.parse(reader.result)
            setData(fileContent)
        }
        reader.readAsText(e.target.files[0])

    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(data)
        if(data===null)
            console.log("Nothing to submit.")
        if(data!==null){
            api.createMap('Anonymous', data)
            console.log("Data submitted")
        }
            
    }

    return(
        <div>  
            <form>
                <input type='file' onChange={handleUpload}/>
            </form>
            

            <form onSubmit={handleSubmit}>
                <input type='submit' value='upload to server'/>
            </form>
        </div>
    )

}