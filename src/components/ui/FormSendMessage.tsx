import { FC, FormEvent, useContext, useState } from 'react'
import { FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
/*  */
import { SocketContext } from '../../contexts'
import { useAppSelector } from '../../hooks'


interface Props {
	
}
export const FormSendMessage: FC<Props> = () => {

	const [ msg, setMsg ] = useState( '' )
	const loggedUser = useAppSelector( state => state.user )
	const { activeChat } = useAppSelector( state => state.chat )
	const { socket } = useContext( SocketContext )

	/* functions */
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

	return (
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
	)
}