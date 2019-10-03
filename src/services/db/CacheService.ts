import { Model } from 'objection'

import DBService from './DBService'

interface CacheOptions {
	reloadTime?: number
}

abstract class CacheService<T extends DBService<U>, U extends Model> {
	protected readonly service: T
	private readonly reloadTime: number = 60 * 30

	private items: U[] = []

	constructor(service: T, options?: CacheOptions) {
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

	public getItems(): U[] {
		return this.items
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
