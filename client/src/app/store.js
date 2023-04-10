import { configureStore } from '@reduxjs/toolkit'
import createMapReducer from './store-actions/createMap'
import editMapListReducer from './store-actions/editMapList'

export default configureStore({

    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
            serializableCheck: false,
        }
    ),

    reducer: {
        createMap: createMapReducer,
        editMapList: editMapListReducer
    },
})
