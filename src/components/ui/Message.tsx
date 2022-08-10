import { FC, useMemo } from 'react'
import { Typography, Box } from '@mui/material'
/*  */
import { useAppSelector } from '../../hooks';
import { dateFunctions } from '../../utils'
import { IMessage } from '../../interfaces';


interface Props {
	msg: IMessage
}
export const Message: FC<Props> = ({ msg }) => {

	const { theme } = useAppSelector( state => state.app )
	const { _id: uid } = useAppSelector( state => state.user )
	const right = useMemo( () => uid === msg.from, [ uid, msg.from ])

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
					borderRadius: '4px',
					overflowWrap: 'break-word'
				}}
			>
				{ msg.message }
			</Typography>
			<Typography variant='caption' >{ dateFunctions.getFormatDistanceToNow( msg.createdAt ) }</Typography>
		</Box>
	)
}