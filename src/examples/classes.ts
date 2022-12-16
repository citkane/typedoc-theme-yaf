export default class ClassOne {
	someProperty = 'prop';
}

export class ClassTwo {
	classOne = new ClassOne();
}
