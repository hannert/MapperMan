import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mapApis from "../store-requests/store_requests";

const initialState = {
    loggedIn: false,
    activeMapId: null,
    activeMapName: '',
    mapList: [],
    publicRepo: false,
    mapMarkedForDeletion: null,
    mapCardClickedId: null,
    mapCardClickedName: null,
    repo: '',
    filteredList: [],
    tags: []
}

export const editMapList = createSlice({
    name: 'editMapList',
    initialState,
    reducers: {
        createNewMap: (state, action) => {
            state.activeMapId = action.payload.id;
            state.activeMapName = action.payload.name;
        },
        setActiveMap: (state, action) => {
            console.log('Setting active map to ', action.payload);
            state.activeMapId = action.payload.id;
            state.activeMapName = action.payload.name;
        },
        setMapList: (state, action) => {
            state.mapList = action.payload;
            state.filteredList = [];
        },
        renameMap: (state, action) =>{
            state.activeMapId = action.payload.id;
            state.activeMapName = action.payload.name;
        },
        deleteMap: (state, action) =>{
            state.activeMapId=null;
        },
        setPublicRepo: (state, action) =>{
            state.publicRepo = action.payload;
        },
        changeRepoType: (state, action) => {
            state.repo = action.payload;
        },
        setMapCardClicked: (state,action) =>{
            state.mapCardClickedId = action.payload.id;
            state.mapCardClickedName = action.payload.name;
        },
        setFilteredList: (state, action) => {
            console.log("Setting filtered list in store to ", action.payload)
            state.filteredList = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        clear: (state, action) => {
            state.loggedIn = false;
            state.activeMapId = null;
            state.activeMapName = '';
            state.mapList = [];
            state.publicRepo = false;
            state.mapMarkedForDeletion = null;
            state.mapCardClickedId = null;
            state.mapCardClickedName = null;
            state.repo = '';
            state.filteredList = [];
            state.tags = [];
        }
    }
})

export const { changeRepoType, setFilteredList, createNewMap, setMapList, setTags, renameMap, deleteMap, setPublicRepo,setActiveMap, setMapCardClicked, clear } = editMapList.actions
export default editMapList.reducer

export const createMapThunk = createAsyncThunk('/newmap', async (payload) => {
    console.log('payload:', payload)
    const response = await mapApis.createMap(
        payload.owner,
        payload.mapData
    );
    return response.data;
})

export const deleteMapThunk = createAsyncThunk('/map/:id', async (payload,{rejectWithValue}) => {
    try{
        console.log('Deleting map');
        console.log(payload);
        const response = await mapApis.deleteMap(payload.id, payload.user);
        return response.data;        
    } catch (err){ 
        return rejectWithValue(err.response.data.errorMessage);
    }

});

export const getMapByIdThunk = createAsyncThunk('/map/:id', async (payload, {rejectWithValue}) => {
    try {
        const response = await mapApis.getMapById(payload.id);
        return response.data;
    } catch(err) {
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const getUserMapsThunk = createAsyncThunk('/userMaps/:id', async (payload, {rejectWithValue}) => {
    try {
        const response = await mapApis.getUserMaps(payload.id);
        return response.data;
    } catch(err) {
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const getUserSharedMapsThunk = createAsyncThunk('/sharedMaps', async (payload, {rejectWithValue}) => {
    try {
        const response = await mapApis.getSharedMapsDataByAccount(payload.user);
        return response.data;
    } catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const getPublicMapsThunk = createAsyncThunk('/publicMaps/', async (_, {rejectWithValue}) => {
    try {
        const response = await mapApis.getPublicMaps();
        return response.data;
    } catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const getMapsDataByAccountThunk = createAsyncThunk('/maps', async (payload, {rejectWithValue}) => {
    try {
        const response = await mapApis.getMapsDataByAccount(payload.user);
        return response.data;
    } catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});



export const renameMapThunk = createAsyncThunk('/map/:id', async (payload, {rejectWithValue}) => {
    try{
        const response = await mapApis.renameMap(payload.id, payload.newName);
        return response.data;        
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});


export const forkMapThunk = createAsyncThunk('/fork/', async (payload, {rejectWithValue}) => {
    try {
        const response = await mapApis.forkMap(payload.id, payload.user);
        return response.data;        
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const publishMapThunk = createAsyncThunk('/map/:id/publish', async(payload, {rejectWithValue}) => {
    console.log("id sent to publish map thunk: " + payload.id)
    try{
        const response = await mapApis.publishMap(payload.id);
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const addCommentThunk = createAsyncThunk('/map/:id/addComment', async(payload, {rejectWithValue}) => {
    console.log("adding comment to map id " + payload.id)
    try{
        const response = await mapApis.addComment(payload.id, payload.comment, payload.username)
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

export const updateTagsThunk = createAsyncThunk('/map/:id/updateTags', async(payload, {rejectWithValue}) => {
    console.log("updating tags to map id " + payload.id)
    try{
        const response = await mapApis.updateTags(payload.id, payload.tags)
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});


export const convertGeoJSONThunk = createAsyncThunk('/convertJson', async(payload, {rejectWithValue}) =>{
    try{
        const response = await mapApis.convertGeoJSON(payload)
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);

    }
})

