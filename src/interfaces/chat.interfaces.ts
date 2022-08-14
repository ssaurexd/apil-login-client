import { IMessage } from './message.interfaces';
import { IUser } from './user.interfaces';


export interface IChat {
	offlineUsers: IUser[];
	onlineUsers: IUser[];
	isChatOpen: boolean;
	activeChat: IUser | null;
	messages: IMessage[];
	openDrawer: boolean;
}

export interface ISetChat {
	messages: IMessage[];
	user: IUser;
	isChatOpen: boolean;
}