import { Router as ExpressRouter } from 'express'
import { PathParams, RequestHandler } from 'express-serve-static-core'

import Controller from './controller'
import { Serializable } from './types/Serializable'

type HandlerOptions = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
	handler: RequestHandler
	params?: string | string[]
	action?: string
}

export default class Router {
	private router: ExpressRouter
	private path: string

	constructor(path: string) {
		this.router = ExpressRouter()
		this.path = '/' + path
	}

	public handle(options: HandlerOptions): void {
		const { method, handler, params, action } = options
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

		if (method === 'GET') {
			this.get(path, handler)
		} else if (method === 'POST') {
			this.post(path, handler)
		} else if (method === 'PATCH') {
			this.patch(path, handler)
		} else if (method === 'DELETE') {
			this.delete(path, handler)
		}
	}

	public getRouter(): ExpressRouter {
		return this.router
	}

	public handleController<T extends Serializable>(
		controller: Controller<T>
	): void {
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
