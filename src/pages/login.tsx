import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { NextPage, GetServerSideProps } from 'next'
import { getSession, signIn, getProviders } from 'next-auth/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import { 
	Alert,
	Paper, 
	TextField,
	Grid,
	Link,
	Container,
	Divider
} from '@mui/material'
import GoogleButton from 'react-google-button'
/*  */
import { ThemeLayout } from '../layouts'
import { Btn, ToggleTheme } from '../components'
import { useAppSelector } from '../hooks'


interface IFormData {
	email: string;
	password: string
}
const LoginPage: NextPage = ( ) => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ errorMsg, setErrorMsg ] = useState( '' )
	const [ providers, setProviders ] = useState<any>( {} )
	const [ initialState ] = useState<IFormData>({
		email: '',
		password: ''
	})
	const router = useRouter()
	const theme = useAppSelector( state => state.app.theme )

	/* functions */
	const onLogin = async ( values: { email: string; password: string } ) => {
		
		setErrorMsg( '' )
		setIsLoading( true )
		const resp: any = await signIn( 'credentials', { ...values, redirect: false } )

		if( resp.ok ) router.reload()
		else {

			console.log( resp.error )
			setIsLoading( false )
			setErrorMsg( 'Email y/o Contraseña incorrectos.' )
		}
	}

	const getBtnProvides = async (  ) => {
		
		try {

			const prov = await getProviders()
			const { credentials, ...restProv } = prov as any
			setProviders( restProv )
		} catch ( error ) {
			
            console.log("🚀 ~ file: login.tsx ~ line 58 ~ getBtnProvides ~ error", error)
		}
	}

	const onSigninWithGoogle = (  ) => {
		
		signIn( 'google' )
	}

	/* effects */
	useEffect( () => {

		getBtnProvides()
	}, [])

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
								<Divider sx={{ mt: 2, mb: 2 }} />
								<Grid container display='flex' flexDirection='column' >
									{ Object.values( providers ).map(( prov: any ) =>  {

										switch ( prov.id ) {
											case 'google':
												
												return (
													<GoogleButton 
														label='Iniciar sesión con Google'
														type={ theme } 
														style={{ width: '100%', textTransform: 'uppercase', fontSize: '12px' }} 
														key={ prov.id }
														onClick={ onSigninWithGoogle }
													/>
												)
										
											default:
												return <></>
												break;
										}
									})}
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