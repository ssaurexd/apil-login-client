import { createSlice, PayloadAction } from '@reduxjs/toolkit'
/*  */
import { IChat, IMessage, ISetChat, IUser } from '../../interfaces'


const initialState: IChat = {
	activeChat: null,
	isChatOpen: false,
	messages: [],
	offlineUsers: [],
	onlineUsers: [],
	openDrawer: false
} 

const chatSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setMessages: ( state, { payload }: PayloadAction<{ msg: IMessage }> ) => {

			let newMessages = [] 

			if( state.messages.includes( payload.msg ) ) newMessages = [ ...state.messages ]
			else newMessages = [ ...state.messages, payload.msg ]

			state.messages = newMessages
		},
		setChat: ( state, { payload }: PayloadAction<ISetChat> ) => {

			state.activeChat = payload.user
			state.isChatOpen = payload.isChatOpen
			state.messages = payload.messages
		},
		setOpenDrawer: ( state, { payload }: PayloadAction<boolean> ) => {

			state.openDrawer = payload
		},
		setOnlineUsers: ( state, { payload }: PayloadAction<IUser[]> ) => {

			state.onlineUsers = payload
		},
		setOfflineUsers: ( state, { payload }: PayloadAction<IUser[]> ) => {

			state.offlineUsers = payload
		}
	}
})

export const {
	setMessages,
	setChat,
	setOpenDrawer,
	setOfflineUsers,
	setOnlineUsers
} = chatSlice.actions
export const chatReducer = chatSlice.reducer