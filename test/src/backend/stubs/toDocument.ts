/**
 * A test sample file to create some stub documentation
 * @module stub
 */

/**
 * A stub type
 */
export type stubType = 'stub';
/**
 * A stub class constructor
 */
export class StubClass {
	foo: string;
	constructor() {
		this.foo = 'string';
	}
	bar() {
		return this.foo;
	}
}

/**
 * A stub function
 * @param foo
 * @param bar
 * @returns
 */
export function stubFunction(foo: string, bar: string) {
	return foo + bar;
}
