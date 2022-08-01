import axios from 'axios'
/*  */
import { apiHost } from '../config'


const baseURL = process.env.NODE_ENV === 'production' ? `${ apiHost }api` : 'http://localhost:4000/api'
export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	},
})