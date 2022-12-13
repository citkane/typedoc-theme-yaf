import { componentName } from '../../../../types/frontendTypes.js';
import yafElement from '../../../YafElement.js';
import { JSONOutput } from 'typedoc';
import { YafSignatureTitle } from '../index.js';

/**
 *
 */
export class YafSignatureReflection extends HTMLElement {
	props!: JSONOutput.ReflectionType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		yafElement.needsParenthesis(this) &&
			this.appendChild(yafElement.makeSymbolSpan('('));
		const members: Element[][] = [];

		let i = 0;
		for (const child of this.props.declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				members.push([
					yafElement.makeNameSpan(child.name),
					yafElement.makeSymbolSpan(': '),
					yafElement.renderSignatureType(
						child.getSignature.type,
						'none'
					),
				]);
				continue;
			}
			if (child.getSignature) {
				members.push([
					yafElement.makeSymbolSpan('get '),
					yafElement.makeNameSpan(child.name),
					yafElement.makeSymbolSpan('(): '),
					yafElement.renderSignatureType(
						child.getSignature.type,
						'none'
					),
				]);
				continue;
			}
			if (child.setSignature) {
				const spans = [];
				spans.push(yafElement.makeSymbolSpan('set '));
				spans.push(yafElement.makeNameSpan(child.name));
				spans.push(yafElement.makeSymbolSpan('('));
				child.setSignature.parameters?.forEach((parameter) => {
					spans.push(yafElement.makeNameSpan(parameter.name));
					spans.push(
						yafElement.renderSignatureType(parameter.type, 'none')
					);
				});
				continue;
			}

			members.push([
				yafElement.makeElement(
					'span',
					'name',
					!i ? child.name : `\n${child.name}`
				),
				yafElement.makeSymbolSpan(
					child.flags.isOptional ? '?: ' : ': '
				),
				yafElement.renderSignatureType(child.type, 'none'),
			]);
			i++;
		}

		if (this.props.declaration?.indexSignature) {
			const index = this.props.declaration.indexSignature;

			members.push([
				yafElement.makeSymbolSpan('['),
				yafElement.makeNameSpan(index.parameters![0].name),
				yafElement.makeSymbolSpan(':'),
				yafElement.renderSignatureType(
					index.parameters![0].type,
					'none'
				),
				yafElement.makeSymbolSpan(']'),
				yafElement.makeSymbolSpan(':'),
				yafElement.renderSignatureType(index.type, 'none'),
			]);
		}

		if (
			!members.length &&
			this.props.declaration?.signatures?.length === 1
		) {
			const title = yafElement.makeElement<YafSignatureTitle>(
				'yaf-signature-title'
			);

			title.props = {
				...this.props.declaration.signatures[0],
				hideName: true,
				arrowStyle: true,
			};

			this.appendChild(title);
			return;
		}

		for (const signature of this.props.declaration?.signatures || []) {
			const title = yafElement.makeElement<YafSignatureTitle>(
				'yaf-signature-title'
			);
			title.props = {
				...signature,
				hideName: true,
			};
			members.push([title]);
		}

		if (members.length) {
			this.classList.add('block');
			const openBrace = yafElement.makeSymbolSpan('{ ');
			this.parentElement?.insertBefore(openBrace, this);
			members.forEach((memberArray) => {
				memberArray.forEach((member, i) => {
					this.appendChild(member);
					if (
						i === memberArray.length - 1 &&
						member.tagName !== this.tagName
					) {
						this.appendChild(yafElement.makeSymbolSpan('; '));
					}
				});
			});
			const closeBrace = yafElement.makeSymbolSpan('}');
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}
		yafElement.needsParenthesis(this) &&
			this.appendChild(yafElement.makeSymbolSpan(')'));
	}
}
const componentName: componentName = 'yaf-signature-reflection';
customElements.define(componentName, YafSignatureReflection);
