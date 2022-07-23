import type { NextPage } from 'next'
import { Button } from '@mui/material'
/*  */
import { useAppDispatch } from '../hooks'
import { changeTheme } from '../redux/slices'
import { ThemeLayout } from '../layouts'


const Home: NextPage = () => {

	const dispatch = useAppDispatch()

	const toggleTheme = (  ) => {
		dispatch( changeTheme() )
	}

	return (
		<ThemeLayout>
			<Button 
				onClick={ toggleTheme }
			>toggle theme</Button>
		</ThemeLayout>
	)
}

export default Home