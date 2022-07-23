import type { NextPage } from 'next'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
/*  */
import { useAppDispatch } from '../hooks'
import { changeTheme } from '../redux/slices'
import { ThemeLayout } from '../layouts'
import { api } from '../utils'


const Home: NextPage = () => {

	const dispatch = useAppDispatch()
	const router = useRouter()

	const toggleTheme = (  ) => {
		dispatch( changeTheme() )
	}
	const onLogout = async (  ) => {
		
		try {
			
			await api.post( '/auth/logout' )
		} catch ( error ) {
			return
		}
		
		signOut()
	}


	return (
		<ThemeLayout>
			<Button 
				onClick={ toggleTheme }
			>toggle theme</Button>
			<Button 
				onClick={ onLogout }
			>Logout</Button>
			<Button 
				onClick={ () => router.push('/login') }
			>login</Button>
		</ThemeLayout>
	)
}

export default Home