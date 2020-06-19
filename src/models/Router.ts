import { Router as ExpressRouter } from 'express'
import { PathParams, RequestHandler } from 'express-serve-static-core'
import { Model } from 'objection'
import DBService from '../services/db/DBService'
import Controller from './Controller'

type HandlerOptions = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
	handler: RequestHandler<any, any, any>
	params?: string | string[]
	action?: string
	actionParams?: string | string[]
}

export default class Router {
	private router: ExpressRouter
	private path: string

	constructor(path?: string) {
		this.router = ExpressRouter()
		this.path = '/' + (path ? path : '')
	}

	public handle(options: HandlerOptions): Router
	public handle(options: HandlerOptions[]): Router
	public handle(options: HandlerOptions | HandlerOptions[]): Router {
		if (Array.isArray(options)) {
			options.map(o => {
				this.handle(o)
			})
			return this
		}

		const { method, handler, params, action, actionParams } = options
		let path = this.path

		if (params) {
			if (Array.isArray(params)) {
				path += params.map(param => '/:' + param)
			} else {
				path += '/:' + params
			}
		}

		if (action) {
			path += '/action/' + action
		}

		if (actionParams) {
			if (Array.isArray(actionParams)) {
				path += actionParams.map(param => '/:' + param)
			} else {
				path += '/:' + actionParams
			}
		}

		if (method === 'GET') {
			this.get(path, handler)
		} else if (method === 'POST') {
			this.post(path, handler)
		} else if (method === 'PATCH') {
			this.patch(path, handler)
		} else if (method === 'DELETE') {
			this.delete(path, handler)
		}

		return this
	}
	public handleController<S extends DBService<M>, M extends Model>(
		controller: Controller<M, S>
	): Router {
		this.handle({
			method: 'GET',
			handler: controller.getAll
		})
		this.handle({
			method: 'GET',
			handler: controller.get,
			params: 'id'
		})
		this.handle({
			method: 'POST',
			handler: controller.create
		})
		this.handle({
			method: 'PATCH',
			handler: controller.patch,
			params: 'id'
		})
		this.handle({
			method: 'DELETE',
			handler: controller.delete,
			params: 'id'
		})
		return this
	}

	public handleRouter(router: Router): Router {
		this.router.use(this.path, router.getExpressRouter())
		return this
	}

	public getExpressRouter(): ExpressRouter {
		return this.router
	}

	private get(path: PathParams, handler: RequestHandler): void {
		this.router.get(path, handler)
	}
	private post(path: PathParams, handler: RequestHandler): void {
		this.router.post(path, handler)
	}
	private patch(path: PathParams, handler: RequestHandler): void {
		this.router.patch(path, handler)
	}
	private delete(path: PathParams, handler: RequestHandler): void {
		this.router.delete(path, handler)
	}
}
