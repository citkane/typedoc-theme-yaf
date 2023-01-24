export interface foo {
	classOne: ClassOne;
}

export default class ClassOne {
	someProperty = 'prop';
}

export class ClassTwo implements foo {
	classOne = new ClassOne();
}
