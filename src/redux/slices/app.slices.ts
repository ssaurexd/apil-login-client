import { createSlice, PayloadAction } from '@reduxjs/toolkit'
/*  */
import { IApp, IUser, Theme } from '../../interfaces'


const initialState: IApp = {
	theme: 'light'
} 

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		changeTheme: ( state, actions: PayloadAction<Theme|undefined>  ) => {
			
			if( actions?.payload ) {

				state.theme = actions.payload
				localStorage.setItem( 'theme', actions.payload )
			} 
			else if( state.theme === 'light' ){

				state.theme = 'dark'
				localStorage.setItem( 'theme', 'dark' )
			} else {

				state.theme = 'light'
				localStorage.setItem( 'theme', 'light' )
			} 
		}
	}
})

export const {
	changeTheme
} = appSlice.actions
export const appReducer = appSlice.reducer