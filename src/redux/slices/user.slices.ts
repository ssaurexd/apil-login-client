import { createSlice, PayloadAction } from '@reduxjs/toolkit'
/*  */
import { IUser } from '../../interfaces'


const initialState: IUser = {
	_id: '',
	email: '',
	name: '',
	isLogged: false
} 

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: ( state, actions: PayloadAction<IUser> ) => {
			return actions.payload
		}
	}
})

export const {
	setUser
} = userSlice.actions
export const userReducer = userSlice.reducer