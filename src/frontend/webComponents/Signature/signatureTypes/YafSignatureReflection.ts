import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { YafSignatureTitle } from '../index.js';
import yafElement from '../../../yafElement.js';
const {
	debounce,
	makeSymbolSpan,
	makeNameSpan,
	renderSignatureType,
	makeElement,
} = yafElement;

/**
 *
 */
export class YafSignatureReflection extends HTMLElement {
	props!: JSONOutput.ReflectionType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { declaration } = this.props;
		const HTMLElementGroups = [];

		let i = 0;
		for (const child of declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				HTMLElementGroups.push([
					makeNameSpan(child.name),
					makeSymbolSpan(': '),
					renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.getSignature) {
				HTMLElementGroups.push([
					makeSymbolSpan('get '),
					makeNameSpan(child.name),
					makeSymbolSpan('(): '),
					renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.setSignature) {
				const elements = [
					makeSymbolSpan('set '),
					makeNameSpan(child.name),
					makeSymbolSpan('('),
				];
				child.setSignature.parameters?.forEach((parameter) => {
					elements.push(makeNameSpan(parameter.name));
					elements.push(renderSignatureType(parameter.type, 'none'));
				});
				elements.push(makeSymbolSpan(')'));
				HTMLElementGroups.push(elements);
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
			return this.appendChild(
				makeElement<YafSignatureTitle, YafSignatureTitle['props']>(
					'yaf-signature-title',
					null,
					null,
					{
						...declaration.signatures[0],
						hideName: true,
						arrowStyle: true,
					}
				)
			);
		}

		for (const signature of declaration?.signatures || []) {
			HTMLElementGroups.push([
				makeElement<YafSignatureTitle, YafSignatureTitle['props']>(
					'yaf-signature-title',
					null,
					null,
					{
						...signature,
						hideName: true,
					}
				),
			]);
		}

		if (HTMLElementGroups.length) {
			const openBrace = makeSymbolSpan('{ ');
			const closeBrace = makeSymbolSpan('}');

			this.classList.add('block');

			this.parentElement?.insertBefore(openBrace, this);
			HTMLElementGroups.forEach((HTMLElements) => {
				HTMLElements.forEach((element, i) => {
					this.appendChild(element);
					if (
						i === HTMLElements.length - 1 &&
						element.tagName !== this.tagName
					) {
						this.appendChild(makeSymbolSpan('; '));
					}
				});
			});
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}
	}
}
const componentName: componentName = 'yaf-signature-reflection';
customElements.define(componentName, YafSignatureReflection);
