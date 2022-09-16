import { componentName } from '../types';
import { YAFElement } from '../lib/YafElement.js';
import { JSONOutput } from 'typedoc';

const componentName: componentName = 'yaf-content-signature-reflection';
/**
 *
 * @todo
 * - getSig, setSig types
 * - props
 * - props declarations
 */
export class YafContentSignatureReflection extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <JSONOutput.ReflectionType>this.props;
	connectedCallback() {
		const newElement = this.makeElement(`<span class="signature" />`);
		this.needsParenthesis() && this.appendSpanTo('(', 'symbol', newElement);
		const members: Element[][] = [];
		for (const child of this.props.declaration?.children || []) {
			if (child.getSignature && child.setSignature) {
				console.log(child);
				continue;
			}
			if (child.getSignature) {
				console.log(child);
				continue;
			}
			if (child.setSignature) {
				console.log(child);
				continue;
			}
			members.push([
				this.makeElement(`<span class="name">${child.name}</span>`),
				this.makeSpan(child.flags.isOptional ? '?: ' : ': ', 'symbol'),
				this.makeSignature(child.type, 'none'),
			]);
		}
		if (this.props.declaration?.indexSignature) {
			console.log(this.props);
		}
		if (
			!members.length &&
			this.props.declaration?.signatures?.length === 1
		) {
			console.log(this.props);
			return;
		}
		for (const sig of this.props.declaration?.signatures || []) {
			console.log(sig);
		}
		if (members.length) {
			const openBrace = this.makeSpan('{ ', 'symbol');
			this.parentElement?.insertBefore(openBrace, this);
			members.forEach((memberArray, i) => {
				memberArray.forEach((member, i) => {
					newElement.appendChild(member);
					if (
						i === memberArray.length - 1 &&
						member.tagName !== this.tagName
					) {
						this.appendSpanTo('; ', 'symbol', newElement);
					}
				});
				//const lastChild = newElement.lastChild;
				//console.log(lastChild);
				//i < members.length &&
				//lastChild &&
				//this.appendSpanTo('; ', 'symbol', newElement);
			});
			const closeBrace = this.makeSpan('} ', 'symbol nl');
			this.parentElement?.insertBefore(closeBrace, this.nextSibling);
		}

		this.needsParenthesis() && this.appendSpanTo(')', 'symbol', newElement);
		this.parentElement?.replaceChild(newElement, this);
	}
}
customElements.define(componentName, YafContentSignatureReflection);
