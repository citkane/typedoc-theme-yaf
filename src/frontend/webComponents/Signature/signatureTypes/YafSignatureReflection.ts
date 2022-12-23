import { YafSignatureReflection as ThisSignatureReflection } from '../../../../types/types';
import { JSONOutput } from 'typedoc';
import { YafSignatureTitle } from '../index.js';
import {
	makeSymbolSpan,
	makeNameSpan,
	renderSignatureType,
	makeElement,
} from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';
import { componentName } from '../../../../types/frontendTypes';

/**
 *
 */
export class YafSignatureReflection extends YafHTMLElement<JSONOutput.ReflectionType> {
	onConnect() {
		const { declaration } = this.props;
		const { factory } = YafSignatureReflection;
		const HTMLElementGroups: HTMLElement[][] = [];

		let i = 0;
		for (const child of declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				HTMLElementGroups.push(factory.getAndSetSignatures(child));
				continue;
			}
			if (child.getSignature) {
				HTMLElementGroups.push(factory.getSignature(child));
				continue;
			}
			if (child.setSignature) {
				HTMLElementGroups.push(factory.setSignature(child));
				continue;
			}
			if (child.signatures) {
				HTMLElementGroups.push(factory.signatures(child, i));
				continue;
			}
			HTMLElementGroups.push([
				makeNameSpan(!i ? child.name : `\n${child.name}`),
				makeSymbolSpan(child.flags.isOptional ? '?: ' : ': '),
				renderSignatureType(child.type, 'none'),
			]);
			i++;
		}

		if (declaration?.indexSignature) {
			const index = declaration.indexSignature;

			HTMLElementGroups.push([
				makeSymbolSpan('['),
				makeNameSpan(index.parameters![0].name),
				makeSymbolSpan(':'),
				renderSignatureType(index.parameters![0].type, 'none'),
				makeSymbolSpan(']'),
				makeSymbolSpan(':'),
				renderSignatureType(index.type, 'none'),
			]);
		}

		if (
			!HTMLElementGroups.length &&
			declaration?.signatures?.length === 1
		) {
			return this.appendChild(factory.signatureTitle(declaration));
		}
		if (declaration)
			HTMLElementGroups.push(
				factory.declarationSignatures(declaration).flat()
			);

		if (HTMLElementGroups.length) {
			const openBrace = makeSymbolSpan('{ ');
			const closeBrace = makeSymbolSpan('}');

			this.classList.add('block');
			this.parentElement?.insertBefore(openBrace, this);

			HTMLElementGroups.forEach((elements) => {
				const HTMLElements = factory.mapElementGroups(
					elements,
					this.tagName
				);
				this.appendChildren(HTMLElements.flat());
			});
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}
	}

	private static factory = {
		mapElementGroups: (elements: HTMLElement[], tagName: string) =>
			elements.map((element, i) => {
				const hasSemicolon =
					i === elements.length - 1 && element.tagName !== tagName;
				return [
					element,
					hasSemicolon ? makeSymbolSpan('; ') : undefined,
				];
			}),
		declarationSignatures: (
			declaration: JSONOutput.DeclarationReflection
		) =>
			declaration?.signatures?.map((signature) => [
				makeElement<YafSignatureTitle, YafSignatureTitle['props']>(
					'yaf-signature-title',
					null,
					null,
					{
						...(signature as ThisSignatureReflection),
						hideName: true,
					}
				),
			]) || [],
		signatureTitle: (declaration: JSONOutput.DeclarationReflection) =>
			makeElement<YafSignatureTitle, YafSignatureTitle['props']>(
				'yaf-signature-title',
				null,
				null,
				{
					...(declaration.signatures![0] as ThisSignatureReflection),
					hideName: true,
					arrowStyle: true,
				}
			),
		getAndSetSignatures: (child: JSONOutput.DeclarationReflection) => [
			makeNameSpan(child.name),
			makeSymbolSpan(': '),
			renderSignatureType(child.getSignature!.type, 'none'),
		],
		getSignature: (child: JSONOutput.DeclarationReflection) => [
			makeSymbolSpan('get '),
			makeNameSpan(child.name),
			makeSymbolSpan('(): '),
			renderSignatureType(child.getSignature!.type, 'none'),
		],
		setSignature: (child: JSONOutput.DeclarationReflection) => {
			const HTMLElements = [
				makeSymbolSpan('set '),
				makeNameSpan(child.name),
				makeSymbolSpan('('),
			];
			child.setSignature!.parameters?.forEach((parameter) => {
				HTMLElements.push(makeNameSpan(parameter.name));
				HTMLElements.push(renderSignatureType(parameter.type, 'none'));
			});
			HTMLElements.push(makeSymbolSpan(')'));

			return HTMLElements;
		},
		signatures: (child: JSONOutput.DeclarationReflection, i: number) => {
			return (child.signatures as ThisSignatureReflection[])
				.map((signature) => {
					return [
						makeNameSpan(!i ? child.name : `\n${child.name}`),
						makeSymbolSpan(child.flags.isOptional ? '?: ' : ': '),
						makeElement<
							YafSignatureTitle,
							YafSignatureTitle['props']
						>('yaf-signature-title', null, null, {
							...signature,
							hideName: true,
							arrowStyle: false,
						}),
					];
				})
				.flat();
		},
	};
}
const yafSignatureReflection: componentName = 'yaf-signature-reflection';
customElements.define(yafSignatureReflection, YafSignatureReflection);
