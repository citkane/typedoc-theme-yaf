import { componentName } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import appState from '../../lib/AppState.js';

export class YafWidgetKind extends YafHTMLElement<{ kind: string }> {
	onConnect() {
		const { kind } = this.props;
		if (kind) {
			const data = appState.kindSymbols[Number(kind)];
			this.classList.add(data.className || 'notfound');
			this.innerHTML = `<span>${data.symbol || '*'}</span>`;
		} else {
			this.parentElement?.removeChild(this);
		}
	}
}
const yafWidgetKind: componentName = 'yaf-widget-kind';
customElements.define(yafWidgetKind, YafWidgetKind);
