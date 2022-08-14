import { useState, useEffect, useContext, FC } from 'react'
import { 
	Avatar, 
	List, 
	ListItemButton, 
	ListItemText, 
	Badge,
	IconButton,
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
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { signOut } from 'next-auth/react'
/*  */
import { useAppDispatch, useAppSelector } from '../../hooks'
import { api } from '../../utils'
import { SocketContext } from '../../contexts'
import { IMessage, IUser } from '../../interfaces'
import { changeTheme, logout, setChat, setOpenDrawer, setOfflineUsers, setOnlineUsers } from '../../redux/slices'
import { drawerWidth } from '../../config'


interface Props {
	
}
export const Sidebar: FC<Props> = () => {

	const [ userSettingsOpen, setUserSettingsOpen ] = useState( false )
	const { openDrawer, onlineUsers, offlineUsers, activeChat } = useAppSelector( state => state.chat )
	const { socket } = useContext( SocketContext )
	const { theme } = useAppSelector( state => state.app )
	const loggedUser = useAppSelector( state => state.user )
	const dispatch = useAppDispatch()
	const muitheme = useTheme()
 	const isSmOrLess = useMediaQuery( muitheme.breakpoints.down('sm') )

	/* functions */
	const toggleTheme = (  ) => {
		
		dispatch( changeTheme() )
	}

	const onLogout = async (  ) => {
		
		localStorage.clear(  )
		dispatch( logout() )
		
		signOut()
	}

	const toggleDrawer = (  ) => dispatch( setOpenDrawer( !openDrawer ) )

	const setChatLocal = async ( user: IUser ) => {
		
		try {
			
			const resp = await api.get<{ messages: IMessage[]}>( `/message/from/${ user._id }`, {
				headers: {
					'Authorization': `Bearer ${ localStorage.getItem( 'bearer' ) }`
				}
			})
			const { messages: msgs } = resp.data

			dispatch( setChat({ isChatOpen: true, messages: [ ...msgs.reverse() ], user }) )
			
			if( isSmOrLess ) dispatch( setOpenDrawer( false ) )
		} catch ( error ) {
			
            console.log("🚀 ~ file: index.tsx ~ line 61 ~ setChat ~ error", error)
		}
	}

	/* effects */
	useEffect( () => {
		
		socket?.on( 'get-users', ( resp: IUser[] ) => {
			
			const users = resp.filter( user => user._id !== loggedUser._id )
			dispatch( setOfflineUsers( users.filter( user => user.isOnline === false ) ) )
			dispatch( setOnlineUsers( users.filter( user => user.isOnline === true ) ) )
		})
	}, [ socket, loggedUser._id, dispatch ])

	return (
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
					onClick={ toggleDrawer }
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
							onClick={ () => setChatLocal( user ) }
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
							onClick={ () => setChatLocal( user ) }
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
	)
}