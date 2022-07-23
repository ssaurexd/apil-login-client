import { createTheme, responsiveFontSizes } from '@mui/material'


export let darkTheme = createTheme({
	palette: {
		mode: 'dark'
	}
})

darkTheme = responsiveFontSizes( darkTheme )


export let lightTheme = createTheme({
	palette: {
		mode: 'light'
	}
})

lightTheme = responsiveFontSizes( lightTheme )