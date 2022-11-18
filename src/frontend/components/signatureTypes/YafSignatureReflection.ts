import { componentName } from '../../types.js';
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
		this.needsParenthesis() &&
			this.appendChild(this.makeSpan('(', 'symbol'));
		const members: Element[][] = [];

		let i = 0;
		for (const child of this.props.declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				members.push([
					this.makeSpan(child.name, 'name'),
					this.makeSpan(': ', 'symbol'),
					this.renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.getSignature) {
				members.push([
					this.makeSpan('get ', 'symbol'),
					this.makeSpan(child.name, 'name'),
					this.makeSpan('(): ', 'symbol'),
					this.renderSignatureType(child.getSignature.type, 'none'),
				]);
				continue;
			}
			if (child.setSignature) {
				const spans = [];
				spans.push(this.makeSpan('set ', 'symbol'));
				spans.push(this.makeSpan(child.name, 'name'));
				spans.push(this.makeSpan('(', 'symbol'));
				child.setSignature.parameters?.forEach((parameter) => {
					spans.push(this.makeSpan(parameter.name, 'name'));
					spans.push(
						this.renderSignatureType(parameter.type, 'none')
					);
				});
				continue;
			}

			members.push([
				this.makeSpan(!i ? child.name : `\n${child.name}`, 'name'),
				this.makeSpan(child.flags.isOptional ? '?: ' : ': ', 'symbol'),
				this.renderSignatureType(child.type, 'none'),
			]);
			i++;
		}

		if (this.props.declaration?.indexSignature) {
			const index = this.props.declaration.indexSignature;

			members.push([
				this.makeSpan('[', 'symbol'),
				this.makeSpan(index.parameters![0].name, 'name'),
				this.makeSpan(':', 'symbol'),
				this.renderSignatureType(index.parameters![0].type, 'none'),
				this.makeSpan(']', 'symbol'),
				this.makeSpan(':', 'symbol'),
				this.renderSignatureType(index.type, 'none'),
			]);
		}

		if (
			!members.length &&
			this.props.declaration?.signatures?.length === 1
		) {
			const title: YafSignatureTitle = this.makeElement(
				'<yaf-signature-title />'
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
			const title: YafSignatureTitle = this.makeElement(
				'<yaf-signature-title />'
			);
			title.props = {
				...signature,
				hideName: true,
			};
			members.push([title]);
		}

		if (members.length) {
			this.classList.add('block');
			const openBrace = this.makeSpan('{ ', 'symbol');
			this.parentElement?.insertBefore(openBrace, this);
			members.forEach((memberArray) => {
				memberArray.forEach((member, i) => {
					this.appendChild(member);
					if (
						i === memberArray.length - 1 &&
						member.tagName !== this.tagName
					) {
						this.appendChild(this.makeSpan('; ', 'symbol'));
					}
				});
			});
			const closeBrace = this.makeSpan('}', 'symbol');
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}
		this.needsParenthesis() &&
			this.appendChild(this.makeSpan(')', 'symbol'));
	}
}
const componentName: componentName = 'yaf-signature-reflection';
customElements.define(componentName, YafSignatureReflection);
