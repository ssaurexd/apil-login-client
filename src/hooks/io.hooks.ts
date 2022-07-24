import { useEffect, useCallback, useState } from 'react'
import io, { Socket } from 'socket.io-client'


export const useSocket = ( serverPath: string ) => {
    
    const [ online, setOnline ] = useState( false )
    const [ socket, setSocket ] = useState<Socket|null>( null )

    const connectSocket = useCallback( () => {

        const token = localStorage.getItem( 'token' )
        const socketTemp = io( serverPath, { 
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token
            }
        })
        setSocket( socketTemp )
    },[ serverPath ])

    const disconnectSocket = useCallback( () => {

        socket?.disconnect()
    },[ socket ])


    useEffect(() => {

        setOnline( socket?.connected || false )
    }, [ socket ])

    useEffect(() => {
        socket?.on('connect', () => setOnline( true ))
    }, [ socket ])

    useEffect(() => {
        socket?.on('disconnect', () => setOnline( false ))
    }, [ socket ])

    return {
        socket,
        online,
        connectSocket,
        disconnectSocket
    }
}