// import { schema } from 'normalizr'
// import { DataService } from '../../types/DataService'
// import Controller from '../Controller'

// const itemSchema = new schema.Entity('item')
// class Item {
// 	public id: string

// 	constructor(id: string) {
// 		this.id = id
// 	}

// 	public toJSON(): object {
// 		return this
// 	}
// }

// class TestService implements DataService<Item> {
// 	private items: Item[] = [new Item('first'), new Item('second')]

// 	public async findAll(): Promise<Item[]> {
// 		return this.items
// 	}
// 	public async findById(id: string): Promise<Item> {
// 		return this.items.find(i => i.id === id) as Item
// 	}
// 	public async create(data: Item): Promise<Item> {
// 		this.items.push(data)
// 		return data
// 	}
// 	public async patch(data: Item): Promise<Item> {
// 		this.items.find(i => i.id === data.id)
// 		return data
// 	}
// 	public async patchById(id: string, data: Item): Promise<Item> {
// 		this.items.find(i => i.id === id)
// 		return data
// 	}
// 	public async deleteById(id: string): Promise<void> {
// 		this.items.map(i => i.id !== id)
// 	}

// 	private async simulateTimeout(): Promise<void> {
// 		return new Promise(function(resolve): void {
// 			setTimeout(resolve, 1000)
// 		})
// 	}
// }

// class TestController extends Controller<TestService, Item> {}

// const service = new TestService()

// describe('Controller', () => {
// 	test('it can be created', () => {
// 		new TestController(service, itemSchema)
// 	})

// 	test('it should handle getAll', () => {})
// })

test('tmp', () => {})
