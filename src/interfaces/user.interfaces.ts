export interface IUser {
	_id: string;
	name: string;
	email: string;
	isOnline: boolean;
	token: string;
	role: IRoles
}

export type IRoles = 'user' | 'admin' | ''


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