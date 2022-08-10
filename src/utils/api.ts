import axios from 'axios'
/*  */
import { apiHost } from '../config'


const baseURL = `${ apiHost }api`
export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	},
})