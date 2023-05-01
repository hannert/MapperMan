import { configureStore } from '@reduxjs/toolkit'
import editMapListReducer from './store-actions/editMapList'
import accountAuthReducer from './store-actions/accountAuth'
import leafletEditingReducer from './store-actions/leafletEditing'
import transactionsReducer from './store-actions/transactions'

export default configureStore({

    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
            serializableCheck: false,
        }
    ),

    reducer: {
        editMapList: editMapListReducer,
        accountAuth: accountAuthReducer,
        leafletEditing: leafletEditingReducer,
        transactions: transactionsReducer
    },


})
