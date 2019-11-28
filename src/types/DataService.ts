import { DeepPartial } from './DeepPartial'
import { Id } from './Id'

export interface DataService<T> {
	findAll(): Promise<T[]>
	findById(id: Id): Promise<T>
	create(data: DeepPartial<T>): Promise<T>
	patch(data: DeepPartial<T>): Promise<T>
	patchById(id: Id, data: DeepPartial<T>): Promise<T>
	deleteById(id: Id): Promise<void>
}
