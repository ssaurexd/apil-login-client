export interface IUser {
	_id: string;
	name: string;
	email: string;
	isLogged: boolean
}



/* --START-- Auth
-------------------------------------------------------- */
export interface IErrorsFielsResponse {
	msg: string;
	param: string;
	location: string
}
export interface ISignupErrorResponse {
	msg?: string;
	errors?: IErrorsFielsResponse[]
}
/* --END-- Auth
-------------------------------------------------------- */