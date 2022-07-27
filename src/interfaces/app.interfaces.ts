import { IUser } from "./user.interfaces";

export interface IApp {
	theme: Theme;
}

export type Theme = 'dark' | 'light'