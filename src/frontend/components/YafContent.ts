import { event, trigger } from '../lib/eventApi.js';
import {
	componentName,
	YAFDataObject,
	htmlString,
	YafDeclarationReflection,
	YafTypeParameterReflection,
	YafSignatureReflection,
} from '../types';
import { YafElement } from '../YafElement.js';
import { YafMemberDeclaration } from './members/YafMemberDeclaration.js';
import {
	YafContentMembers,
	YafMemberSignatures,
	YafMemberSources,
} from './YafContentMembers.js';
import { YafContentHeader } from './YafContentHeader.js';
import { YafContentMarked } from './YafContentMarked.js';
import { YafTypeParameters } from './YafTypeParameters.js';
import { TypeParameterReflection } from 'typedoc';

const componentName: componentName = 'yaf-content';

export class YafContent extends YafElement {
	constructor() {
		super(componentName);
	}

	connectedCallback() {
		if (this.debounce()) return;
		this.body.addEventListener(
			trigger.content.setLocation,
			this.fetchLocationData as EventListener
		);
		window.addEventListener(
			'popstate',
			this.fetchLocationData as EventListener
		);
		this.fetchLocationData();
	}
	disconnectedCallback() {
		this.body.removeEventListener(
			trigger.content.setLocation,
			this.fetchLocationData as EventListener
		);
		window.removeEventListener(
			'popstate',
			this.fetchLocationData as EventListener
		);
	}

	fetchLocationData = async () => {
		const getParam = new URL(window.location.href).searchParams;
		let page = getParam.get('page');
		page = decodeURIComponent(page || '');
		const data = await this.fetchData<YAFDataObject>(page || 'index');
		this.renderPageContent(data);

		this.body.dispatchEvent(event.content.scrollTo(0));
	};
	renderPageContent(data: YAFDataObject) {
		this.innerHTML = '';
		const { kindString, typeParameter, signatures, text, has } = data;

		if (
			['Variable', 'Type alias'].includes(kindString!) &&
			data.is.declaration
		) {
			this.makeContentHeader(data);
			this.makeMemberDeclaration(data as YafDeclarationReflection);
			return;
		}

		text.readme
			? this.makeContentMarked(text.readme)
			: this.makeContentHeader(data);
		if (text.comment) this.makeContentMarked(text.comment);
		if (has.typeParameters) this.makeTypeParamters(typeParameter);

		if (data.is.declaration) {
			//hierarchy
			//implements
			//implemented by

			if (signatures) this.makeMemberSignatures(signatures);
			//indexsignature

			if (!signatures) this.makeSources(data as YafDeclarationReflection);
		}
		this.makeMemberGroups(data);
	}
	makeContentHeader(data: YAFDataObject) {
		const header = this.makeElement<YafContentHeader>(
			'<yaf-content-header />'
		);
		header.props = data;
		this.appendChild(header);
	}

	makeContentMarked(html: htmlString) {
		const marked: YafContentMarked = this.makeElement(
			`<yaf-content-marked />`
		);
		marked.props = html;
		this.appendChild(marked);
	}

	makeMemberDeclaration(data: YafDeclarationReflection) {
		const declaration = this.makeElement<YafMemberDeclaration>(
			'<yaf-member-declaration />'
		);
		declaration.props = data;

		this.appendChild(declaration);
	}

	makeMemberGroups(data: YAFDataObject) {
		const pageGroups = this.makeElement<YafContentMembers>(
			'<yaf-content-members />'
		);
		pageGroups.props = {
			groups: data.groups,
			children: data.children,
		};
		this.appendChild(pageGroups);
	}
	makeTypeParamters(typeParameter: YafTypeParameterReflection[]) {
		const typeParameterElement: YafTypeParameters = this.makeElement(
			'<yaf-type-parameters />'
		);
		typeParameterElement.props = typeParameter;
		this.appendChild(typeParameterElement);
	}
	makeMemberSignatures(signatures: YafSignatureReflection[]) {
		const signaturesElement: YafMemberSignatures = this.makeElement(
			'<yaf-member-signatures />'
		);
		signaturesElement.props = signatures;
		this.appendChild(signaturesElement);
	}
	makeSources(data: YafDeclarationReflection) {
		console.warn(data);
		const sourcesElement: YafMemberSources = this.makeElement(
			'<yaf-member-sources />'
		);
		sourcesElement.props = data;
		this.appendChild(sourcesElement);
	}
}
customElements.define(componentName, YafContent);
