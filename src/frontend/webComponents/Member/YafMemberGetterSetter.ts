import { YAFDataObject, YafSignatureReflection } from '../../../types/types.js';
import { YafSignatureBody, YafSignatureTitle } from '../Signature';
import { makeElement, makeSymbolSpan, makeNameSpan } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { componentName } from '../../../types/frontendTypes.js';

export class YafMemberGetterSetter extends YafHTMLElement<YAFDataObject> {
	onConnect() {
		const { getSignature, setSignature } = this.props;
		const { factory } = YafMemberGetterSetter;

		if (getSignature) {
			const wrapperHTMLElement = makeElement('div', 'wrapper');
			wrapperHTMLElement.appendChildren([
				factory.makeSignature('get', getSignature),
				factory.makeBody(getSignature),
			]);

			this.appendChild(wrapperHTMLElement);
		}

		if (setSignature) {
			const wrapperHTMLElement = makeElement('div', 'wrapper');
			wrapperHTMLElement.appendChildren([
				factory.makeSignature('set', setSignature),
				factory.makeBody(setSignature),
			]);

			this.appendChild(wrapperHTMLElement);
		}
	}

	private static factory = {
		makeSignature: (prefix: string, data: YafSignatureReflection) => {
			const title = makeElement<
				YafSignatureTitle,
				YafSignatureTitle['props']
			>('yaf-signature-title', null, null, { ...data, hideName: true });

			const preHTMLElement = makeElement('pre', 'highlight');
			preHTMLElement.appendChildren([
				makeSymbolSpan(`${prefix} `),
				makeNameSpan(data.name),
				title,
			]);

			return preHTMLElement;
		},
		makeBody: (data: YafSignatureReflection) =>
			makeElement<YafSignatureBody, YafSignatureBody['props']>(
				'yaf-signature-body',
				null,
				null,
				data
			),
	};
}

const yafMemberGetterSetter: componentName = 'yaf-member-getter-setter';
customElements.define(yafMemberGetterSetter, YafMemberGetterSetter);
