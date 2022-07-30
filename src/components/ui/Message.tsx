import { FC } from 'react'
import { Typography, Box } from '@mui/material'
import { useAppSelector } from '../../hooks';


interface Props {
	msg: string;
	right: boolean
}
export const Message: FC<Props> = ({ msg, right }) => {

	const { theme } = useAppSelector( state => state.app )

	return (
		<Box 
			sx={{ 
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: right ? 'flex-end' : 'flex-start',
				margin: '8px 0'
			}} 
		>
			<Typography
				variant='body1'
				sx={{
					backgroundColor: theme === 'dark' 
						? right ? '#2F6E4B' : '#335366'
						: right ? '#c1d9d0' : '#e4ebf0',
					padding: '2px 10px',
					maxWidth: '70%',
					borderRadius: '4px'
				}}
			>
				{ msg }
			</Typography>
			<Typography variant='caption' >7 min, 22/02/2019</Typography>
		</Box>
	)
}