export interface foo {
	classOne: ClassOne;
}

/**
 * @version 0.0.1
 */
export class ClassOne {
	someProperty = 'prop';
	get some() {
		return this.someProperty;
	}
	set some(value: string) {
		this.someProperty = value;
	}
	someDeepReflections = {
		one: {
			two: {
				three: {
					foo: () => (this.some = 'some'),
					bar: this.some,
				},
			},
		},
	};
}

export class ClassTwo implements foo {
	classOne = new ClassOne();
}
