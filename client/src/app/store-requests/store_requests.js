import axios from 'axios';
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL:'https://mapperman.herokuapp.com/api', //our server we are deploying on
})

// name: { type: String, required: true },
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
export const deleteMapById = (id) => api.delete(`/map/${id}`)
export const getMapById = (id) => api.get(`/map/${id}`)
export const getUserMaps = (id) => api.get(`/userMaps/${id}`)
export const getPublicMaps = () => api.get(`/publicMaps/`)
export const getMapsDataByAccount = (user) => api.post(`/maps`, user);

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
        id, newName
    })
}

export const forkMap = (id, user) => {
    return api.post(`/fork/`, {
        map: id, 
        user: user
    })
}

const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getPublicMaps,
    getMapsDataByAccount,
    renameMap, 
    forkMap
}

export default apis