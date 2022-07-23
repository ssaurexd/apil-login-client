import { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
/*  */
import { useAppDispatch } from '../hooks'
import { setUser } from '../redux/slices'
import { IUser } from '../interfaces'

interface Props {
	children: JSX.Element | JSX.Element[]
}
const AuthLayout: FC<Props> = ({ children }) => {

	const dispatch = useAppDispatch()
	const { status, data } = useSession()

	/* effects */
	useEffect( () => {

		if( status === 'authenticated' ) {

			const user: IUser = {
				...data.user as IUser,
				isLogged: true
			}
			dispatch( setUser( user ) )
		}
	}, [ status ])

	return (
		<>
			{ children }
		</>
	)
}

export default AuthLayout