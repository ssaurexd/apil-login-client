import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const getFormatDistanceToNow = ( date: any ) => {

	const dateToFormat = new Date( date )
	const fromNow = formatDistanceToNow( dateToFormat, { locale: es } )

	return `hace ${ fromNow }`
}