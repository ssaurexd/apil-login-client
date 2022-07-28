import axios from 'axios'


export const api = axios.create({
	baseURL: 'https://ssaurexd-chat-server.herokuapp.com/api',
	headers: {
		'Content-Type': 'application/json'
	},
})