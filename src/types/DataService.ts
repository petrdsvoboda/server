import { Model, PartialModelObject } from 'objection'
import { Id } from './Id'

export interface DataService<T extends Model> {
	findAll(): Promise<T[]>
	findById(id: Id): Promise<T>
	create(data: PartialModelObject<T>): Promise<T>
	patch(data: PartialModelObject<T>): Promise<T>
	patchById(id: Id, data: PartialModelObject<T>): Promise<T>
	deleteById(id: Id): Promise<number>
}
