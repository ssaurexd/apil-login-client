import { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage, GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import { Alert, Paper, TextField } from '@mui/material'
/*  */
import { ThemeLayout } from '../layouts'
import { Btn } from '../components'


interface IFormData {
	email: string;
	password: string
}
const LoginPage: NextPage = ( ) => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ errorMsg, setErrorMsg ] = useState( '' )
	const [ initialState, setInitialState ] = useState<IFormData>({
		email: '',
		password: ''
	})
	const router = useRouter()

	/* functions */
	const onLogin = async ( values: { email: string; password: string } ) => {
		
		setIsLoading( true )
		const resp: any = await signIn( 'credentials', { ...values, redirect: false } )
		const path = ( router.query.p || '/' ) as string 

		if( resp.ok ) router.push( path )
		else {

			console.log( resp.error )
			setIsLoading( false )
			setErrorMsg( 'Email y/o Contraseña incorrectos.' )
		}
	}

	return (
		<ThemeLayout>
			<Paper
				sx={{ padding: '10px' }}
				elevation={ 0 }
			>
				<Formik
					initialValues={ initialState }
					onSubmit={ async ( values ) => {
						await onLogin( values )
					}}
					validationSchema={ yup.object().shape({
						email: yup.string().email( 'Email no valido' ).required( 'Campo obligatorio' ),
						password: yup.string().required( 'Campo obligatorio' ),
					})}
				>
					{({ values, errors, handleChange, handleSubmit}) => (
						<form onSubmit={ handleSubmit }>
							{ errorMsg && <Alert severity="error">{ errorMsg }</Alert> }
							<TextField 
								label='Email'
								name='email'
								onChange={ handleChange }
								value={ values.email }
								fullWidth
								error={ !!errors.email }
								helperText={ errors.email }
								margin='normal'
							/>
							<TextField
								label='Contraseña'
								name='password'
								onChange={ handleChange }
								value={ values.password }
								type='password'
								fullWidth
								error={ !!errors.password }
								helperText={ errors.password }
								margin='normal'
							/>
							<Btn 
								label='Inciar Sesión'
								loading={ isLoading }
								fullWidth
								type='submit'
								variant='contained'
							/>
						</form>
					)}
				</Formik>
			</Paper>
		</ThemeLayout>
	)
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	
	const session = await getSession({ req })
	const { p = '/' } = query

	if( session ) {

		return {
			redirect: {
				destination: `${ p }`,
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}

export default LoginPage