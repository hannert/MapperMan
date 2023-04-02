import { configureStore } from '@reduxjs/toolkit'
import createMapReducer from './store-actions/createMap'

export default configureStore({

    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
            serializableCheck: false,
        }
    ),

    reducer: {

        createMap: createMapReducer,
    },
})
