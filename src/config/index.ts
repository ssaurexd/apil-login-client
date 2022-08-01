export * from './theme'


export const apiHost = process.env.NODE_ENV === 'production' ? process.env.API_HOST! : 'http://localhost:4000'