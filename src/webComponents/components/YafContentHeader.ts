import { componentName } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';
import { JSONOutput } from 'typedoc';

const componentName: componentName = 'yaf-content-header';

interface props {
	isProject: boolean;
	isDeclaration: boolean;
	kind: string;
	name: string;
	version: string;
	typeParameters: JSONOutput.TypeParameterReflection[] | undefined;
	flags: JSONOutput.ReflectionFlags;
	comment: JSONOutput.Comment;
}

export class YafContentHeader extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <props>this.props;
	connectedCallback() {
		const kind = !this.props.isProject
			? `<h3 style = "; border-bottom: 1px solid var(--col-line); padding-bottom: .5rem">${this.props.kind}</h3>`
			: '';
		const version = this.props.version
			? `<span> - v${this.props.version}</span>`
			: '';
		const params = this.props.typeParameters
			? `<span>${this.makeTypeParams(this.props.typeParameters)}</span>`
			: '';
		const flags = this.makeFlags(this.props.flags, this.props.comment);
		const name = `
			<div style="display: flex; align-items:center;">
				<h1>${this.props.name}${version}${params}</h1>
				${flags}
			</div>
		`;

		this.innerHTML = `<div style="display: inline-flex; flex-direction: column; align-items: stretch;">${kind}${name}</div>`;
		this.setAttribute('style', 'display: block');
	}
	makeTypeParams(params: JSONOutput.TypeParameterReflection[]) {
		return `<${params.map((param) => param.name).join(', ')}>`;
	}
	makeFlags(flags: JSONOutput.ReflectionFlags, comment: JSONOutput.Comment) {
		let allFlags = Object.keys(flags).map((flag) =>
			flag.replace('is', '').replace('has', '').toLowerCase()
		);
		if (comment?.modifierTags)
			allFlags = [...allFlags, ...comment.modifierTags];
		allFlags = allFlags.map(
			(flag) => `<yaf-content-flag>${flag}</yaf-content-flag>`
		);
		return allFlags.length
			? `<yaf-content-flags>${allFlags.join('')}</yaf-content-flags>`
			: '';
	}
}
customElements.define(componentName, YafContentHeader);
