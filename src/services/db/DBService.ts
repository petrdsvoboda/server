import {
	Model,
	ModelClass,
	DeepPartialGraph,
	QueryBuilder,
	QueryBuilderYieldingCount
} from 'objection'

import { DBError, UndefinedError } from '../../models/Error'

export type Query<T extends Model> = QueryBuilder<T, T[], T[] | undefined>
export type QuerySingle<T extends Model> = QueryBuilder<T, T, T | undefined>
export type QueryNumber<T extends Model> = QueryBuilderYieldingCount<T, T[]>

export type ModifyFn<T extends Model> = (query: Query<T>) => void
export type ModifyFnSingle<T extends Model> = (query: QuerySingle<T>) => void

type Id = string | number
type Data<T> = DeepPartialGraph<T>

abstract class DBService<T extends Model> {
	protected readonly Model: ModelClass<T>

	constructor(modelClass: ModelClass<T>) {
		this.Model = modelClass
	}

	protected getQuery(query?: Query<T>): Query<T> {
		if (!query) query = this.Model.query()
		return query
	}

	protected async callQuery(query: Query<T>): Promise<T[] | undefined>
	protected async callQuery(query: QuerySingle<T>): Promise<T | undefined>
	protected async callQuery(
		query: QueryNumber<T>
	): Promise<number | undefined>
	protected async callQuery(
		query: Query<T> | QuerySingle<T> | QueryNumber<T>
	): Promise<T[] | T | number | undefined> {
		try {
			const data = await query
			return data
		} catch (err) {
			throw new DBError(err)
		}
	}

	protected validateUndefined(data: T | undefined | null): T
	protected validateUndefined(data: T[] | undefined | null): T[]
	protected validateUndefined(data: T | T[] | undefined | null): T | T[] {
		if (data === undefined || data === null) {
			throw new UndefinedError(Model.toString())
		} else {
			return data
		}
	}

	public async findAll(query?: Query<T>): Promise<T[]> {
		const _query = this.getQuery(query)
		let _data = await this.callQuery(_query)
		_data = this.validateUndefined(_data)

		return _data
	}

	public async findById(id: Id, query?: Query<T>): Promise<T> {
		const _query = this.getQuery(query).findById(id)
		let _data = await this.callQuery(_query)
		_data = this.validateUndefined(_data)

		return _data
	}

	public async create(createData: Data<T>, query?: Query<T>): Promise<T> {
		const _query = this.getQuery(query).insertGraphAndFetch(createData, {
			relate: true
		})
		let _data = await this.callQuery(_query)
		_data = this.validateUndefined(_data)

		return _data
	}

	public async patch(updateData: Data<T>, query?: Query<T>): Promise<T> {
		const _query = this.getQuery(query).upsertGraphAndFetch(updateData)
		let _data = await this.callQuery(_query)
		_data = this.validateUndefined(_data)

		return _data
	}

	public patchById(
		id: Id,
		updateData: Data<T>,
		query?: Query<T>
	): Promise<T> {
		return this.patch({ id, ...updateData }, query)
	}

	public async deleteById(id: Id, query?: Query<T>): Promise<void> {
		const _query = this.getQuery(query).deleteById(id)
		await this.callQuery(_query)
	}
}

export default DBService
