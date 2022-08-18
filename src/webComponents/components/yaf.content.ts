import { yafEvents } from '../events.js';
import {
	componentName,
	fragmentUrl as fragmentUrl,
	contentHash,
} from '../types';
import { YAFElement } from '../YAFElement.js';

const componentName: componentName = 'yaf-content';
const body = document.querySelector('body') as HTMLBodyElement;

export class yafContent extends YAFElement {
	shadow: ShadowRoot;
	constructor() {
		super(componentName);
		this.shadow = this.attachShadow({ mode: 'closed' });
	}
	connectedCallback() {
		body.addEventListener(
			yafEvents.content.setLocation,
			this.getLocationDetail as EventListener
		);
		window.addEventListener(
			'popstate',
			this.getLocationDetail as EventListener
		);
		this.getLocationDetail();
	}
	disconnectedCallback() {
		body.removeEventListener(
			yafEvents.content.setLocation,
			this.getLocationDetail as EventListener
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	fetchLocationDetail = async (fragment: fragmentUrl, hash: contentHash) => {
		const html = await this.fetchHtmlOrCss(fragment);
		this.shadow.innerHTML = html;
	};
	getLocationDetail = () => {
		let partial = new URL(window.location.href).searchParams.get(
			'partial'
		) as fragmentUrl;
		!partial && (partial = 'home.html');
		console.log(partial);
		this.fetchLocationDetail(partial, window.location.hash as contentHash);
	};
}
customElements.define(componentName, yafContent);
