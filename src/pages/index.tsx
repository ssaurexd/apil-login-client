import { useState, useEffect, useRef, useContext, FormEvent } from 'react'
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
	TextField,
	FormControl,
	OutlinedInput,
	InputAdornment,
	IconButton 
} from '@mui/material'
import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'
import SendIcon from '@mui/icons-material/Send'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { changeTheme, logout } from '../redux/slices'
import { ThemeLayout } from '../layouts'
import { IUser } from '../interfaces'
import { SocketContext } from '../contexts'


const Home: NextPage = () => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ usersToChat, setUsersToChat ] = useState<IUser[]>( [] )
	const [ isChatOpen, setIsChatOpen ] = useState( false )
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
	const setChat = ( user: IUser ) => {
		
		console.log("🚀 ~ file: index.tsx ~ line 35 ~ setChat ~ user", user)
		setIsChatOpen( true )
	}

	const onSendMsg = async ( e: FormEvent ) => {
		
		e.preventDefault()
		console.log( msg )
	}
	
	useEffect( () => {
		
		socket?.on( 'get-users', ( resp: IUser[] ) => {
			
			const users = resp.filter( user => user._id !== loggedUser._id )
			setUsersToChat( users )
		})
	}, [ socket, loggedUser._id ])

	return (
		<ThemeLayout>
			<Container>
				<Button onClick={toggleTheme}>toggle theme</Button>
				<Button onClick={onLogout}>Logout</Button>
				<Button onClick={() => router.push('/login')}>login</Button>

				<Grid container display='flex' flexWrap='wrap' gap={ 2 } >
					<Grid item md={ 3 } >
						<Paper
							sx={{ width: '100%' }}
						>
							<List>
								{ 
									 usersToChat.map( user => (
										<ListItemButton key={ user._id } 
											onClick={ () => setChat( user ) }
										>
											<Grid 
												xs={ 12 } 
												item 
												container 
												flexDirection='row' 
												flexWrap='nowrap' 
												justifyContent='center'
												alignItems='center'
											>
												<Grid item xs={ 3 } >
													<Badge color='success' invisible={ !user.isOnline } variant='dot' >
														<Avatar>
															{ user.name.charAt(0) }
														</Avatar>
													</Badge>
												</Grid>
												<Grid item xs={ 9 } >
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
					<Grid item md={ 7 } >
						{
							isChatOpen && (
								<Paper 
									elevation={ 0 } 
									sx={{ 
										width: '100%',
										minHeight: '500px',
										overflowY: 'scroll'
									}}
								>
									<Grid item container display='flex' flexDirection='column' justifyContent='space-between' >
										<Grid item xs={ 12 }  >
											hola
										</Grid>
										<Grid item xs={ 12 } >
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
										</Grid>
									</Grid>
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