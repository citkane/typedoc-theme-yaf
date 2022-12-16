/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
//export * from './functions';
//export * from './variables';
//export * from './types';
//export * from './classes';
//export * from './enums';
//export * from './reexports';
//export * from './showcase';
//export * from "./reactComponents";
//export * from './internals';

export namespace NamespaceA {
	export interface InterfaceA {}
	//export type renamedInterfaceA =  InterfaceA; // WA to typedoc v0.15
}
export namespace NamespaceB {
	export interface InterfaceA {}
}
export namespace NamespaceC {
	export import renamedInterfaceA = NamespaceA.InterfaceA;
	export import InterfaceA = NamespaceB.InterfaceA;

	export class TestClass {
		testMethod1(options: renamedInterfaceA): any {}
		testMethod2(options: InterfaceA): any {}
	}
}

export const here = 'here';
export interface indexedElement {
	foo: 'foo';
	bar: 1;
	here: 2;
}
export const tupleElement: tupleElement = ['one', 'two', 3, 4];

export type stringElement = string;
export type templateLiteralElement = `${stringElement} and ${stringElement}`;
export type arrayElement = stringElement[];
export type indexedAccessElement = indexedElement[keyof indexedElement];
export type conditionalCheck = stringElement extends 1 ? 2 : 3;
export type conditionalExtends = 1 extends stringElement ? 2 : 3;
export type conditionalTrue = 1 extends 2 ? stringElement : 3;
export type conditionalFalse = 1 extends 2 ? 3 : stringElement;
export type indexedIndex = { foo: 'foo' }['foo'];
export type indexedObject = indexedElement[indexedIndex];
export type inferredConstraint<T> = T extends Promise<infer R> ? R : T;
export type intersectionElement = stringElement & 1;
export type mappedName = { [k in tupleElement as string]: 1 };
export type mappedParameter = { [k in stringElement]: 1 };
export type mappedTemplate = { [k in string]: stringElement };
export type optionalElement = [stringElement?];
export declare function predicateTarget(X: unknown): asserts X is string;
export type queryTypeTarget = typeof here;
export type typeOperatorTarget = keyof indexedElement;
export declare function referenceTypeArgument<X>(arg: X): void;
export type restElement = [...arrayElement];
export type tupleElement = readonly [
	start: string,
	second: string,
	third?: number,
	fourth?: number
];
export type unionElement = stringElement | 1;
