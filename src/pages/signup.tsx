import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { NextPage, GetServerSideProps } from 'next'
import { getProviders, getSession, signIn } from 'next-auth/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'
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
import { ISignupErrorResponse } from '../interfaces'
import { useAppSelector } from '../hooks'
/*  */
import { ThemeLayout } from '../layouts'
import { Btn, ToggleTheme } from '../components'
import { api } from '../utils'


interface IFormData {
	email: string
	password: string
	name: string
	repeatPassword: string
}
const SignupPage: NextPage = ( ) => {

	const [ isLoading, setIsLoading ] = useState( false )
	const [ errorMsg, setErrorMsg ] = useState( '' )
	const [ providers, setProviders ] = useState<any>( {} )
	const [ initialState ] = useState<IFormData>({
		email: '',
		password: '',
		name: '',
		repeatPassword: ''
	})
	const router = useRouter()
	const theme = useAppSelector( state => state.app.theme )

	/* functions */
	const onSignup = async ( 
		{ email, name, password }: IFormData, 
		setFieldError: ( field: string, msg: string ) => void  
	) => {
		
		setErrorMsg( '' )
		setIsLoading( true )
		const data = { name, email, password }

		try {
			
			await api.post( '/auth/signup', data )
		} catch ( error ) {
			
			setIsLoading( false )
			if( axios.isAxiosError( error ) ) {
				
				const errResp: ISignupErrorResponse = error.response?.data as ISignupErrorResponse

				setErrorMsg( errResp.msg || '' )
				if( errResp.errors?.length ) {

					errResp.errors.map( err => {
						setFieldError( err.param, err.msg )
					})
				}
			}
			return
		}

		const resp: any = await signIn( 'credentials', { ...data, redirect: false } )

		if( resp.ok ) router.reload()
		else {

			console.log( resp.error )
			setIsLoading( false )
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

	const onSignupWithGoogle = (  ) => {
		
		signIn( 'google' )
	}

	/* effects */
	useEffect( () => { getBtnProvides() }, [] )

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
						onSubmit={ async ( values, { setFieldError } ) => {
							await onSignup( values, setFieldError )
						}}
						validationSchema={ yup.object().shape({
							email: yup.string().email( 'Email no valido' ).required( 'Campo obligatorio' ),
							password: yup.string().required( 'Campo obligatorio' ).min( 4, 'La contraseña es demasiado corta.' ),
							name: yup.string().required( 'Campo obligatorio' ),
							repeatPassword: yup.string()
								.required( 'Campo obligatorio' )
								.oneOf([ yup.ref('password'), null ], 'Las contraseñas no coinciden')
						})}
					>
						{({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
							<form onSubmit={ handleSubmit } autoComplete='off' >
								{ errorMsg && <Alert severity="error">{ errorMsg }</Alert> }
								<TextField 
									label='Nombre'
									id='name'
									name='name'
									onChange={ handleChange }
									onBlur={ handleBlur }
									value={ values.name }
									fullWidth
									error={ !!errors.name && touched.name }
									helperText={ touched.name && errors.name }
									margin='normal'
								/>
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
								<TextField
									label='Repite tu contraseña'
									id='repeatPassword'
									name='repeatPassword'
									onChange={ handleChange }
									onBlur={ handleBlur }
									value={ values.repeatPassword }
									type='password'
									fullWidth
									error={ !!errors.repeatPassword && touched.repeatPassword }
									helperText={ touched.repeatPassword && errors.repeatPassword }
									margin='normal'
								/>
								<Btn 
									label='Registrarse'
									loading={ isLoading }
									fullWidth
									type='submit'
									variant='contained'
									sx={{ mt: 3, mb: 2 }}
								/>
								<Grid container>
									<Grid item xs>
										<div></div>
									</Grid>
									<Grid item>
										<NextLink href='/login' passHref >
											<Link variant="body2">
												¿Ya tienes una cuenta?
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
														label='Registrarse con Google'
														type={ theme } 
														style={{ width: '100%', textTransform: 'uppercase', fontSize: '12px' }} 
														key={ prov.id }
														onClick={ onSignupWithGoogle }
													/>
												)
										
											default:
												return <></>
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

export default SignupPage