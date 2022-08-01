import { FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import jwt from 'jsonwebtoken'
/*  */
import { useAppDispatch } from '../hooks'
import { setUser } from '../redux/slices'
import { IUser } from '../interfaces'

interface Props {
	children: JSX.Element | JSX.Element[]
}
export const AuthProvider: FC<Props> = ({ children }) => {

	const dispatch = useAppDispatch()
	const { status, data } = useSession()

	/* effects */
	useEffect( () => {

		if( status === 'authenticated' ) {

			const user: IUser = {
				...data.user as IUser,
				isOnline: true
			}
			const token = jwt.sign({ uid: user._id }, `${process.env.NEXT_PUBLIC_JWT_SEED}` )

			localStorage.setItem( 'token', token )
			localStorage.setItem( 'bearer', data.user.token  )
			dispatch( setUser( user ) )
		}
	}, [ status, data?.user, dispatch ])

	return (
		<>
			{ children }
		</>
	)
}