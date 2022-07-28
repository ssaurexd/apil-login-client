import { createContext, useEffect } from 'react';
import { Socket } from 'socket.io-client'
/*  */
import { useAppSelector, useSocket } from '../hooks'


export interface ISocketValues {
	socket: Socket | null;
	online: boolean
}
export const SocketContext = createContext<ISocketValues>({} as ISocketValues);
export const SocketProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const { socket, online, connectSocket, disconnectSocket } = useSocket( 'https://ssaurexd-chat-server.herokuapp.com' )
	const user = useAppSelector( state => state.user )

	/* effects */
	useEffect(() => {

        if ( user.isOnline ) connectSocket()
    }, [ user, connectSocket ])

    useEffect(() => {

        if ( !user.isOnline ) disconnectSocket()
    }, [ user, disconnectSocket ])
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}