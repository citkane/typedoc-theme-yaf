const foo = ['bar'];

/**
 * An example object
 * @group childGroup
 */
export const reflection = {
	func() {
		console.log('a function');
	},
	/**
	 * A comment on a reflection child
	 *
	 * @group childGroup
	 * @returns
	 */
	func2: () => console.log('another function'),
	func3: <T>(a: T) => a,
	prop: 'Im a prop!',
	prop2: 2,
	prop3: foo[0],
	nested: {
		prop: 'Im a prop!',
		func() {
			console.log('a function');
		},
		reflection: {
			prop: 'Im a prop!',
		},
	},
};
