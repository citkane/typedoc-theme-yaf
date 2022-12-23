import {
	componentName,
	yafWidgetCounterProps,
} from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';

const countFontSize = '0.9rem';

export class YafWidgetCounter extends YafHTMLElement<yafWidgetCounterProps> {
	onConnect() {
		if (!this.props.fontSize) this.props.fontSize = countFontSize;

		this.innerHTML = `[ <span class='count'>${this.props.count}</span> ]`;
		if (this.props.fontSize)
			this.setAttribute('style', `font-size: ${this.props.fontSize};`);
	}
}
const yafWidgetCounter: componentName = 'yaf-widget-counter';
customElements.define(yafWidgetCounter, YafWidgetCounter);
