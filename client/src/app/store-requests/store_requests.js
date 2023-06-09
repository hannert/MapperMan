import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL:process.env.REACT_APP_API_URL, //our server we are deploying on
})

const conversionAPI = axios.create({
    baseURL: 'https://ogre.adc4gis.com'
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
        sharedWith: [],
        tags: []
    })
}
export const deleteMapById = (id) => api.delete(`/map/${id}`);
export const getMapById = (id) => api.get(`/map/${id}`);
export const getUserMaps = (id) => api.get(`/userMaps/${id}`);
export const getPublicMaps = () => api.get(`/publicMaps/`);
export const getMapsDataByAccount = (user) => api.post(`/maps`, user);
export const getSharedMapsDataByAccount = (user) => api.post(`/sharedMaps`, user);



export const saveMap = (owner, mapData, id) => {
    return api.post(`/map/${id}`,
    {
        owner: owner,
        mapData: mapData,
        id: id
    })
}

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


export const addComment = (id, comment, username) => {
    return api.put(`/map/${id}/addComment`, {
        id: id,
        comment: comment,
        username: username
    })
}

export const updateTags = (id, tags) => {
    return api.put(`/map/${id}/updateTags`, {
        id: id,
        tags: tags
    })
}
export const updateMapCollaborator = (id, user, collaborators) =>{
    return api.put(`/updateCollaborator`, {
        id: id,
        user: user,
        collaborators: collaborators,
    })
}
export const isValidEmail = (email) =>{
    return api.put(`/isValidEmail/${email}`, {
        email: email

    })
}

export const convertGeoJSON = (geoJSON) =>{

    return conversionAPI.post('/convertJson',{
        json: geoJSON,
        jsonUrl: "",
        format:	"",
        outputName:	"",
        convert: "",
    }, {
        responseType: 'arraybuffer',
        withCredentials: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
}

const mapApis = {
    createMap,
    deleteMapById,
    deleteMap,
    getMapById,
    getPublicMaps,
    getMapsDataByAccount,
    getSharedMapsDataByAccount,
    renameMap, 
    forkMap,
    publishMap,
    editMapProperty,
    saveMap,
    deleteMapProperty,
    addComment,
    updateTags,
    updateMapCollaborator,
    isValidEmail,
    convertGeoJSON
}

export default mapApis