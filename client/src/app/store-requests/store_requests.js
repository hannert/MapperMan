import axios from 'axios';
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL:'http://localhost:4000/api', //our server we are deploying on
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

const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getPublicMaps
}

export default apis