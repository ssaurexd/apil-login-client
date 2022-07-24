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

    const { socket, online, connectSocket, disconnectSocket } = useSocket( 'http://localhost:4000' )
	const isLogged = useAppSelector( state => state.user.isLogged )

	/* effects */
	useEffect(() => {

        if ( isLogged ) connectSocket()
    }, [ isLogged ])

    useEffect(() => {

        if ( !isLogged ) disconnectSocket()
    }, [ isLogged ])
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}