import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as boolParser from 'express-query-boolean'

import * as cors from 'cors'
import * as logger from 'morgan'

export interface ServerOptions {
	port?: number
	env: string
}

export const serve = (options: ServerOptions): Express.Application => {
	console.log('Starting server...')
	const app = express()

	if (options.env !== 'production') {
		app.use(logger('dev'))
	}

	app.use(cors())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(boolParser())

	const port = options.port ?? 8080
	app.listen(port, () => {
		console.log('Server listening on port: ', port)
	})

	return app
}
