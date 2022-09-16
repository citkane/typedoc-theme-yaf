import { eventConstruct, eventType } from '../lib/eventApi.js';
import { componentName, YAFDataObject, htmlString } from '../types';
import { YAFElement } from '../lib/YafElement.js';

const componentName: componentName = 'yaf-content';
const body = document.querySelector('body') as HTMLBodyElement;

export class YafContent extends YAFElement {
	constructor() {
		super(componentName);
	}

	connectedCallback() {
		body.addEventListener(
			eventType.content.setLocation,
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
			eventType.content.setLocation,
			this.getLocationDetail as EventListener
		);
		window.removeEventListener(
			'popstate',
			this.getLocationDetail as EventListener
		);
	}

	getLocationDetail = async () => {
		const getParam = new URL(window.location.href).searchParams;
		let page = getParam.get('page');
		page = decodeURIComponent(page || '');
		const data = <YAFDataObject>await this.fetchData(page || 'index');
		this.parsePage(data);
		body.dispatchEvent(eventConstruct.content.scrollTo(0));
	};
	parsePage(data: YAFDataObject) {
		this.innerHTML = '';
		if (!data.text.readme) this.makeContentHeader(data);
		if (data.text.readme) this.makeContentMarked(data.text.readme);
		if (data.text.comment) this.makeContentMarked(data.text.comment);
		if (data.is.memberDeclaration) {
			this.makeMemberDeclaration(data);
		} else {
			console.log('not a memberDeclaration');
		}

		this.parsePageChildren(data);
	}
	parsePageChildren(data: YAFDataObject) {
		console.log(data.groups);
	}
	makeContentMarked(html: htmlString) {
		const marked = this.makeElement(`<yaf-content-marked />`);
		this.setPropTo(marked, 'markedHtml', html);
		this.appendChild(marked);
	}
	makeContentHeader(data: YAFDataObject) {
		const header = this.makeElement('<yaf-content-header />');
		this.setPropsTo(header, {
			isProject: data.is.project,
			isDeclaration: data.is.declaration,
			kind: data.kindString,
			name: data.name,
			version: data.version,
			typeParameters: data.typeParameters,
			flags: data.flags,
			comment: data.comment,
		});
		this.appendChild(header);
	}
	makeMemberDeclaration(data: YAFDataObject) {
		const { typeParameters, flags, type, defaultValue, name } = data;
		const signature = this.makeElement('<yaf-content-signature />');
		this.setPropsTo(signature, {
			typeParameters,
			flags,
			type,
			defaultValue,
			name,
		});
		this.appendChild(signature);
	}
}
customElements.define(componentName, YafContent);
