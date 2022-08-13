import { useState, useEffect, useContext, FormEvent } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { 
	Grid,
	Avatar, 
	List, 
	ListItemButton, 
	ListItemText, 
	Badge, 
	FormControl,
	OutlinedInput,
	InputAdornment,
	IconButton,
	Box,
	Drawer,
	Toolbar,
	ListSubheader,
	ListItemAvatar,
	Typography,
	Divider,
	Collapse,
	ListItemIcon,
	useTheme,
	useMediaQuery
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Menu as MenuIcon } from '@mui/icons-material'
import { getSession, signOut } from 'next-auth/react'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { api, scrollFunctions } from '../utils'
import { SocketContext } from '../contexts'
import { IMessage, IUser } from '../interfaces'
import { changeTheme, logout } from '../redux/slices'
/*  */
import { ThemeLayout } from '../layouts'
import { Message } from '../components'


const drawerWidth = 340
const Home: NextPage = () => {

	const [ offlineUsers, setOfflineUsers ] = useState<IUser[]>( [] )
	const [ onlineUsers, setOnlineUsers ] = useState<IUser[]>( [] )
	const [ isChatOpen, setIsChatOpen ] = useState( false )
	const [ activeChat, setActiveChat ] = useState<IUser|null>( null )
	const [ messages, setMessages ] = useState<IMessage[]>( [] )
	const [ openDrawer, setOpenDrawer ] = useState( false )
	const [ msg, setMsg ] = useState( '' )
	const [ userSettingsOpen, setUserSettingsOpen ] = useState( false )
	const loggedUser = useAppSelector( state => state.user )
	const theme = useAppSelector( state => state.app.theme )
	const dispatch = useAppDispatch()
	const muitheme = useTheme()
 	const isSmOrLess = useMediaQuery( muitheme.breakpoints.down('sm') )
	const { socket } = useContext( SocketContext )
	
	const toggleTheme = (  ) => {
		
		dispatch( changeTheme() )
	}
	const onLogout = async (  ) => {
		
		localStorage.clear(  )
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

			setMessages([ ...msgs.reverse() ])
			setActiveChat( user )
			setIsChatOpen( true )
			
			if( isSmOrLess ) setOpenDrawer( false )
		} catch ( error ) {
			
            console.log("🚀 ~ file: index.tsx ~ line 61 ~ setChat ~ error", error)
		}
	}

	const onSendMsg = async ( e: FormEvent ) => {
		
		e.preventDefault()
		if( msg.trim() === '' ) return

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
			setOfflineUsers( users.filter( user => user.isOnline === false ) )
			setOnlineUsers( users.filter( user => user.isOnline === true ) )
		})
	}, [ socket, loggedUser._id ])

	useEffect( () => {

		socket?.on( 'send-personal-msg', ( msg: IMessage ) => {

			if( 
				( msg.from === loggedUser._id && msg.to === activeChat?._id ) ||
				( msg.from === activeChat?._id && msg.to === loggedUser._id )
			) {
				
				setMessages( preMessages =>  {

					if( preMessages.includes( msg ) ) return [ ...preMessages ]
					else return [ ...preMessages, msg ]
				})
			}
		})
	}, [ socket, activeChat?._id, loggedUser ])

	useEffect( () => scrollFunctions.scrollToBottomAnimated( 'messages-box' ), [ messages ])

	return (
		<ThemeLayout>
			<Drawer
				variant={ isSmOrLess ? 'persistent' : 'permanent' }
				sx={{
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open={ isSmOrLess ? openDrawer : true }
			>
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'flex-end'
					}}
				>
					<IconButton
						sx={{
							display: isSmOrLess ? 'inline' : 'none'
						}}
						onClick={ () => setOpenDrawer( !openDrawer ) }
					>
						<MenuOpenIcon />
					</IconButton>
				</Toolbar>
				<List>
					<ListItemButton onClick={ () => setUserSettingsOpen( !userSettingsOpen ) } >
						<ListItemAvatar><Avatar /></ListItemAvatar>
						<ListItemText  
							primary={ loggedUser.name }
						/>
						{ userSettingsOpen ? <ExpandLess /> : <ExpandMore /> }
					</ListItemButton>
					<Collapse in={ userSettingsOpen } timeout='auto' unmountOnExit >
						<List component='div' disablePadding >
							<ListItemButton onClick={ toggleTheme } sx={{ pl: 4 }}>
								<ListItemIcon>
									{ theme === 'dark' ? <DarkModeIcon /> : <LightModeIcon /> }
								</ListItemIcon>
								<ListItemText primary='Tema' />
							</ListItemButton>

							<ListItemButton onClick={ onLogout } sx={{ pl: 4 }}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary='Cerrar Sesión' />
							</ListItemButton>
						</List>
					</Collapse>
				</List>
				<Divider />
				<List
					subheader={<ListSubheader>Online</ListSubheader>}
				>
					{ 
						onlineUsers.map( user => (
							<ListItemButton key={ user._id } 
								onClick={ () => setChat( user ) }
								sx={{
									backgroundColor: theme => user._id === activeChat?._id ? theme.palette.action.focus : '',
								}}
							>
								<ListItemAvatar>
									<Badge color='success' invisible={ !user.isOnline } variant='dot' >
										<Avatar>
											{ user.name.charAt(0) }
										</Avatar>
									</Badge>
								</ListItemAvatar>
								<ListItemText
									primary={ user.name }
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'
											>
												{ user.email }
											</Typography>
										</>
									}
								/>
							</ListItemButton>
						))
					}
				</List>
				<List
					subheader={<ListSubheader>Offline</ListSubheader>}
				>
					{ 
						offlineUsers.map( user => (
							<ListItemButton key={ user._id } 
								onClick={ () => setChat( user ) }
								sx={{
									backgroundColor: theme => user._id === activeChat?._id ? theme.palette.action.focus : '',
								}}
							>
								<ListItemAvatar>
									<Badge color='success' invisible={ !user.isOnline } variant='dot' >
										<Avatar>
											{ user.name.charAt(0) }
										</Avatar>
									</Badge>
								</ListItemAvatar>
								<ListItemText
									primary={ user.name }
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'
											>
												{ user.email }
											</Typography>
										</>
									}
								/>
							</ListItemButton>
						))
					}
				</List>
			</Drawer>
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
						position: 'absolute',
						top: '10px',
						left: '10px'
					}}
					onClick={ () => setOpenDrawer( !openDrawer ) }
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