import { useState, useEffect, useContext, FormEvent } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { 
	Button, 
	Grid, 
	Paper, 
	Avatar, 
	List, 
	ListItemButton, 
	ListItemText, 
	Badge, 
	Container,
	FormControl,
	OutlinedInput,
	InputAdornment,
	IconButton,
	Box
} from '@mui/material'
import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'
import SendIcon from '@mui/icons-material/Send'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { api, scrollFunctions } from '../utils'
import { SocketContext } from '../contexts'
import { IMessage, IUser } from '../interfaces'
import { changeTheme, logout } from '../redux/slices'
/*  */
import { ThemeLayout } from '../layouts'
import { Message } from '../components'


const Home: NextPage = () => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ usersToChat, setUsersToChat ] = useState<IUser[]>( [] )
	const [ isChatOpen, setIsChatOpen ] = useState( false )
	const [ activeChat, setActiveChat ] = useState<IUser|null>( null )
	const [ messages, setMessages ] = useState<IMessage[]>( [] )
	const [ msg, setMsg ] = useState( '' )
	const loggedUser = useAppSelector( state => state.user )
	const dispatch = useAppDispatch()
	const router = useRouter()
	const { socket } = useContext( SocketContext )
	
	const toggleTheme = (  ) => {
		
		dispatch( changeTheme() )
	}
	const onLogout = async (  ) => {
		
		localStorage.clear()
		dispatch( logout() )
		
		signOut()
	}
	const setChat = async ( user: IUser ) => {
		
		try {
			
			const resp = await api.get<{ messages: IMessage[]}>( `/message/from/${ user._id }`, {
				headers: {
					'Authorization': `Bearer ${ localStorage.getItem( 'bearer' ) }`
				}
			})
			const { messages: msgs } = resp.data

			setMessages([ ...msgs ])
			setActiveChat( user )
			setIsChatOpen( true )
		} catch ( error ) {
			
            console.log("🚀 ~ file: index.tsx ~ line 61 ~ setChat ~ error", error)
		}
	}

	const onSendMsg = async ( e: FormEvent ) => {
		
		e.preventDefault()

		socket?.emit( 'send-personal-msg', {
			from: loggedUser._id,
			to: activeChat?._id,
			message: msg
		})
		setMsg( '' )
	}
	
	useEffect( () => {
		
		socket?.on( 'get-users', ( resp: IUser[] ) => {
			
			const users = resp.filter( user => user._id !== loggedUser._id )
			setUsersToChat( users )
		})
	}, [ socket, loggedUser._id ])

	useEffect( () => {

		socket?.on( 'send-personal-msg', ( msg: IMessage ) => {


			setMessages( preMessages => [ ...preMessages, msg ] )
		})
	}, [ socket ])

	useEffect( () => scrollFunctions.scrollToBottomAnimated( 'messages-box' ), [ messages ])

	return (
		<ThemeLayout>
			<Container>
				<Button onClick={toggleTheme}>toggle theme</Button>
				<Button onClick={onLogout}>Logout</Button>
				<Button onClick={() => router.push('/login')}>login</Button>

				<Grid container display='flex' flexWrap='wrap' gap={ 2 } >
					<Grid item xs={ 12 } lg={ 3 } >
						<Paper
							sx={{ width: '100%' }}
						>
							<List>
								{ 
									 usersToChat.map( user => (
										<ListItemButton key={ user._id } 
											onClick={ () => setChat( user ) }
											sx={{
												backgroundColor: theme => user._id === activeChat?._id ? theme.palette.action.focus : '',
											}}
										>
											<Grid 
												container 
												flexDirection='row' 
												flexWrap='nowrap' 
												justifyContent='flex-start'
												alignItems='center'
												gap={ 2 }
											>
												<Grid item >
													<Badge color='success' invisible={ !user.isOnline } variant='dot' >
														<Avatar>
															{ user.name.charAt(0) }
														</Avatar>
													</Badge>
												</Grid>
												<Grid item  >
													<ListItemText secondary={ user.email } />
												</Grid>
											</Grid>
										</ListItemButton>
									))
								}
							</List>
						</Paper>
					</Grid>

					{/* Chat */}
					<Grid item xs={ 12 } lg={ 7 } >
						{
							isChatOpen && (
								<Paper 
									elevation={ 0 } 
									sx={{ 
										width: '100%'
									}}
								>
									<Box
										sx={{ 
											height: '500px',
											display: 'flex',
											flexDirection: 'column'
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
											{ messages.map( msg =>  <Message key={ msg._id } msg={ msg } /> )}
										</Box>
										<Box>
											<form onSubmit={ onSendMsg } >
												<FormControl sx={{ width: '100%' }} variant="outlined">
													<OutlinedInput
														value={ msg }
														onChange={ e => setMsg( e.target.value ) }
														autoFocus
														endAdornment={
															<InputAdornment position="end">
																<IconButton
																	type='submit'
																	edge="end"
																>
																	<SendIcon />
																</IconButton>
															</InputAdornment>
														}
													/>
												</FormControl>
											</form>
										</Box>
									</Box>
								</Paper>
							)
						}
					</Grid>
				</Grid>
			</Container>
		</ThemeLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	
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