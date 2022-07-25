import { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { NextPage, GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import { 
	Alert,
	Paper, 
	TextField,
	Grid,
	Link,
	Container
} from '@mui/material'
/*  */
import { ThemeLayout } from '../layouts'
import { Btn, ToggleTheme } from '../components'


interface IFormData {
	email: string;
	password: string
}
const LoginPage: NextPage = ( ) => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ errorMsg, setErrorMsg ] = useState( '' )
	const [ initialState ] = useState<IFormData>({
		email: '',
		password: ''
	})
	const router = useRouter()

	/* functions */
	const onLogin = async ( values: { email: string; password: string } ) => {
		
		setErrorMsg( '' )
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
			<Container
				sx={{
					width: '100%',
					minHeight: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative'
				}}
			>
				<ToggleTheme sx={{ position: 'absolute', top: '10px', right: '10px' }} />
				<Paper
					sx={{ 
						padding: '2.5%', 
						maxWidth: '500px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
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
						{({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
							<form onSubmit={ handleSubmit } >
								{ errorMsg && <Alert severity="error">{ errorMsg }</Alert> }
								<TextField 
									label='Email'
									id='email'
									name='email'
									onChange={ handleChange }
									onBlur={ handleBlur }
									value={ values.email }
									fullWidth
									error={ !!errors.email && touched.email }
									helperText={ touched.email && errors.email }
									margin='normal'
								/>
								<TextField
									label='Contraseña'
									id='password'
									name='password'
									onChange={ handleChange }
									onBlur={ handleBlur }
									value={ values.password }
									type='password'
									fullWidth
									error={ !!errors.password && touched.password }
									helperText={ touched.password && errors.password }
									margin='normal'
								/>
								<Btn 
									label='Inciar Sesión'
									loading={ isLoading }
									fullWidth
									type='submit'
									variant='contained'
									sx={{ mt: 3, mb: 2 }}
								/>
								<Grid container>
									<Grid item xs>
										<NextLink href='/forgot-password' passHref >
											<Link  variant="body2">
												¿Olvidaste tu contraseña?
											</Link>
										</NextLink>
									</Grid>
									<Grid item>
										<NextLink href='/signup' passHref >
											<Link variant="body2">
												¿Aún no tienes una cuenta?
											</Link>
										</NextLink>
									</Grid>
								</Grid>
							</form>
						)}
					</Formik>
				</Paper>
			</Container>
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