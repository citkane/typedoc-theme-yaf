//export * from './functions';
//export * from './variables';
//export * from './types';
//export * from './classes';
//export * from './enums';
//export * from './reexports';
//export * from './showcase';
//export * from "./reactComponents";
//export * from './internals';

export type here = string;
const here = 'here';
export type indexedElement = { foo: 'foo'; bar: 1 };

export type templateLiteralElement = `${here}`;
export type arrayElement = here[];
export type indexedAccessElement = indexedElement[keyof indexedElement];
export type conditionalCheck = here extends 1 ? 2 : 3;
export type conditionalExtends = 1 extends here ? 2 : 3;
export type conditionalTrue = 1 extends 2 ? here : 3;
export type conditionalFalse = 1 extends 2 ? 3 : here;

export type typeOperatorTarget = keyof indexedElement;
