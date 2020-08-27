import * as Knex from 'knex'
import {
	Model,
	ModelClass,
	NumberQueryBuilder,
	PartialModelObject,
	QueryBuilder,
	QueryBuilderType,
	SingleQueryBuilder,
	Transaction
} from 'objection'
import { Id } from '../../types/Id'

export type Query<T extends Model> = QueryBuilder<T, T[]>
export type QuerySingle<T extends Model> = QueryBuilder<T, T>
export type QueryNumber<T extends Model> = QueryBuilder<T, number>
export type DBQuery<T extends Model> =
	| Query<T>
	| QuerySingle<T>
	| QueryNumber<T>

export type Binding = Transaction | Knex<any, any> | undefined

class QueryService<T extends Model> {
	constructor(private model: ModelClass<T>, private binding?: Binding) {}

	public query(binding?: Binding): QueryBuilderType<T> {
		return this.model.query(this.binding ?? binding)
	}

	public findById(
		id: Id,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.model.query(this.binding ?? binding).findById(id)
	}

	public insert(
		data: PartialModelObject<T>,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.model
			.query(this.binding ?? binding)
			.insertGraphAndFetch(data, {
				relate: true
			})
	}

	public upsert(
		data: PartialModelObject<T>,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.model
			.query(this.binding ?? binding)
			.upsertGraphAndFetch(data, {
				relate: true
			})
	}

	public upsertById(
		id: Id,
		data: PartialModelObject<T>,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.upsert({ id, ...data }, this.binding ?? binding)
	}

	public patch(
		data: PartialModelObject<T>,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.model.query(this.binding ?? binding).patchAndFetch(data)
	}

	public patchById(
		id: Id,
		data: PartialModelObject<T>,
		binding?: Binding
	): SingleQueryBuilder<QueryBuilderType<T>> {
		return this.model
			.query(this.binding ?? binding)
			.patchAndFetchById(id, data)
	}

	public deleteById(
		id: Id,
		binding?: Binding
	): NumberQueryBuilder<QueryBuilderType<T>> {
		return this.model.query(this.binding ?? binding).deleteById(id)
	}
}

export default QueryService
