import { createSlice, PayloadAction } from '@reduxjs/toolkit'
/*  */
import { IUser } from '../../interfaces'


const initialState: IUser = {
	_id: '',
	email: '',
	name: '',
	isOnline: false,
	token: '',
	role: ''
} 

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: ( state, actions: PayloadAction<IUser> ) => {
			return actions.payload
		},
		logout: state => {
			return {
				...initialState
			}
		}
	}
})

export const {
	setUser,
	logout
} = userSlice.actions
export const userReducer = userSlice.reducer