import { NextPage, GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { ThemeLayout } from '../../layouts'


const AdminHome: NextPage = () => {
	return (
		<ThemeLayout>
			<div>Hola desde admin</div>
		</ThemeLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

	const session = await getSession({ req })
	const admitedRoles = [ 'admin' ]
	const { p = '/' } = query

	if( !session ) {

		return {
			redirect: {
				destination: `/login?p=${ p }`,
				permanent: false
			}
		}
	}

	const user = session.user as any
	
	if( !admitedRoles.includes( user.role ) ) {

		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}

	return {
		props: {
			
		}
	}
}

export default AdminHome