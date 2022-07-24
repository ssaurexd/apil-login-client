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
				isLogged: true
			}
            console.log("🚀 ~ file: AuthProvider.tsx ~ line 27 ~ useEffect ~ process.env.JWT_SEED", process.env.JWT_SEED)
			const token = jwt.sign({ uid: user._id }, `${process.env.JWT_SEED}` )

			localStorage.setItem( 'token', token )
			dispatch( setUser( user ) )
		}
	}, [ status ])

	return (
		<>
			{ children }
		</>
	)
}