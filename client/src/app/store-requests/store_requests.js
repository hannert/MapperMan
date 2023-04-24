import axios from 'axios';
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL:process.env.REACT_APP_API_URL, //our server we are deploying on
})

//         name: { type: String, required: true },
//         owner: { type: ObjectId, ref: 'Account', required: true },
//         mapData: { type: Object, required: true },
//         published: {type: Boolean, required: true},
//         comments: {type: [ObjectId], ref: 'Comment', required: true },
//         tags: {type: Map, of: String, required: true},
export const createMap = (owner, mapData) => {
    return api.post('/newmap', 
    {
        name: 'Untitled',
        owner: owner,
        mapData: mapData,
        published: false,
        comments: [],
        tags: []
    })
}
export const deleteMapById = (id) => api.delete(`/map/${id}`);
export const getMapById = (id) => api.get(`/map/${id}`);
export const getUserMaps = (id) => api.get(`/userMaps/${id}`);
export const getPublicMaps = () => api.get(`/publicMaps/`);
export const getMapsDataByAccount = (user) => api.post(`/maps`, user);



export const deleteMap = (id, user) => {
    console.log('Deleting map with ');
    console.log(id);
    console.log(user);
    return api.post('/map', 
    {
        user: user,
        mapId: id
    });
}

export const addVertex = (mapEdit) => {
    return api.post('/map/', {
        map: mapEdit
    })
}
export const deleteVertex = (mapEdit) => {
    return api.post('/map/', {
        map: mapEdit
    })
}
export const addFeature = (mapEdit) => {
    return api.post('/map/', {
        map: mapEdit
    })
}
export const deleteFeature = (mapEdit) => {
    return api.post('/map/', {
        map: mapEdit
    })
}

export const renameMap = (id, newName) =>{
    return api.put(`/map/${id}`, {
        id: id, newName: newName
    })
}

export const forkMap = (id, user) => {
    return api.post(`/fork/`, {
        map: id, 
        user: user
    })
}

export const publishMap = (id) => {
    return api.put(`/map/${id}/publish`,{
        id: id
    })
}

/**
 * Edits the properties of a given feature, inserting it if it is new
 * @param {*} id 
 * @param {*} index 
 * @param {*} property 
 * @param {*} value 
 * @param {*} newProperty Object that contains a boolean isNew and string Type fields, not currently used but
 * can be used when  indicating a number type, but I think they can all be stored as strings
 * @returns 
 */
export const editMapProperty = (id, index, property, value, newProperty) =>{
    return api.put(`/map/${id}/editProperty`,{
        id: id,
        index: index,
        property: property,
        value: value,
        newProperty: newProperty
    })
}

export const deleteMapProperty = (id, index, property) =>{
    return api.put(`/map/${id}/deleteProperty`, {
        id: id,
        index: index,
        property: property
    })
}



const mapApis = {
    createMap,
    deleteMapById,
    deleteMap,
    getMapById,
    getPublicMaps,
    getMapsDataByAccount,
    renameMap, 
    forkMap,
    publishMap,
    editMapProperty,
    deleteMapProperty
}

export default mapApis