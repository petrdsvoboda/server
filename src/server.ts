import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import { Express } from 'express-serve-static-core'
import * as logger from 'morgan'

export interface ServerOptions {
	port?: number
	env: string
}

export const serve = (options: ServerOptions): Express => {
	console.log('Starting server...')
	const server = express()

	if (options.env !== 'production') {
		server.use(logger('dev'))
	}

	server.use(cors())
	server.use(bodyParser.urlencoded({ extended: false }))
	server.use(bodyParser.json())

	const port = options.port ?? 8080
	server.listen(port, () => {
		console.log('Server listening on port:', port)
	})

	return server
}
