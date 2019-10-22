import { Request, Response } from 'express'
import { normalize, schema, NormalizedSchema } from 'normalizr'

import { UndefinedError } from '../models/Error'
import { DataService } from '../types/DataService'
import { DeepPartial } from '../types/DeepPartial'
import { Id } from '../types/Id'
import { Serializable } from '../types/Serializable'

export { Request, Response }

export default abstract class Controller<T extends Serializable> {
	protected service: DataService<T>
	protected schema: schema.Entity
	protected arraySchema: schema.Array

	constructor(service: DataService<T>, normalizrSchema: schema.Entity) {
		this.service = service
		this.schema = normalizrSchema
		this.arraySchema = new schema.Array(normalizrSchema)
	}

	public async getAll(_: Request, response: Response): Promise<Response> {
		try {
			const data = await this.service.findAll()
			if (data === undefined) {
				throw new UndefinedError('getAll')
			}
			const normalizedData = this.normalize(data)
			return response.send(normalizedData)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	public async get(request: Request, response: Response): Promise<Response> {
		const params = request.params as { id: string }
		const id = parseInt(params.id, 10)

		try {
			const data = await this.service.findById(id)
			if (data === undefined) {
				throw new UndefinedError('get')
			}
			const normalizedData = this.normalize(data)
			return response.send(normalizedData)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	public async create(
		request: Request,
		response: Response
	): Promise<Response> {
		const body = request.body as DeepPartial<T>
		try {
			const data = await this.service.create(body)
			if (data === undefined) {
				throw new UndefinedError('create')
			}
			const normalizedData = this.normalize(data)
			return response.send(normalizedData)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	public async patch(
		request: Request,
		response: Response
	): Promise<Response> {
		const params = request.params as { id: string }
		const id = parseInt(params.id, 10)
		const body = request.body as DeepPartial<T>

		try {
			const data = await this.service.patch({ id, ...body })
			if (data === undefined) {
				throw new UndefinedError('patch')
			}
			const normalizedData = this.normalize(data)
			return response.send(normalizedData)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	public async delete(
		request: Request,
		response: Response
	): Promise<Response> {
		const params = request.params as { id: string }
		const id = parseInt(params.id, 10)

		try {
			await this.service.deleteById(id)
			return response.sendStatus(204)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	protected normalize(data: T): NormalizedSchema<T, Id>
	protected normalize(data: T[]): NormalizedSchema<T, Id[]>
	protected normalize(data: T | T[]): NormalizedSchema<T, Id | Id[]> {
		if (Array.isArray(data)) {
			return normalize(data.map(i => i.toJSON() as T), this.arraySchema)
		} else {
			return normalize(data.toJSON(), this.schema)
		}
	}
}
