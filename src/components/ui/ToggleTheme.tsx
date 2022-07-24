import { FC } from 'react'
import { IconButton, IconButtonProps } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
/*  */
import { useAppDispatch, useAppSelector } from '../../hooks'
import { changeTheme } from '../../redux/slices'


interface Props extends IconButtonProps {
	
}
export const ToggleTheme: FC<Props> = ( props ) => {

	const { onClick: nullClick, ...restProps } = props
	const dispatch = useAppDispatch()
	const theme = useAppSelector( state => state.app.theme )

	const onThemeChange = (  ) => dispatch( changeTheme() )

	return (
		<IconButton
			{ ...restProps }
			onClick={ onThemeChange }
		>
			{ theme === 'dark' ? <DarkModeIcon /> : <LightModeIcon /> }
		</IconButton>
	)
}