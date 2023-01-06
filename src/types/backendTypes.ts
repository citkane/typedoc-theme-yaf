import {
	DeclarationReflection,
	ProjectReflection,
	ReferenceReflection,
	Reflection,
	SignatureReflection,
} from 'typedoc';
import { htmlString } from './types';

export interface highlighter {
	toHtml: (hast: object) => htmlString;
	flagToScope: (lang: string) => string;
	highlight: (text: string, scope: string) => object;
}

export type dataLocation = {
	hash: string;
	query: string;
};

export interface serialiserReflection extends Reflection {
	version?: DeclarationReflection['version'];
	typeHierarchy?: DeclarationReflection['typeHierarchy'];
	readme?: ProjectReflection['readme'];
	type?:
		| DeclarationReflection['type']
		| SignatureReflection['type']
		| ReferenceReflection['type'];
	children?: DeclarationReflection['children'];
	signatures?: DeclarationReflection['signatures'];
}
