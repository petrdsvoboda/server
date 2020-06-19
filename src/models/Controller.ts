import { Request, Response } from 'express'
import { normalize, NormalizedSchema, schema } from 'normalizr'
import { Model, PartialModelObject } from 'objection'
import DBService from '../services/db/DBService'
import QueryService from '../services/db/QueryService'
import { Id } from '../types/Id'

export { Request, Response }

export default abstract class Controller<
	M extends Model,
	S extends DBService<M, Q> = DBService<M, any>,
	Q extends QueryService<M> = QueryService<M>
> {
	protected service: S
	protected schema: schema.Entity
	protected arraySchema: schema.Array

	constructor(service: S, normalizrSchema: schema.Entity) {
		this.service = service
		this.schema = normalizrSchema
		this.arraySchema = new schema.Array(normalizrSchema)
	}

	public getAll = async (_: Request, response: Response): Promise<void> => {
		try {
			const data = await this.service.findAll()
			// const normalizedData = this.normalize(data)
			response.send(data)
		} catch (err) {
			console.log(err)
			response.status(404).send(err)
		}
	}

	public async get(request: Request, response: Response): Promise<Response> {
		const params = request.params as { id: string }
		const id = parseInt(params.id, 10)

		try {
			const data = await this.service.findById(id)
			// const normalizedData = this.normalize(data)
			return response.send(data)
		} catch (err) {
			console.log(err)
			return response.status(404).send(err)
		}
	}

	public async create(
		request: Request,
		response: Response
	): Promise<Response> {
		const body = request.body as PartialModelObject<M>
		try {
			const data = await this.service.create(body)
			// const normalizedData = this.normalize(data)
			return response.send(data)
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
		const body = request.body as PartialModelObject<M>

		try {
			const data = await this.service.patch({ id, ...body })
			// const normalizedData = this.normalize(data)
			return response.send(data)
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

	protected normalize(data: M): NormalizedSchema<M, Id>
	protected normalize(data: M[]): NormalizedSchema<M, Id[]>
	protected normalize(data: M | M[]): NormalizedSchema<M, Id | Id[]> {
		if (Array.isArray(data)) {
			return normalize(
				data.map(i => i.toJSON() as M),
				this.arraySchema
			)
		} else {
			return normalize(data.toJSON(), this.schema)
		}
	}
}
