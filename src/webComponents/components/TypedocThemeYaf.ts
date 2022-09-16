import { componentName, reflectionMap } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';
//import { eventNames } from 'process';
import { eventType } from '../lib/eventApi.js';
//import { eventConstruct } from '../lib/eventApi.js';

const componentName: componentName = 'typedoc-theme-yaf';
const body = document.querySelector('body') as HTMLBodyElement;

export class TypedocThemeYaf extends YAFElement {
	constructor() {
		super(componentName);
		//this.shadow = this.attachShadow({ mode: 'open' });
		this.setTheme(this.theme);
	}
	reflectionMap: reflectionMap = {};
	theme = 'light' as 'light' | 'dark';
	async connectedCallback() {
		const html = await this.fetchTemplate('html');
		const css = await this.fetchTemplate('css');
		this.reflectionMap = await this.fetchData('reflectionMap');
		console.log(this.reflectionMap);
		const innerHtml = this.makeContent(html);
		const innerCss = this.makeElement(css);
		this.appendChild(innerCss);
		this.appendChild(innerHtml);

		body.addEventListener(
			eventType.fetch.reflectionById,
			this.reflectionById as EventListener
		);
	}
	disconnectedCallback() {
		body.removeEventListener(
			eventType.fetch.reflectionById,
			this.reflectionById as EventListener
		);
	}

	setTheme(theme: 'light' | 'dark') {
		document.body.classList.remove(
			theme === 'dark' ? 'lightTheme' : 'darkTheme'
		);
		document.body.classList.add(
			theme === 'dark' ? 'darkTheme' : 'lightTheme'
		);
		this.theme = theme;
	}
	reflectionById = (e: CustomEvent) => {
		const { id, callBack } = e.detail;
		const { fileName, level } = this.reflectionMap[id];
		this.fetchData(fileName).then((reflection) => {
			callBack(
				level
					? reflection.children?.find((child) => child.id === id)
					: reflection
			);
		});
	};
}
customElements.define(componentName, TypedocThemeYaf);

export { YafChromeLeft } from './YafChromeLeft.js';
export { YafNavigationMenu } from './YafNavigationMenu.js';
export { YafNavigationLink } from './YafNavigationLink.js';
export { YafContent } from './YafContent.js';
export { YafContentMarked } from './YafContentMarked.js';
export { YafContentHeader } from './YafContentHeader.js';
export { YafContentSignature } from './YafContentSignature.js';
export { YafContentSignatureLiteral } from './YafContentSignatureLiteral.js';
export { YafContentSignatureIntrinsic } from './YafContentSignatureIntrinsic.js';
export { YafContentSignatureReflection } from './YafContentSignatureReflection.js';
export { YafContentSignatureArray } from './YafContentSignatureArray.js';
export { YafContentSignatureReference } from './YafContentSignatureReference.js';
export { YafChromeContent } from './YafChromeContent.js';
