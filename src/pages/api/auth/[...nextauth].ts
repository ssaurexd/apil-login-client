import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { api } from '../../../utils'


export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'jsmith',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize( credentials, req ) {
				
				try {
					
					const { data } = await api.post( '/auth/login', credentials )
					const { user, token } = data
					
					
					return { ...user, token } 
				} catch (error) {
					
					return null
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_SID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
		})
	],
	callbacks: {
		jwt: async ({ token, account, user }) => {

			if( account ) {

				token.accessToken = token.access_token

				switch ( account.type ) {

					case 'credentials':
						token.user = user
						break;

					case 'oauth':
						
						const resp = await api.post( '/auth/oauth/google', { email: user?.email, name: user?.name })

						token.user = resp.data
						break;
				
					default:
						break;
				}
			}

			return token
		},
		session: async ({ session, token, user }) => {

			session.accessToken = token.accessToken
			session.user = token.user as any

			return session
		},
	},
	pages: {
		signIn: '/login',
		newUser: '/signup'
	},
	session: {
		maxAge: 2592000, //30 dias
		strategy: 'jwt',
		updateAge: 86400 // 1 dia
	}
});
