import appState from '../lib/AppState.js';

const countFontSize = '0.9rem';

export class YafWidgetCounter extends HTMLElement {
	props!: { count: number | string; fontSize?: string };

	connectedCallback() {
		if (!this.props.fontSize) this.props.fontSize = countFontSize;

		this.innerHTML = `[ <span class='count'>${this.props.count}</span> ]`;
		if (this.props.fontSize)
			this.setAttribute('style', `font-size: ${this.props.fontSize};`);
	}
}
const yafWidgetCounter = 'yaf-widget-counter';
customElements.define(yafWidgetCounter, YafWidgetCounter);

export class YafWidgetKind extends HTMLElement {
	props!: { kind: string };
	connectedCallback() {
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
const yafWidgetKind = 'yaf-widget-kind';
customElements.define(yafWidgetKind, YafWidgetKind);
