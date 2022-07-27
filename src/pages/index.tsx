import { useState, useEffect, useRef, useContext } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { Button, Grid, Paper, Avatar, List, ListItemButton, ListItemText, Badge, Container } from '@mui/material'
import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { changeTheme, logout } from '../redux/slices'
import { ThemeLayout } from '../layouts'
import { IUser } from '../interfaces'
import { SocketContext } from '../contexts'


const Home: NextPage = () => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ usersToChat, setUsersToChat ] = useState<IUser[]>( [] )
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
	
	useEffect( () => {
		
		socket?.on( 'get-users', ( resp: IUser[] ) => {
			
			const users = resp.filter( user => user._id !== loggedUser._id )
			setUsersToChat( users )
		} )
	}, [ socket, loggedUser._id ])

	return (
		<ThemeLayout>
			<Container>
				<Button onClick={toggleTheme}>toggle theme</Button>
				<Button onClick={onLogout}>Logout</Button>
				<Button onClick={() => router.push('/login')}>login</Button>

				<Grid container display='flex' flexWrap='wrap' >
					<Grid item md={ 3 } >
						<Paper
							sx={{ padding: '2.5%', minWidth: '300px' }}
						>
							<List>
								{ 
									 usersToChat.map( user => (
										<ListItemButton key={ user._id } >
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