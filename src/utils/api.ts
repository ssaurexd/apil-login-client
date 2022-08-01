import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? process.env.API_HOST : 'http://localhost:4000/api'
export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	},
})