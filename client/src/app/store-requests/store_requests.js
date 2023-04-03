import axios from 'axios';
axios.defaults.withCredentials = false;
const api = axios.create({
    baseURL: "https://mapperman.herokuapp.com/api", //our server we are deploying on
})


export const createMap = (mapname, mapData) => {
    return api.post('/newmap/', 
    {
        name: mapname,
        mapData: mapData,
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