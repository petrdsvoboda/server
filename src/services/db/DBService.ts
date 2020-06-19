import {
	Model,
	ModelClass,
	NumberQueryBuilder,
	PartialModelObject,
	QueryBuilderType,
	SingleQueryBuilder
} from 'objection'
import { DBError, UndefinedError } from '../../models/Error'
import { DataService } from '../../types/DataService'
import { Id } from '../../types/Id'
import QueryService, { Binding } from './QueryService'

export type Query<M extends Model> = QueryBuilderType<M>
export type QuerySingle<M extends Model> = SingleQueryBuilder<
	QueryBuilderType<M>
>
export type QueryNumber<M extends Model> = NumberQueryBuilder<
	QueryBuilderType<M>
>
export type DBQuery<M extends Model> =
	| Query<M>
	| QuerySingle<M>
	| QueryNumber<M>

abstract class DBService<
	M extends Model,
	Q extends QueryService<M> = QueryService<M>
> implements DataService<M> {
	constructor(protected queryService: Q) {}

	static fromModel<M extends Model>(
		this: {
			new (queryService: QueryService<M>): DBService<M, QueryService<M>>
		},
		model: ModelClass<M>,
		binding?: Binding<M>
	): DBService<M, QueryService<M>> {
		return new this(new QueryService<M>(model, binding))
	}

	protected validate(data: M[] | M | number | null): M[] | M | number {
		if (data === null) {
			throw new UndefinedError(Model.toString())
		} else {
			return data
		}
	}

	protected async callQuery(query: Query<M>): Promise<M[]>
	protected async callQuery(query: QuerySingle<M>): Promise<M>
	protected async callQuery(query: QueryNumber<M>): Promise<number>
	protected async callQuery(query: DBQuery<M>): Promise<M[] | M | number> {
		let data: M[] | M | number | null
		try {
			data = (await query) as M[] | M | number | null
		} catch (err) {
			throw new DBError(err)
		}
		return this.validate(data)
	}

	public async findAll(): Promise<M[]> {
		return await this.callQuery(this.queryService.query())
	}

	public async findById(id: Id): Promise<M> {
		return await this.callQuery(this.queryService.findById(id))
	}

	public async create(inputData: PartialModelObject<M>): Promise<M> {
		return await this.callQuery(this.queryService.insert(inputData))
	}

	public async patch(inputData: PartialModelObject<M>): Promise<M> {
		return await this.callQuery(this.queryService.upsert(inputData))
	}

	public async patchById(
		id: Id,
		inputData: PartialModelObject<M>
	): Promise<M> {
		return await this.callQuery(this.queryService.upsertById(id, inputData))
	}

	public async deleteById(id: Id): Promise<number> {
		return await this.callQuery(this.queryService.deleteById(id))
	}
}

export default DBService
