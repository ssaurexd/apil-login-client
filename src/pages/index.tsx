import { useState, useEffect, useContext, FormEvent } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import {
	IconButton,
	Box,
	Typography,
	useTheme,
	useMediaQuery
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import { Menu as MenuIcon } from '@mui/icons-material'
import { getSession } from 'next-auth/react'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { scrollFunctions } from '../utils'
import { SocketContext } from '../contexts'
import { IMessage } from '../interfaces'
import { setOpenDrawer, setMessages } from '../redux/slices'
/*  */
import { ThemeLayout } from '../layouts'
import { FormSendMessage, Message, Sidebar } from '../components'


const Home: NextPage = () => {

	const loggedUser = useAppSelector( state => state.user )
	const { activeChat, isChatOpen, messages, openDrawer } = useAppSelector( state => state.chat )
	const dispatch = useAppDispatch()
	const muitheme = useTheme()
 	const isSmOrLess = useMediaQuery( muitheme.breakpoints.down('sm') )
	const { socket } = useContext( SocketContext )

	/* functions */
	const toggleDrawer = (  ) => dispatch( setOpenDrawer( !openDrawer ) )

	useEffect( () => {

		socket?.on( 'send-personal-msg', ( msg: IMessage ) => {

			if( 
				( msg.from === loggedUser._id && msg.to === activeChat?._id ) ||
				( msg.from === activeChat?._id && msg.to === loggedUser._id )
			) {
				
				dispatch( setMessages({ msg }) )
			}
		})
	}, [ socket, activeChat?._id, loggedUser, dispatch ])

	useEffect( () => scrollFunctions.scrollToBottomAnimated( 'messages-box' ), [ messages ])

	return (
		<ThemeLayout>
			<Sidebar />
			<Box
				sx={{ 
					p: `0 10px 0 ${ isSmOrLess ? 10 : 350 }px`, 
					height: 'calc( 100vh - 5px )', 
					maxHeight: 'calc( 100vh - 5px )',
					position: 'relative',
					m: '0 auto'
				}}
				display='flex'
				justifyContent='flex-end'
				flexDirection='column'
			>
				<IconButton
					sx={{
						display: isSmOrLess && !openDrawer ? 'inline' : 'none',
						position: 'fixed',
						top: '15px',
						left: '10px'
					}}
					onClick={ toggleDrawer }
				>
					<MenuIcon />
				</IconButton>
				{
					isChatOpen ? (
						<Box
							sx={{ 
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								width: '100%'
							}}
						>
							<Box
								id='messages-box'
								sx={{
									flexGrow: 1,
									padding: '10px',
									overflow: 'hidden',
									overflowY: 'scroll',
									'&::-webkit-scrollbar': {
										width: '.4rem'
									},
									'&::-webkit-scrollbar-thumb': {
										backgroundColor: '#8f9a9c',
										borderRadius: theme => theme.shape.borderRadius
									}
								}}
							>
								{ messages.map( msg => <Message key={ msg._id } msg={ msg } /> ) }
							</Box>
							<Box>
								<FormSendMessage />
							</Box>
						</Box>
					) 
					: ( 
						<Box
							display='flex'
							justifyContent='center'
							alignItems='center'
							flexDirection='column'
							height='100%'
						>
							<ChatIcon color='info' />
							<Typography color='info' variant='body2' >
								Haz click en un usuario para chatear!
							</Typography>
						</Box>
					)
				}
			</Box>	
		</ThemeLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	
	const session = await getSession({ req })

	if( !session ) {

		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}

export default Home