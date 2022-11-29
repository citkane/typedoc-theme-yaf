import { componentName } from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';
import { YafSignatureTitle } from '../YafSignatureTitle.js';

/**
 *
 */
export class YafSignatureReflection extends YafElement {
	props!: JSONOutput.ReflectionType;

	constructor() {
		super(componentName);
	}

	connectedCallback() {
		if (this.debounce()) return;
		this.needsParenthesis() && this.appendChild(this.makeSymbolSpan('('));
		const members: Element[][] = [];

		let i = 0;
		for (const child of this.props.declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				members.push([
					this.makeNameSpan(child.name),
					this.makeSymbolSpan(': '),
					this.renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.getSignature) {
				members.push([
					this.makeSymbolSpan('get '),
					this.makeNameSpan(child.name),
					this.makeSymbolSpan('(): '),
					this.renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.setSignature) {
				const spans = [];
				spans.push(this.makeSymbolSpan('set '));
				spans.push(this.makeNameSpan(child.name));
				spans.push(this.makeSymbolSpan('('));
				child.setSignature.parameters?.forEach((parameter) => {
					spans.push(this.makeNameSpan(parameter.name));
					spans.push(
						this.renderSignatureType(parameter.type, 'none')
					);
				});
				continue;
			}

			members.push([
				this.makeElement(
					'span',
					'name',
					!i ? child.name : `\n${child.name}`
				),
				this.makeSymbolSpan(child.flags.isOptional ? '?: ' : ': '),
				this.renderSignatureType(child.type, 'none'),
			]);
			i++;
		}

		if (this.props.declaration?.indexSignature) {
			const index = this.props.declaration.indexSignature;

			members.push([
				this.makeSymbolSpan('['),
				this.makeNameSpan(index.parameters![0].name),
				this.makeSymbolSpan(':'),
				this.renderSignatureType(index.parameters![0].type, 'none'),
				this.makeSymbolSpan(']'),
				this.makeSymbolSpan(':'),
				this.renderSignatureType(index.type, 'none'),
			]);
		}

		if (
			!members.length &&
			this.props.declaration?.signatures?.length === 1
		) {
			const title = this.makeElement<YafSignatureTitle>(
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
			const title = this.makeElement<YafSignatureTitle>(
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
			const openBrace = this.makeSymbolSpan('{ ');
			this.parentElement?.insertBefore(openBrace, this);
			members.forEach((memberArray) => {
				memberArray.forEach((member, i) => {
					this.appendChild(member);
					if (
						i === memberArray.length - 1 &&
						member.tagName !== this.tagName
					) {
						this.appendChild(this.makeSymbolSpan('; '));
					}
				});
			});
			const closeBrace = this.makeSymbolSpan('}');
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}
		this.needsParenthesis() && this.appendChild(this.makeSymbolSpan(')'));
	}
}
const componentName: componentName = 'yaf-signature-reflection';
customElements.define(componentName, YafSignatureReflection);
