import { FC, useMemo, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Theme as MuiTheme } from '@mui/material'
/*  */
import { useAppDispatch, useAppSelector } from '../hooks'
import { darkTheme, lightTheme } from '../config'
import { changeTheme } from '../redux/slices'
import { Theme } from '../interfaces'

interface Props {
	children: JSX.Element | JSX.Element[]
}
const ThemeLayout: FC<Props> = ({ children }) => {

	const themeApp = useAppSelector( state => state.app.theme )
	const dispatch = useAppDispatch()
	const theme: MuiTheme = useMemo( () => themeApp === 'light' ? lightTheme : darkTheme, [ themeApp ] )

	/* effects */
	useEffect( () => {

		const localTheme = localStorage.getItem('theme') as Theme | undefined

		if( localTheme ) dispatch( changeTheme( localTheme ) )
	}, [  ])

	return (
		<ThemeProvider theme={ theme }>	
			<CssBaseline />
			{ children }
		</ThemeProvider>
	)
}

export default ThemeLayout