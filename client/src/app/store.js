import { configureStore } from '@reduxjs/toolkit'
import editMapListReducer from './store-actions/editMapList'
import accountAuthReducer from './store-actions/accountAuth'

export default configureStore({

    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
            serializableCheck: false,
        }
    ),

    reducer: {
        editMapList: editMapListReducer,
        accountAuth: accountAuthReducer,
    },


})
