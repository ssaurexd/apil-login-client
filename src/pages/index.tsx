import { useState, useEffect, useRef } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { Menu, MenuItem, Button, CircularProgress, TextField, Grid, Paper, Box, Popover, Avatar } from '@mui/material'
import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'
/*  */
import { useAppDispatch, useDebounce } from '../hooks'
import { changeTheme } from '../redux/slices'
import { ThemeLayout } from '../layouts'
import { api } from '../utils'
import { Container } from '@mui/system'
import { IUser } from '../interfaces'


const Home: NextPage = () => {

	const [ optionsUser, setOptionsUser ] = useState<IUser[]>( [] )
	const [ isLoading, setIsLoading ] = useState( false )
	const [ searchQuery, setSearchQuery ] = useState( '' )
	const searchEl = useRef<HTMLDivElement>( null )
	const [ openMenu, setOpenMenu ] = useState( false )
	const debouceValue = useDebounce( searchQuery, 600 )
	const dispatch = useAppDispatch()
	const router = useRouter()

	const toggleTheme = (  ) => {
		dispatch( changeTheme() )
	}
	const onLogout = async (  ) => {
		
		localStorage.clear()
		signOut()
	}
	const onCloseMenu = (  ) => {
		setOpenMenu( false )
	}

	const getUsersByQuery = async (  ) => {
		
		setOpenMenu( true )
		setIsLoading( true )
		try {
			
			const resp = await api.get<{data:IUser[]}>( `/user?q=${ searchQuery }`, {
				headers: {
					'Authorization': `Bearer ${ localStorage.getItem( 'bearer' ) }`
				}
			})

			setOptionsUser( resp.data.data )
			setIsLoading( false )
		} catch ( error ) {
			
			console.log("🚀 ~ file: index.tsx ~ line 45 ~ getUsersByQuery ~ error", error)
			setIsLoading( false )
			setOpenMenu( false )
		}
	}

	/* effects */
	useEffect( () => {

		if( debouceValue ) getUsersByQuery()
	}, [ debouceValue ])


	return (
		<ThemeLayout>
			<Container>
				<Button onClick={toggleTheme}>toggle theme</Button>
				<Button onClick={onLogout}>Logout</Button>
				<Button onClick={() => router.push('/login')}>login</Button>

				<Grid container display='flex' flexDirection='column' justifyContent='center' >
					<Grid item container xs={ 12 } display='flex' justifyContent='center' >
						<Grid item xs={ 12 } md={ 6 } position='relative' >
							<TextField 
								value={ searchQuery }
								fullWidth
								onChange={ ( e ) => setSearchQuery( e.target.value ) }
								ref={ searchEl }
								id="basic-button"
								aria-controls={ openMenu ? 'basic-menu' : undefined }
								aria-haspopup="true"
								aria-expanded={ openMenu ? 'true' : undefined }
							/>
							<Menu
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
								anchorEl={ searchEl.current }
								open={ openMenu }
								onClose={ onCloseMenu }
								sx={{ width: '100%'}}
							>
								<Grid 
									container 
									display='flex' 
									flexDirection='column'
									alignItems='center' 
									justifyContent='center'
									sx={{
										padding: '0 20px',
										width: 'auto',
										minWidth: '180px'
									}}
									gap={ 2 }
								>
									{ 
										isLoading 
											? <CircularProgress size={ 20 } /> 
											: optionsUser.length && optionsUser.map( user => (
												<Grid 
													item
													container 
													display='flex' 
													flexWrap='nowrap'
													alignItems='center' 
													justifyContent='left'
													gap={ 2 }
													key={ user._id }
												>
													<Grid item >
														<Avatar>
															{ user.name.charAt(0) }
														</Avatar>
													</Grid>
													<Grid item >
														{ user.email }
													</Grid>
												</Grid>
											))
									}
								</Grid>
							</Menu>
						</Grid>
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