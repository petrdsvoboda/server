export class ConfigError extends Error {
	constructor(msg: string) {
		super('ConfigError: ' + msg + ' is undefined')
	}
}

export class DBError extends Error {
	constructor(msg: string) {
		super('DBError: ' + msg)
	}
}

export class UndefinedError extends Error {
	constructor(value: string) {
		super('UndefinedError: ' + value)
	}
}
