import { Model, PartialModelObject } from 'objection'
import { DataService } from '../../types/DataService'
import { Id } from '../../types/Id'

interface CacheOptions {
	reloadTime?: number
}

abstract class CacheService<T extends Model> implements DataService<T> {
	protected readonly service: DataService<T>
	private readonly reloadTime: number = 60 * 30

	private items: T[] = []

	constructor(service: DataService<T>, options?: CacheOptions) {
		this.service = service

		if (options) {
			if (options.reloadTime) {
				this.reloadTime = options.reloadTime
			}
		}

		this.initialCache()
	}

	public initialCache(): void {
		this.reloadItems()

		setTimeout(this.reloadItems, 1000 * this.reloadTime)
	}

	public async findAll(): Promise<T[]> {
		return this.items
	}
	public async findById(id: Id): Promise<T> {
		return this.items[typeof id === 'string' ? parseInt(id) : id]
	}
	public async create(data: PartialModelObject<T>): Promise<T> {
		this.items[0] = (data as any) as T
		return this.items[0]
	}
	public async patch(data: PartialModelObject<T>): Promise<T> {
		this.items[0] = (data as any) as T
		return this.items[0]
	}
	public async patchById(id: Id, data: PartialModelObject<T>): Promise<T> {
		return this.patch({ id: id, ...data })
	}
	public async deleteById(id: Id): Promise<number> {
		return this.deleteById(id)
	}
	public async PartialModelObject(id: Id): Promise<void> {
		this.items[
			typeof id === 'string' ? parseInt(id) : id
		] = (undefined as unknown) as T
	}

	protected async reloadItems(): Promise<void> {
		try {
			const items = await this.service.findAll()
			this.items = items
		} catch (err) {
			console.log(err)
		}
	}
}

export default CacheService
