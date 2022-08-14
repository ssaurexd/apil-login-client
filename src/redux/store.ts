import { configureStore } from '@reduxjs/toolkit'
/*  */
import { appReducer, userReducer, chatReducer } from './slices'


export const store = configureStore({
	reducer: {
		app: appReducer,
		user: userReducer,
		chat: chatReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
