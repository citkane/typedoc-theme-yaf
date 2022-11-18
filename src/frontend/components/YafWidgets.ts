import { kindSymbol } from '../types';

const { yaf } = window;
const countFontSize = '0.9rem';

export class YafWidgetCounter extends HTMLElement {
	props!: { count: number | string; fontSize?: string };
	constructor() {
		super();
		if (!this.props.fontSize) this.props.fontSize = countFontSize;
	}
	connectedCallback() {
		this.innerHTML = `[ <span class='count'>${this.props.count}</span> ]`;
		if (this.props.fontSize)
			this.setAttribute('style', `font-size: ${this.props.fontSize};`);
	}
}
const yafWidgetCounter = 'yaf-widget-counter';
customElements.define(yafWidgetCounter, YafWidgetCounter);

export class YafWidgetKind extends HTMLElement {
	kind: kindSymbol | undefined;
	constructor() {
		super();
		const kind = this.getAttribute('kind');
		if (typeof kind !== 'undefined')
			this.kind = yaf.kindSymbols[Number(kind)];
	}
	connectedCallback() {
		if (this.kind) {
			this.classList.add(this.kind.className || 'notfound');
			this.innerHTML = `<span>${this.kind.symbol || '*'}</span>`;
		} else {
			this.parentElement?.removeChild(this);
		}
	}
}
const yafWidgetKind = 'yaf-widget-kind';
customElements.define(yafWidgetKind, YafWidgetKind);
