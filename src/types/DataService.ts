import { DeepPartial } from './DeepPartial'
import { Id } from './Id'

export interface DataService<T> {
	findAll(): Promise<T[] | undefined>
	findById(id: Id): Promise<T | undefined>
	create(data: DeepPartial<T>): Promise<T | undefined>
	patch(data: DeepPartial<T>): Promise<T | undefined>
	patchById(id: Id, data: DeepPartial<T>): Promise<T | undefined>
	deleteById(id: Id): Promise<void>
}
