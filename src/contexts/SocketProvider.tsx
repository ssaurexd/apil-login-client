import { createContext, useEffect } from 'react';
import { Socket } from 'socket.io-client'
/*  */
import { useAppSelector, useSocket } from '../hooks'
import { apiHost } from '../config'


export interface ISocketValues {
	socket: Socket | null;
	online: boolean
}
export const SocketContext = createContext<ISocketValues>({} as ISocketValues);
export const SocketProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const { socket, online, connectSocket, disconnectSocket } = useSocket( apiHost )
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