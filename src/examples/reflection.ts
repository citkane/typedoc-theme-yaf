const foo = ['bar'];

/**
 * An example object
 * @group Nested Reflection
 */
export const reflection = {
	func() {
		console.log('a function');
	},
	/**
	 * A comment on a reflection child
	 * @returns
	 */
	func2: () => console.log('another function'),
	func3: <T>(a: T) => a,
	prop: 'Im a prop!',
	prop2: 2,
	prop3: foo[0],
	nested: {
		/**
		 * A nested property
		 */
		nestedProp: 'Im a nested prop!',
		nestedFunc() {
			console.log('a function');
		},
		nestedReflection: {
			prop: 'Im a prop!',
		},
	},
};
