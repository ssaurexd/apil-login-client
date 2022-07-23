import { FC } from 'react'
import { LoadingButtonProps, LoadingButton } from '@mui/lab'


interface Props extends LoadingButtonProps {
	label: string
}

export const Btn: FC<Props> = ( props ) => {

	return (
		<LoadingButton
			{ ...props }
		>
			{ props.label }
		</LoadingButton>
	)
}
