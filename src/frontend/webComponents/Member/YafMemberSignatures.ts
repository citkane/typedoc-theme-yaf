import { YafSignatureReflection } from '../../../types/types.js';
import appState from '../../handlers/AppState.js';
import { YafSignatureBody, YafSignatureTitle } from '../Signature/index.js';
import { makeFlags, makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';

export class YafMemberSignatures extends YafHTMLElement<
	YafSignatureReflection[]
> {
	onConnect() {
		this.props.forEach((signature) => {
			const { flags, comment } = signature;
			const { factory } = YafMemberSignatures;

			const flagsHTMLElement =
				this.props.length > 1 ? makeFlags(flags, comment) : undefined;
			const titleHTMLElement = factory.signatureTitle(signature);
			const bodyHTMLElement = factory.signatureBody(signature);

			this.appendChildren([
				flagsHTMLElement,
				titleHTMLElement,
				bodyHTMLElement,
			]);
		});
	}

	private static factory = {
		signatureTitle: (signature: YafSignatureReflection) =>
			makeElement<YafSignatureTitle, YafSignatureTitle['props']>(
				'yaf-signature-title',
				null,
				null,
				{
					...signature,
					hideName: false,
					arrowStyle:
						signature.kind ===
						appState.reflectionKind.CallSignature,
					wrappedInPre: true,
				}
			),
		signatureBody: (signature: YafSignatureReflection) =>
			makeElement<YafSignatureBody, YafSignatureBody['props']>(
				'yaf-signature-body',
				null,
				null,
				signature
			),
	};
}

const yafMemberSignatures = 'yaf-member-signatures';
customElements.define(yafMemberSignatures, YafMemberSignatures);
