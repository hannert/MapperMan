import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: "http://localhost:4000/api", //our server we are deploying on
})


export const createMap = (mapname) => {
    return api.post('/newmap/', 
    {
        name: mapname,
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
}

export default apis