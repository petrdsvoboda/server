import { Model } from 'objection'

import DBService from '../DBService'

class TestModel extends Model {
	public static tableName = 'test'

	public constructor() {
		super()
		this.id = 1
		this.name = 'Test'
		this.is = true
	}

	public id: number
	public name: string
	public is: boolean
}

class ExtendableService extends DBService<TestModel> {
	constructor() {
		super(TestModel)
	}

	public async findById(): Promise<TestModel> {
		return new TestModel()
	}
}

describe('dbservice', () => {
	test('it should work be extendable', () => {
		const service = new ExtendableService()
		service.findById()
	})
})
